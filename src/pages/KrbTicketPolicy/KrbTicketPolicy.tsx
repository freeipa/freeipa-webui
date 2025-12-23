import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Data types
import { KrbTicket } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { useKrbTicketPolicyData } from "src/hooks/useKrbTicketPolicyData";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import {
  KrbTicketModPayload,
  useKrbTicketModMutation,
} from "src/services/rpcKrbTicketPolicy";
// Components
import { NotFound } from "src/components/errors/PageErrors";
import DataSpinner from "src/components/layouts/DataSpinner";
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import { asRecord } from "src/utils/krbTicketUtils";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import IpaTextInput from "src/components/Form/IpaTextInput";
import PageWithGrayBorderLayout from "src/components/layouts/PageWithGrayBorderLayout";

const KrbTicketPolicy = () => {
  const dispatch = useAppDispatch();

  // API calls
  const krbTicketPolicyData = useKrbTicketPolicyData();
  const [saveKrbTicketPolicy] = useKrbTicketModMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "kerberos-ticket-policy",
  });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    krbTicketPolicyData.krbTicket,
    krbTicketPolicyData.setKrbTicket
  );

  // Helper method to build the payload based on values
  const buildPayload = (
    modifiedValues: Partial<KrbTicket>,
    keyArray: string[]
  ): KrbTicketModPayload => {
    const payload: KrbTicketModPayload = {};

    keyArray.forEach((key) => {
      // Modified values are either the value (in string) or an array ([]) when set to empty string
      if (modifiedValues[key] !== undefined) {
        if (modifiedValues[key] === "") {
          payload[key] = [];
        } else {
          payload[key] = modifiedValues[key];
        }
      }
    });
    return payload;
  };

  // 'Revert' handler method
  const onRevert = () => {
    krbTicketPolicyData.setKrbTicket(krbTicketPolicyData.originalPwPolicy);
    krbTicketPolicyData.refetch();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Password policy data reverted",
        variant: "success",
      })
    );
  };

  // on Save handler method
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = krbTicketPolicyData.modifiedValues();

    // Generate payload
    const payload = buildPayload(modifiedValues, [
      "krbmaxrenewableage",
      "krbmaxticketlife",
      "krbauthindmaxrenewableage_radius",
      "krbauthindmaxticketlife_radius",
      "krbauthindmaxrenewableage_otp",
      "krbauthindmaxticketlife_otp",
      "krbauthindmaxrenewableage_pkinit",
      "krbauthindmaxticketlife_pkinit",
      "krbauthindmaxrenewableage_hardened",
      "krbauthindmaxticketlife_hardened",
      "krbauthindmaxticketlife_idp",
      "krbauthindmaxticketlife_passkey",
      "krbauthindmaxrenewableage_passkey",
      "krbauthindmaxrenewableage_idp",
    ]);

    saveKrbTicketPolicy(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          dispatch(
            addAlert({
              name: "error",
              title: (data.error as Error).message,
              variant: "danger",
            })
          );
        }
        if (data?.result) {
          krbTicketPolicyData.setKrbTicket(data.result.result);
          dispatch(
            addAlert({
              name: "success",
              title: "Kerberos ticket policy updated",
              variant: "success",
            })
          );
          // Reset values. Disable 'revert' and 'save' buttons
          krbTicketPolicyData.resetValues();
        }
      }
      setIsDataLoading(false);
    });
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="krb-ticket-policy-button-refresh"
          onClickHandler={krbTicketPolicyData.refetch}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          dataCy="krb-ticket-policy-button-revert"
          isDisabled={!krbTicketPolicyData.modified || isDataLoading}
          onClickHandler={onRevert}
        >
          Revert
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          dataCy="krb-ticket-policy-button-save"
          isDisabled={!krbTicketPolicyData.modified || isDataLoading}
          onClickHandler={onSave}
        >
          Save
        </SecondaryButton>
      ),
    },
  ];

  // Handling of the API data
  if (krbTicketPolicyData.isLoading || !krbTicketPolicyData.krbTicket) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the host is not found
  if (
    !krbTicketPolicyData.isLoading &&
    Object.keys(krbTicketPolicyData.krbTicket).length === 0
  ) {
    return <NotFound />;
  }

  // Return component
  return (
    <PageWithGrayBorderLayout
      id="krb-ticket-policy-page"
      pageTitle="Kerberos ticket policy"
      toolbarItems={toolbarFields}
    >
      <>
        <Sidebar isPanelRight className="pf-v6-u-mb-0">
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
              }
            />
            <JumpLinks
              isVertical
              label="Jump to section"
              scrollableSelector="#krb-ticket-policy-page"
              expandable={{ default: "expandable", md: "nonExpandable" }}
              className="pf-v6-u-mt-md"
            >
              <JumpLinksItem key={0} href="#krb-ticket-policy">
                Kerberos Ticket Policy
              </JumpLinksItem>
              <JumpLinksItem key={1} href="#authentication-indicators">
                Authentication indicators
              </JumpLinksItem>
            </JumpLinks>
          </SidebarPanel>
          <SidebarContent className="pf-v6-u-mr-xl">
            <TitleLayout
              key={0}
              headingLevel="h2"
              id="krb-ticket-policy"
              text="Kerberos Ticket Policy"
              className="pf-v6-u-mt-0 pf-v6-u-ml-0 pf-v6-u-mb-md"
            />
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup
                    label="Max renew (seconds)"
                    fieldId="krbmaxrenewableage"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-max-renew"
                      name={"krbmaxrenewableage"}
                      ariaLabel={"Max renew (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup
                    label="Max life (seconds)"
                    fieldId="krbmaxticketlife"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-max-life"
                      name={"krbmaxticketlife"}
                      ariaLabel={"Max life (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
            <TitleLayout
              key={1}
              headingLevel="h2"
              id="authentication-indicators"
              text="Authentication indicators"
              className="pf-v6-u-mt-lg pf-v6-u-mb-md"
            />
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup
                    label="RADIUS max renew (seconds)"
                    fieldId="krbauthindmaxrenewableage_radius"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-radius-max-renew"
                      name={"krbauthindmaxrenewableage_radius"}
                      ariaLabel={"RADIUS max renew (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="RADIUS max life (seconds)"
                    fieldId="krbauthindmaxticketlife_radius"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-radius-max-life"
                      name={"krbauthindmaxticketlife_radius"}
                      ariaLabel={"RADIUS max life (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="OTP max renew (seconds)"
                    fieldId="krbauthindmaxrenewableage_otp"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-otp-max-renew"
                      name={"krbauthindmaxrenewableage_otp"}
                      ariaLabel={"OTP max renew (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="OTP max life (seconds)"
                    fieldId="krbauthindmaxticketlife_otp"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-otp-max-life"
                      name={"krbauthindmaxticketlife_otp"}
                      ariaLabel={"OTP max life (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="PKINIT max renew (seconds)"
                    fieldId="krbauthindmaxrenewableage_pkinit"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-pkinit-max-renew"
                      name={"krbauthindmaxrenewableage_pkinit"}
                      ariaLabel={"PKINIT max renew (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="PKINIT max life (seconds)"
                    fieldId="krbauthindmaxticketlife_pkinit"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-pkinit-max-life"
                      name={"krbauthindmaxticketlife_pkinit"}
                      ariaLabel={"PKINIT max life (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup
                    label="Hardened max renew (seconds)"
                    fieldId="krbauthindmaxrenewableage_hardened"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-hardened-max-renew"
                      name={"krbauthindmaxrenewableage_hardened"}
                      ariaLabel={"Hardened max renew (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Hardened max life (seconds)"
                    fieldId="krbauthindmaxticketlife_hardened"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-hardened-max-life"
                      name={"krbauthindmaxticketlife_hardened"}
                      ariaLabel={"Hardened max life (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="IdP max renew (seconds)"
                    fieldId="krbauthindmaxrenewableage_idp"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-idp-max-renew"
                      name={"krbauthindmaxrenewableage_idp"}
                      ariaLabel={"IdP max renew (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="IdP max life (seconds)"
                    fieldId="krbauthindmaxticketlife_idp"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-idp-max-life"
                      name={"krbauthindmaxticketlife_idp"}
                      ariaLabel={"IdP max life (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Passkey max renew (seconds)"
                    fieldId="krbauthindmaxrenewableage_passkey"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-passkey-max-renew"
                      name={"krbauthindmaxrenewableage_passkey"}
                      ariaLabel={"Passkey max renew (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Passkey max life (seconds)"
                    fieldId="krbauthindmaxticketlife_passkey"
                  >
                    <IpaTextInput
                      dataCy="krb-ticket-policy-textbox-passkey-max-life"
                      name={"krbauthindmaxticketlife_passkey"}
                      ariaLabel={"Passkey max life (seconds)"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="krbtpolicy"
                      metadata={krbTicketPolicyData.metadata}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
          </SidebarContent>
        </Sidebar>
      </>
    </PageWithGrayBorderLayout>
  );
};

export default KrbTicketPolicy;
