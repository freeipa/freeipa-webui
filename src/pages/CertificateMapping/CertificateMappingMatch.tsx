import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
import { Th, Tr } from "@patternfly/react-table";
// Data types
import { Certificate } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// Utils
import { removeCertificateDelimiters } from "src/utils/utils";
// RPC
import { useMatchCertificateMutation } from "src/services/rpcCertMapping";
import { ErrorResult } from "src/services/rpc";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import PageWithGrayBorderLayout from "src/components/layouts/PageWithGrayBorderLayout";
import TableLayout from "src/components/layouts/TableLayout";

interface TableEntry {
  userLogin: string;
  domain: string;
}

const CertificateMappingMatch = () => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "cert-id-mapping-match",
  });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // API calls
  const [matchCertificate] = useMatchCertificateMutation();

  // States
  const [certificateText, setCertificateText] = React.useState<string>("");
  const [issuedBy, setIssuedBy] = React.useState<string>("");
  const [issuedTo, setIssuedTo] = React.useState<string>("");
  const [serialNumber, setSerialNumber] = React.useState<string>("");
  const [serialNumberHex, setSerialNumberHex] = React.useState<string>("");
  const [validFrom, setValidFrom] = React.useState<string>("");
  const [validTo, setValidTo] = React.useState<string>("");
  const [fingerprintSha1, setFingerprintSha1] = React.useState<string>("");
  const [fingerprintSha256, setFingerprintSha256] = React.useState<string>("");
  // Table data
  const [tableElements, setTableElements] = React.useState<TableEntry[]>([]);

  // Extract subject values
  const extractSubjectValues = (subject: string) => {
    // Split the subject string into an array of strings
    const subjectArray = subject.split(",");
    // Find the "CN" and "O" values in the subject array
    const cnValueWithIndicator = subjectArray.find((item) =>
      item.trim().startsWith("CN=")
    );
    const oValueWithIndicator = subjectArray.find((item) =>
      item.trim().startsWith("O=")
    );
    // Extract the values from the strings
    const cnValue = cnValueWithIndicator
      ? cnValueWithIndicator.split("=")[1].trim()
      : "";
    const oValue = oValueWithIndicator
      ? oValueWithIndicator.split("=")[1].trim()
      : "";

    return { cnValue, oValue };
  };

  // On match certificate
  const onMatchCertificate = () => {
    const parsedCert = removeCertificateDelimiters(certificateText);

    matchCertificate(parsedCert).then((response) => {
      if ("data" in response && response.data?.result) {
        if (response.data.result.results[0].error) {
          const errorMessage = response.data.result.results[0].error as string;
          dispatch(
            addAlert({
              name: "match-certificate-error-1",
              title: errorMessage,
              variant: "danger",
            })
          );
        } else {
          const certData = response.data.result.results[1]
            .result[0] as Certificate;
          // Set certificate data
          setIssuedBy(certData.issuer);
          setIssuedTo(certData.subject);
          setSerialNumber(certData.serial_number);
          setSerialNumberHex(certData.serial_number_hex);
          setValidFrom(certData.valid_not_before);
          setValidTo(certData.valid_not_after);
          setFingerprintSha1(certData.sha1_fingerprint);
          setFingerprintSha256(certData.sha256_fingerprint);
          // Set table data
          const matchedUsers: TableEntry[] = [];
          const subject = certData.subject;
          const { cnValue, oValue } = extractSubjectValues(subject);
          // Add the values to the matchedUsers array
          if (cnValue && oValue) {
            matchedUsers.push({
              userLogin: cnValue,
              domain: oValue,
            });
          }
          setTableElements(matchedUsers);

          // Set alert: success
          dispatch(
            addAlert({
              name: "match-certificate-success",
              title: response.data.result.results[0].summary,
              variant: "success",
            })
          );
        }
      } else if ("data" in response && response.data?.error) {
        // Set alert: error
        const errorMessage = response.data.error as unknown as ErrorResult;
        dispatch(
          addAlert({
            name: "match-certificate-error",
            title: errorMessage.message,
            variant: "danger",
          })
        );
      }
    });
  };

  // On clear certificate data
  const onClearCertificate = () => {
    setCertificateText("");
    setIssuedBy("");
    setIssuedTo("");
    setSerialNumber("");
    setSerialNumberHex("");
    setValidFrom("");
    setValidTo("");
    setFingerprintSha1("");
    setFingerprintSha256("");
    setTableElements([]);
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          data-cy="certificate-identity-mapping-match-button-match"
          onClick={onMatchCertificate}
        >
          Match
        </Button>
      ),
    },
    {
      key: 1,
      element: (
        <Button
          data-cy="certificate-identity-mapping-match-button-clear"
          variant="secondary"
          onClick={onClearCertificate}
        >
          Clear
        </Button>
      ),
    },
  ];

  // Table
  const header = (
    <Tr key="header" id="table-header">
      <Th modifier="wrap" key="user_login">
        User login
      </Th>
      <Th modifier="wrap" key="domain">
        Domain
      </Th>
    </Tr>
  );

  const body = tableElements.map((element, rowIndex) => {
    return (
      <Tr key={rowIndex} id={`table-row-${rowIndex}`}>
        <td>{element.userLogin}</td>
        <td>{element.domain}</td>
      </Tr>
    );
  });

  // Return component
  return (
    <PageWithGrayBorderLayout
      id="certificate-mapping-match"
      pageTitle="Certificate Mapping Match"
      toolbarItems={toolbarFields}
    >
      <>
        <Sidebar isPanelRight>
          <SidebarPanel variant="sticky" className="pf-v6-u-pl-md">
            <HelpTextWithIconLayout
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100" />
              }
            />
          </SidebarPanel>
          <SidebarContent>
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <TitleLayout
                  key={0}
                  headingLevel="h1"
                  id="certificate-for-match"
                  text="Certificate for match"
                  className="pf-v6-u-mt-0 pf-v6-u-ml-0 pf-v6-u-mb-md"
                />
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup label="Certificate" fieldId="cert_textarea">
                    <TextArea
                      data-cy="certificate-identity-mapping-match-textbox-certificate"
                      name="cert_textarea"
                      aria-label="Certificate"
                      value={certificateText}
                      onChange={(_event, value) => setCertificateText(value)}
                      resizeOrientation="vertical"
                      rows={15}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
              <FlexItem flex={{ default: "flex_1" }}>
                <TitleLayout
                  key={1}
                  headingLevel="h1"
                  id="certificate-data"
                  text="Certificate data"
                  className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                />
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup label="Issued by" fieldId="issuer">
                    <TextInput
                      data-cy="certificate-identity-mapping-match-textbox-issuer"
                      name="issuer"
                      aria-label="Issued by text input"
                      type="text"
                      value={issuedBy}
                      isDisabled
                    />
                  </FormGroup>
                  <FormGroup label="Issued to" fieldId="subject">
                    <TextInput
                      data-cy="certificate-identity-mapping-match-textbox-subject"
                      name="subject"
                      aria-label="Issued to text input"
                      type="text"
                      value={issuedTo}
                      isDisabled
                    />
                  </FormGroup>
                  <FormGroup label="Serial number" fieldId="serial_number">
                    <TextInput
                      data-cy="certificate-identity-mapping-match-textbox-serial-number"
                      name="serial_number"
                      aria-label="Serial number text input"
                      type="text"
                      value={serialNumber}
                      isDisabled
                    />
                  </FormGroup>
                  <FormGroup
                    label="Serial number (hex)"
                    fieldId="serial_number_hex"
                  >
                    <TextInput
                      data-cy="certificate-identity-mapping-match-textbox-serial-number-hex"
                      name="serial_number_hex"
                      aria-label="Serial number in hexadecimal text input"
                      type="text"
                      value={serialNumberHex}
                      isDisabled
                    />
                  </FormGroup>
                  <FormGroup label="Valid from" fieldId="valid_not_before">
                    <TextInput
                      data-cy="certificate-identity-mapping-match-textbox-valid-from"
                      name="valid_not_before"
                      aria-label="Valid from text input"
                      type="text"
                      value={validFrom}
                      isDisabled
                    />
                  </FormGroup>
                  <FormGroup label="Valid to" fieldId="valid_not_after">
                    <TextInput
                      data-cy="certificate-identity-mapping-match-textbox-valid-to"
                      name="valid_not_after"
                      aria-label="Valid to text input"
                      type="text"
                      value={validTo}
                      isDisabled
                    />
                  </FormGroup>
                  <FormGroup
                    label="SHA1 Fingerprint"
                    fieldId="sha1_fingerprint"
                  >
                    <TextArea
                      data-cy="certificate-identity-mapping-match-textbox-sha1-fingerprint"
                      name="sha1_fingerprint"
                      aria-label="SHA1 Fingerprint text input"
                      value={fingerprintSha1}
                      resizeOrientation="vertical"
                      rows={2}
                      isDisabled
                    />
                  </FormGroup>
                  <FormGroup
                    label="SHA256 Fingerprint"
                    fieldId="sha256_fingerprint"
                  >
                    <TextArea
                      data-cy="certificate-identity-mapping-match-textbox-sha256-fingerprint"
                      name="sha256_fingerprint"
                      aria-label="SHA256 Fingerprint text input"
                      value={fingerprintSha256}
                      resizeOrientation="vertical"
                      rows={2}
                      isDisabled
                      autoResize={false}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
            <TitleLayout
              key={2}
              headingLevel="h1"
              id="matched-users"
              text="Matched users"
              className="pf-v6-u-mt-lg pf-v6-u-mb-md"
            />
            <TableLayout
              ariaLabel={"Matched users"}
              variant={"compact"}
              hasBorders={true}
              classes={"pf-v6-u-mt-md"}
              tableId={"matched-users-table"}
              isStickyHeader={true}
              tableHeader={header}
              tableBody={body}
            />
          </SidebarContent>
        </Sidebar>
      </>
    </PageWithGrayBorderLayout>
  );
};

export default CertificateMappingMatch;
