import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
// Component
import IpaCertificates, { PropsToIpaCertificates } from "./IpaCertificates";
// Utils
import {
  Certificate,
  CertificateAuthority,
} from "src/utils/datatypes/globalDataTypes";
import { parseDn } from "src/utils/utils";

interface MockReturn {
  data: { result: boolean } | { error: { message: string } };
}

interface CertificateAuthorityQuery {
  data?: CertificateAuthority[];
  isLoading: boolean;
}

/**
 * IpaCertificates.tsx
 */
const addCertificate: Mock<() => Promise<MockReturn>> = vi.fn(async () => {
  return { data: { result: true } };
});

/**
 * IpaCertificates.tsx
 */
const removeCertificate: Mock<() => Promise<MockReturn>> = vi.fn(async () => {
  return { data: { result: true } };
});

/**
 * RevokeCertificate.tsx
 */
const mockUseGetCertificateAuthorityQuery: Mock<
  () => CertificateAuthorityQuery
> = vi.fn(() => {
  return { isLoading: false };
});

/**
 * RevokeCertificate.tsx
 */
const certRevoke: Mock<() => Promise<MockReturn>> = vi.fn(async () => {
  return { data: { result: true } };
});

/**
 * RemoveHoldCertificate.tsx
 */
const certRemoveHold: Mock<() => Promise<MockReturn>> = vi.fn(async () => {
  return { data: { result: true } };
});

// Mock of rpc functions
vi.mock("src/services/rpcCerts", () => ({
  useAddCertificateMutation: () => [addCertificate],
  useRemoveCertificateMutation: () => [removeCertificate],
  // Should be mocked per test
  useGetCertificateAuthorityQuery: () => mockUseGetCertificateAuthorityQuery(),
  useRevokeCertificateMutation: () => [certRevoke],
  useRemoveHoldCertificateMutation: () => [certRemoveHold],
}));

describe("IpaCertificates Component", () => {
  const mockOnChange = vi.fn();
  const mockOnRefresh = vi.fn();

  const mockMetadata = {
    objects: {
      host: {
        name: "host",
        takes_params: [
          {
            alwaysask: false,
            attribute: false,
            autofill: false,
            class: "Certificate",
            cli_metavar: "CERTIFICATE",
            cli_name: "certificate",
            confirm: true,
            deprecated_cli_aliases: [],
            deprecated: false,
            doc: "Base-64 encoded host certificate",
            flags: [],
            label: "Certificate",
            maxlength: 255,
            multivalue: true,
            name: "usercertificate",
            no_convert: false,
            noextrawhitespace: true,
            pattern_errmsg: "",
            pattern: "",
            primary_key: false,
            query: false,
            required: false,
            sortorder: 2,
            type: "Certificate",
          },
        ],
      },
    },
  };

  const mockCertificate: Certificate = {
    serial_number: "722856757516404880666860043356108376880111652886",
    certificate:
      "MIIF7zCCA9egAwIBAgIUfp4En0keunisN1QSDGncxFjbkBYwDQYJKoZIhvcNAQELBQAwgYYxCzAJBgNVBAYTAlhYMRIwEAYDVQQIDAlTdGF0ZU5hbWUxETAPBgNVBAcMCENpdHlOYW1lMRQwEgYDVQQKDAtDb21wYW55TmFtZTEbMBkGA1UECwwSQ29tcGFueVNlY3Rpb25OYW1lMR0wGwYDVQQDDBRDb21tb25OYW1lT3JIb3N0bmFtZTAeFw0yNTAzMDcxMDIxMTlaFw0zNTAzMDUxMDIxMTlaMIGGMQswCQYDVQQGEwJYWDESMBAGA1UECAwJU3RhdGVOYW1lMREwDwYDVQQHDAhDaXR5TmFtZTEUMBIGA1UECgwLQ29tcGFueU5hbWUxGzAZBgNVBAsMEkNvbXBhbnlTZWN0aW9uTmFtZTEdMBsGA1UEAwwUQ29tbW9uTmFtZU9ySG9zdG5hbWUwggIiMA0GCSqGSIb3DQEBAQUA",
    subject:
      "CN=SubjectCommonNameOrHostname,OU=SubjectCompanySectionName,O=SubjectCompanyName,L=CityName,ST=StateName,C=XX",
    issuer:
      "CN=IssuerCommonNameOrHostname,OU=IssuerCompanySectionName,O=IssuerCompanyName,L=CityName,ST=StateName,C=XX",
    serial_number_hex: "0x7E9E049F491EBA78AC3754120C69DCC458DB9016",
    valid_not_before: "Fri Mar 07 10:21:19 2025 UTC",
    valid_not_after: "Mon Mar 05 10:21:19 2035 UTC",
    sha1_fingerprint:
      "94:86:f1:8b:1a:02:b3:5b:78:07:17:34:72:0b:d7:04:64:cc:8a:5f",
    sha256_fingerprint:
      "31:01:66:02:68:02:5c:6e:06:e7:e1:9d:29:42:52:c1:bb:74:ac:46:85:31:c9:3d:58:39:dd:64:41:80:46:6d",
    owner_user: ["server.ipa.demo"],
  };

  const mockIpaObject = {
    issuer:
      "CN=IssuerCommonNameOrHostname,OU=IssuerCompanySectionName,O=IssuerCompanyName,L=CityName,ST=StateName,C=XX",
    serial_number: "722856757516404880666860043356108376880111652886",
    serial_number_hex: "0x7E9E049F491EBA78AC3754120C69DCC458DB9016",
    sha1_fingerprint:
      "94:86:f1:8b:1a:02:b3:5b:78:07:17:34:72:0b:d7:04:64:cc:8a:5f",
    sha256_fingerprint:
      "31:01:66:02:68:02:5c:6e:06:e7:e1:9d:29:42:52:c1:bb:74:ac:46:85:31:c9:3d:58:39:dd:64:41:80:46:6d",
    subject:
      "CN=SubjectCommonNameOrHostname,OU=SubjectCompanySectionName,O=SubjectCompanyName,L=CityName,ST=StateName,C=XX",
    usercertificate: [
      {
        __base64__:
          "MIIF7zCCA9egAwIBAgIUfp4En0keunisN1QSDGncxFjbkBYwDQYJKoZIhvcNAQELBQAwgYYxCzAJBgNVBAYTAlhYMRIwEAYDVQQIDAlTdGF0ZU5hbWUxETAPBgNVBAcMCENpdHlOYW1lMRQwEgYDVQQKDAtDb21wYW55TmFtZTEbMBkGA1UECwwSQ29tcGFueVNlY3Rpb25OYW1lMR0wGwYDVQQDDBRDb21tb25OYW1lT3JIb3N0bmFtZTAeFw0yNTAzMDcxMDIxMTlaFw0zNTAzMDUxMDIxMTlaMIGGMQswCQYDVQQGEwJYWDESMBAGA1UECAwJU3RhdGVOYW1lMREwDwYDVQQHDAhDaXR5TmFtZTEUMBIGA1UECgwLQ29tcGFueU5hbWUxGzAZBgNVBAsMEkNvbXBhbnlTZWN0aW9uTmFtZTEdMBsGA1UEAwwUQ29tbW9uTmFtZU9ySG9zdG5hbWUwggIiMA0GCSqGSIb3DQEBAQUA",
      },
    ],
    valid_not_after: "Mon Mar 05 10:21:19 2035 UTC",
    valid_not_before: "Fri Mar 07 10:21:19 2025 UTC",
  };

  const defaultProps: PropsToIpaCertificates = {
    ipaObject: {},
    onChange: mockOnChange,
    metadata: mockMetadata,
    objectType: "host",
    onRefresh: mockOnRefresh,
  };

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the IpaCertificates with correct props", async () => {
    await act(async () => {
      render(<IpaCertificates {...defaultProps} />);
    });

    // Add button exists
    const addButton = screen.getByRole("button", { name: /Add/i });
    expect(addButton).toBeEnabled();

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Modal is now open
    // Test input box
    const certificateInput = screen.getByRole("textbox", {
      name: /new certificate modal text area/i,
    });
    expect(certificateInput).toBeEnabled();

    // Ensure input box is writable
    await act(async () => {
      fireEvent.change(certificateInput, {
        target: { value: mockCertificate.certificate },
      });
    });

    expect(certificateInput).toHaveValue(mockCertificate.certificate);

    // There should be two Add buttons
    const addButtons = screen.getAllByRole("button", { name: /Add/i });
    expect(addButtons.length).toBe(2);
    expect(addButtons[1]).toBeEnabled();

    // Test Cancel button exists
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    expect(cancelButton).toBeEnabled();

    // Click Cancel
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // Verify modal is closed by counting Add buttons
    const closedAddButtons = screen.getAllByRole("button", { name: /Add/i });
    expect(closedAddButtons.length).toBe(1);

    // Make sure Certificate has not been added
    expect(addCertificate).not.toHaveBeenCalled();
  });

  it("renders the non-empty IpaCertificates with correct props", async () => {
    const ISSUER_DN = parseDn(mockCertificate.issuer);
    const SUBJECT_DN = parseDn(mockCertificate.subject);

    const props: PropsToIpaCertificates = {
      ...defaultProps,
      ipaObject: mockIpaObject,
      certificates: [mockCertificate],
    };

    mockUseGetCertificateAuthorityQuery.mockReturnValue({
      data: [
        {
          cn: ["ipa"],
          description: ["IPA CA"],
          dn: "cn=ipa,cn=cas,cn=ca,dc=dom-ipa,dc=demo",
          ipacaid: ["ac885505-7121-49b5-87cb-25b453fa85db"],
          ipacaissuerdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
          ipacarandomserialnumberversion: ["0"],
          ipacasubjectdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
        },
      ],
      isLoading: false,
    });

    // Certificate should be valid
    vi.useFakeTimers().setSystemTime(new Date("2030-02-02"));

    await act(async () => {
      render(<IpaCertificates {...props} />);
    });

    // Add button exists
    const addButton = screen.getByRole("button", { name: /Add/i });
    expect(addButton).toBeEnabled();

    // Certificate exists
    screen.getByText(SUBJECT_DN.cn);

    // Expand button exists
    const expandButton = screen.getByRole("button", { name: SUBJECT_DN.cn });
    expect(expandButton).toBeEnabled();

    // Click Expand button
    await act(async () => {
      fireEvent.click(expandButton);
    });

    // Validate Serial number
    screen.getByText(mockCertificate.serial_number);

    // Validate Issued by
    screen.getByText(ISSUER_DN.cn);

    // Validate Valid from
    screen.getByText(mockCertificate.valid_not_before);

    // Validate Valid to
    screen.getByText(mockCertificate.valid_not_after);

    // Close Expand button
    await act(async () => {
      fireEvent.click(expandButton);
    });

    // Ensure Expand is closed by looking up issuerText
    const issuers = screen.queryAllByText(ISSUER_DN.cn);
    expect(issuers).toHaveLength(0);

    // Validate Kebab menu exists
    const kebabMenuButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });
    expect(kebabMenuButton).toBeEnabled();

    // Open Kebab menu
    await act(async () => {
      fireEvent.click(kebabMenuButton);
    });

    // Validate View button
    const viewButton = screen.getByRole("menuitem", { name: /View/i });
    expect(viewButton).toBeEnabled();

    // Click View button
    await act(async () => {
      fireEvent.click(viewButton);
    });

    // Validate View modal
    screen.getByText(ISSUER_DN.cn);
    screen.getByText(ISSUER_DN.o);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    screen.getByText(ISSUER_DN.ou!);
    screen.getByText(mockCertificate.serial_number);
    screen.getByText(mockCertificate.serial_number_hex);

    const subjects = screen.getAllByText(SUBJECT_DN.cn);
    expect(subjects).toHaveLength(2);
    screen.getByText(SUBJECT_DN.o);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    screen.getByText(SUBJECT_DN.ou!);

    screen.getByText(mockCertificate.valid_not_before);
    screen.getByText(mockCertificate.valid_not_after);

    screen.getByText(mockCertificate.sha1_fingerprint);
    screen.getByText(mockCertificate.sha256_fingerprint);

    // Validate Close button
    // One is the X in the corner
    const closeButtons = screen.getAllByRole("button", { name: /Close/i });
    expect(closeButtons[1]).toBeEnabled();

    // Click Close button
    await act(async () => {
      fireEvent.click(closeButtons[1]);
    });

    // Validate Get button
    const getButton = screen.getByRole("menuitem", { name: /Get/i });
    expect(getButton).toBeEnabled();

    // Click Get button
    await act(async () => {
      fireEvent.click(getButton);
    });

    // Certificate modal is now open
    const certificateTextarea = screen.getByRole("textbox");
    expect(certificateTextarea).toBeDisabled();

    // Validate certificate
    const certificateValue =
      "-----BEGIN CERTIFICATE-----\n" +
      mockCertificate.certificate +
      "\n-----END CERTIFICATE-----";
    expect(certificateTextarea).toHaveValue(certificateValue);
    expect(certificateTextarea).toBeDisabled();

    // Validate close button
    const closeButtonsOpen = screen.getAllByRole("button", { name: /Close/i });
    expect(closeButtonsOpen[1]).toBeEnabled();

    // Click Close button
    await act(async () => {
      fireEvent.click(closeButtonsOpen[1]);
    });

    // Validate Download button
    const downloadButton = screen.getByRole("menuitem", { name: /Download/i });
    expect(downloadButton).toBeEnabled();

    // Validate Revoke button is disabled
    const revokeButton = screen.getByRole("menuitem", { name: /Revoke/i });
    expect(revokeButton).toBeDisabled();

    // Validate Remove hold button is disabled
    const removeHoldButton = screen.getByRole("menuitem", {
      name: /Remove hold/i,
    });
    expect(removeHoldButton).toBeDisabled();

    // Validate Delete button
    const deleteButton = screen.getByRole("menuitem", { name: /Delete/i });
    expect(deleteButton).toBeEnabled();

    // Click Delete
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Modal should be open now
    // Validate Serial number
    screen.getByText(mockCertificate.serial_number);

    // Validate Delete button
    const deleteButtonModal = screen.getByRole("button", { name: /Delete/i });
    expect(deleteButtonModal).toBeEnabled();

    // Validate Cancel button
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    expect(cancelButton).toBeEnabled();

    // Click Cancel button
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // Make sure Certificate has not been deleted
    expect(removeCertificate).not.toHaveBeenCalled();
  });

  it("adds new certificate when Add is clicked", async () => {
    await act(async () => {
      render(<IpaCertificates {...defaultProps} />);
    });

    // Add button exists
    const addButton = screen.getByRole("button", { name: /Add/i });

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Modal is now open
    // Test input box
    const certificateInput = screen.getByRole("textbox", {
      name: /new certificate modal text area/i,
    });

    // Write mock certificate
    await act(async () => {
      fireEvent.change(certificateInput, {
        target: { value: mockCertificate.certificate },
      });
    });

    expect(certificateInput).toHaveValue(mockCertificate.certificate);

    // There should be two Add buttons
    const addButtons = screen.getAllByRole("button", { name: /Add/i });

    // Click correct Add button
    await act(async () => {
      fireEvent.click(addButtons[1]);
    });

    // Sadly we have no way of knowing, whether certificate has been added or not
    expect(addCertificate).toHaveBeenCalledWith([
      undefined,
      mockCertificate.certificate,
      defaultProps.objectType,
    ]);
  });

  it("does not add new certificate when error is encountered after clicking Add", async () => {
    await act(async () => {
      render(<IpaCertificates {...defaultProps} />);
    });

    // Add button exists
    const addButton = screen.getByRole("button", { name: /Add/i });

    // Click Add button
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Modal is now open
    // Test input box
    const certificateInput = screen.getByRole("textbox", {
      name: /new certificate modal text area/i,
    });

    // Write mock certificate
    await act(async () => {
      fireEvent.change(certificateInput, {
        target: { value: mockCertificate.certificate },
      });
    });

    expect(certificateInput).toHaveValue(mockCertificate.certificate);

    // There should be two Add buttons
    const addButtons = screen.getAllByRole("button", { name: /Add/i });

    // Mock error
    addCertificate.mockReturnValue(
      new Promise((resolve) =>
        resolve({ data: { error: { message: "error" } } })
      )
    );

    // Click correct Add button
    await act(async () => {
      fireEvent.click(addButtons[1]);
    });

    // Sadly we have no way of knowing, whether certificate has been added or not
    expect(addCertificate).toHaveBeenCalledWith([
      undefined,
      mockCertificate.certificate,
      defaultProps.objectType,
    ]);
  });

  it("revokes certificate on revoke-able certificate", async () => {
    const certificate = { ...mockCertificate, cacn: "ipa" };
    const props: PropsToIpaCertificates = {
      ...defaultProps,
      ipaObject: mockIpaObject,
      // Mock issued by ipa
      certificates: [certificate],
    };

    mockUseGetCertificateAuthorityQuery.mockReturnValue({
      data: [
        {
          cn: ["ipa"],
          description: ["IPA CA"],
          dn: "cn=ipa,cn=cas,cn=ca,dc=dom-ipa,dc=demo",
          ipacaid: ["ac885505-7121-49b5-87cb-25b453fa85db"],
          ipacaissuerdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
          ipacarandomserialnumberversion: ["0"],
          ipacasubjectdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
        },
      ],
      isLoading: false,
    });

    // Certificate should be valid
    vi.useFakeTimers().setSystemTime(new Date("2030-02-02"));

    await act(async () => {
      render(<IpaCertificates {...props} />);
    });

    // Validate Kebab menu exists
    const kebabMenuButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });

    // Open Kebab menu
    await act(async () => {
      fireEvent.click(kebabMenuButton);
    });

    // Validate Revoke button is enabled
    const revokeButton = screen.getByRole("menuitem", { name: /Revoke/i });
    expect(revokeButton).toBeEnabled();

    // Click Revoke button
    await act(async () => {
      fireEvent.click(revokeButton);
    });

    // Validate Cancel button
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    expect(cancelButton).toBeEnabled();

    // Click Cancel button
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    // Make sure Certificate has not been revoked
    expect(certRevoke).not.toHaveBeenCalled();

    // Revoke for real now
    // Click Revoke button
    await act(async () => {
      fireEvent.click(revokeButton);
    });

    // Validate Revoke button exists
    const revokeButtonModal = screen.getByRole("button", { name: /Revoke/i });
    expect(revokeButtonModal).toBeEnabled();

    // Click Revoke
    await act(async () => {
      fireEvent.click(revokeButtonModal);
    });

    // Sadly we have no way of knowing, whether certificate has been revoked or not
    expect(certRevoke).toHaveBeenCalledWith([
      certificate.serial_number,
      "0",
      certificate.cacn,
    ]);
  });

  it("does not revoke certificate when error is encountered after clicking Revoke", async () => {
    const certificate = { ...mockCertificate, cacn: "ipa" };
    const props: PropsToIpaCertificates = {
      ...defaultProps,
      ipaObject: mockIpaObject,
      // Mock issued by ipa
      certificates: [certificate],
    };

    mockUseGetCertificateAuthorityQuery.mockReturnValue({
      data: [
        {
          cn: ["ipa"],
          description: ["IPA CA"],
          dn: "cn=ipa,cn=cas,cn=ca,dc=dom-ipa,dc=demo",
          ipacaid: ["ac885505-7121-49b5-87cb-25b453fa85db"],
          ipacaissuerdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
          ipacarandomserialnumberversion: ["0"],
          ipacasubjectdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
        },
      ],
      isLoading: false,
    });

    // Certificate should be valid
    vi.useFakeTimers().setSystemTime(new Date("2030-02-02"));

    await act(async () => {
      render(<IpaCertificates {...props} />);
    });

    // Validate Kebab menu exists
    const kebabMenuButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });

    // Open Kebab menu
    await act(async () => {
      fireEvent.click(kebabMenuButton);
    });

    // Validate Revoke button exists
    const revokeButton = screen.getByRole("menuitem", { name: /Revoke/i });

    // Click Revoke button
    await act(async () => {
      fireEvent.click(revokeButton);
    });

    // Validate Revoke button exists
    const revokeButtonModal = screen.getByRole("button", { name: /Revoke/i });

    // Mock error
    certRevoke.mockReturnValue(
      new Promise((resolve) =>
        resolve({ data: { error: { message: "error" } } })
      )
    );

    // Click Revoke
    await act(async () => {
      fireEvent.click(revokeButtonModal);
    });

    // Sadly we have no way of knowing, whether certificate has been revoked or not
    expect(certRevoke).toHaveBeenCalledWith([
      certificate.serial_number,
      "0",
      certificate.cacn,
    ]);
  });

  it("enables remove hold on certain certificate", async () => {
    const certificate = {
      ...mockCertificate,
      cacn: "ipa",
      revocation_reason: 6,
    };
    const props: PropsToIpaCertificates = {
      ...defaultProps,
      ipaObject: mockIpaObject,
      // Mock issued by ipa
      certificates: [certificate],
    };

    mockUseGetCertificateAuthorityQuery.mockReturnValue({
      data: [
        {
          cn: ["ipa"],
          description: ["IPA CA"],
          dn: "cn=ipa,cn=cas,cn=ca,dc=dom-ipa,dc=demo",
          ipacaid: ["ac885505-7121-49b5-87cb-25b453fa85db"],
          ipacaissuerdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
          ipacarandomserialnumberversion: ["0"],
          ipacasubjectdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
        },
      ],
      isLoading: false,
    });

    // Certificate should be valid
    vi.useFakeTimers().setSystemTime(new Date("2030-02-02"));

    await act(async () => {
      render(<IpaCertificates {...props} />);
    });

    // Validate Kebab menu exists
    const kebabMenuButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });

    // Open Kebab menu
    await act(async () => {
      fireEvent.click(kebabMenuButton);
    });

    // Validate Remove hold button is enabled
    const removeHoldButton = screen.getByRole("menuitem", {
      name: /Remove hold/i,
    });
    expect(removeHoldButton).toBeEnabled();

    // Click Remove hold button
    await act(async () => {
      fireEvent.click(removeHoldButton);
    });

    // Validate Close button, there is 2 of them (we want the first one)
    const closeButtons = screen.getAllByRole("button", { name: /Close/i });
    expect(closeButtons[0]).toBeEnabled();

    // Click Cancel button
    await act(async () => {
      fireEvent.click(closeButtons[0]);
    });

    // Make sure Certificate has not been remove holded
    expect(certRemoveHold).not.toHaveBeenCalled();

    // Remove hold for real now
    // Click Remove hold button
    await act(async () => {
      fireEvent.click(removeHoldButton);
    });

    // Validate Remove hold button exists
    const removeHoldButtonModal = screen.getByRole("button", {
      name: /Remove hold/i,
    });
    expect(removeHoldButtonModal).toBeEnabled();

    // Click Remove hold
    await act(async () => {
      fireEvent.click(removeHoldButtonModal);
    });

    // Sadly we have no way of knowing, whether certificate has been remove hold or not
    expect(certRemoveHold).toHaveBeenCalledWith([
      certificate.serial_number,
      certificate.cacn,
    ]);
  });

  it("does not remove hold certificate when error is encountered after clicking Remove hold", async () => {
    const certificate = {
      ...mockCertificate,
      cacn: "ipa",
      revocation_reason: 6,
    };
    const props: PropsToIpaCertificates = {
      ...defaultProps,
      ipaObject: mockIpaObject,
      // Mock issued by ipa
      certificates: [certificate],
    };

    mockUseGetCertificateAuthorityQuery.mockReturnValue({
      data: [
        {
          cn: ["ipa"],
          description: ["IPA CA"],
          dn: "cn=ipa,cn=cas,cn=ca,dc=dom-ipa,dc=demo",
          ipacaid: ["ac885505-7121-49b5-87cb-25b453fa85db"],
          ipacaissuerdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
          ipacarandomserialnumberversion: ["0"],
          ipacasubjectdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
        },
      ],
      isLoading: false,
    });

    // Certificate should be valid
    vi.useFakeTimers().setSystemTime(new Date("2030-02-02"));

    await act(async () => {
      render(<IpaCertificates {...props} />);
    });

    // Validate Kebab menu exists
    const kebabMenuButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });

    // Open Kebab menu
    await act(async () => {
      fireEvent.click(kebabMenuButton);
    });

    // Validate Remove hold button exists
    const removeHoldButton = screen.getByRole("menuitem", {
      name: /Remove hold/i,
    });
    expect(removeHoldButton).toBeEnabled();

    // Click Remove hold button
    await act(async () => {
      fireEvent.click(removeHoldButton);
    });

    // Validate Remove hold button exists
    const removeHoldButtonModal = screen.getByRole("button", {
      name: /Remove hold/i,
    });

    // Mock error
    certRemoveHold.mockReturnValue(
      new Promise((resolve) =>
        resolve({ data: { error: { message: "error" } } })
      )
    );

    // Click Remove hold
    await act(async () => {
      fireEvent.click(removeHoldButtonModal);
    });

    // Sadly we have no way of knowing, whether certificate has been remove hold or not
    expect(certRemoveHold).toHaveBeenCalledWith([
      certificate.serial_number,
      certificate.cacn,
    ]);
  });

  it("deletes certificate when clicking Delete", async () => {
    const SUBJECT_DN = parseDn(mockCertificate.subject);

    const props: PropsToIpaCertificates = {
      ...defaultProps,
      ipaObject: mockIpaObject,
      certificates: [mockCertificate],
    };

    mockUseGetCertificateAuthorityQuery.mockReturnValue({
      data: [
        {
          cn: ["ipa"],
          description: ["IPA CA"],
          dn: "cn=ipa,cn=cas,cn=ca,dc=dom-ipa,dc=demo",
          ipacaid: ["ac885505-7121-49b5-87cb-25b453fa85db"],
          ipacaissuerdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
          ipacarandomserialnumberversion: ["0"],
          ipacasubjectdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
        },
      ],
      isLoading: false,
    });

    // Certificate should be valid
    vi.useFakeTimers().setSystemTime(new Date("2030-02-02"));

    await act(async () => {
      render(<IpaCertificates {...props} />);
    });

    // Certificate exists
    screen.getByText(SUBJECT_DN.cn);

    // Validate Kebab menu exists
    const kebabMenuButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });

    // Open Kebab menu
    await act(async () => {
      fireEvent.click(kebabMenuButton);
    });

    // Validate Delete button
    const deleteButton = screen.getByRole("menuitem", { name: /Delete/i });
    expect(deleteButton).toBeEnabled();

    // Click Delete
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Modal should be open now
    // Validate Delete button
    const deleteButtonModal = screen.getByRole("button", { name: /Delete/i });
    expect(deleteButtonModal).toBeEnabled();

    // Click Delete button
    await act(async () => {
      fireEvent.click(deleteButtonModal);
    });

    // Sadly we have no way of knowing, whether certificate has been deleted or not
    expect(removeCertificate).toHaveBeenCalledWith([
      undefined,
      mockCertificate.certificate,
      defaultProps.objectType,
    ]);
  });

  it("does not delete certificate when error is encountered after clicking Delete", async () => {
    const SUBJECT_DN = parseDn(mockCertificate.subject);

    const props: PropsToIpaCertificates = {
      ...defaultProps,
      ipaObject: mockIpaObject,
      certificates: [mockCertificate],
    };

    mockUseGetCertificateAuthorityQuery.mockReturnValue({
      data: [
        {
          cn: ["ipa"],
          description: ["IPA CA"],
          dn: "cn=ipa,cn=cas,cn=ca,dc=dom-ipa,dc=demo",
          ipacaid: ["ac885505-7121-49b5-87cb-25b453fa85db"],
          ipacaissuerdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
          ipacarandomserialnumberversion: ["0"],
          ipacasubjectdn: ["CN=Certificate Authority,O=DOM-IPA.DEMO"],
        },
      ],
      isLoading: false,
    });

    // Certificate should be valid
    vi.useFakeTimers().setSystemTime(new Date("2030-02-02"));

    await act(async () => {
      render(<IpaCertificates {...props} />);
    });

    // Certificate exists
    screen.getByText(SUBJECT_DN.cn);

    // Validate Kebab menu exists
    const kebabMenuButton = screen.getByRole("button", {
      name: "kebab dropdown toggle",
    });

    // Open Kebab menu
    await act(async () => {
      fireEvent.click(kebabMenuButton);
    });

    // Validate Delete button
    const deleteButton = screen.getByRole("menuitem", { name: /Delete/i });
    expect(deleteButton).toBeEnabled();

    // Click Delete
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Modal should be open now
    // Validate Delete button
    const deleteButtonModal = screen.getByRole("button", { name: /Delete/i });
    expect(deleteButtonModal).toBeEnabled();

    // Mock error
    removeCertificate.mockReturnValue(
      new Promise((resolve) =>
        resolve({ data: { error: { message: "error" } } })
      )
    );

    // Click Delete button
    await act(async () => {
      fireEvent.click(deleteButtonModal);
    });

    // Sadly we have no way of knowing, whether certificate has been deleted or not
    expect(removeCertificate).toHaveBeenCalledWith([
      undefined,
      mockCertificate.certificate,
      defaultProps.objectType,
    ]);
  });
});
