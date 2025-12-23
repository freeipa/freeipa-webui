import React from "react";
// PatternFly
import {
  DropdownItem,
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
import { IDPServer, Metadata } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { addAlert } from "src/store/Global/alerts-slice";
// Utils
import { asRecord } from "src/utils/subIdUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import { IdpModPayload, useIdpModMutation } from "src/services/rpcIdp";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import IpaTextContent from "src/components/Form/IpaTextContent/IpaTextContent";
import TitleLayout from "src/components/layouts/TitleLayout";
import IpaPasswordInput from "src/components/Form/IpaPasswordInput";
import KebabLayout from "src/components/layouts/KebabLayout";
import ResetIdpPassword from "src/components/ResetIdpPassword";

interface PropsToIdpRefSettings {
  idpRef: Partial<IDPServer>;
  originalIdpRef: Partial<IDPServer>;
  metadata: Metadata;
  onIdpRefChange: (idpRef: Partial<IDPServer>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<IDPServer>;
  onResetValues: () => void;
  pathname: string;
}

const IdpRefSettings = (props: PropsToIdpRefSettings) => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.idpRef,
    props.onIdpRefChange
  );

  // API calls
  const [saveIdpRef] = useIdpModMutation();

  // 'Revert' handler method
  const onRevert = () => {
    props.onIdpRefChange(props.originalIdpRef);
    props.onRefresh();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Identity Provider data reverted",
        variant: "success",
      })
    );
  };

  // Helper method to build the payload based on values
  const buildPayload = (
    modifiedValues: Partial<IDPServer>,
    keyArray: string[]
  ): IdpModPayload => {
    const payload: IdpModPayload = {
      idpId: props.idpRef.cn?.toString() as string,
    };

    keyArray.forEach((key) => {
      // Modified values are either the value (in string) or an array ([]) when set to empty string
      if (modifiedValues[key] !== undefined) {
        if (modifiedValues[key] === "") {
          payload[key] = [];
        } else {
          payload[key] = modifiedValues[key].toString();
        }
      }
    });
    return payload;
  };

  // on Save handler method
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();

    // Generate payload
    const payload = buildPayload(modifiedValues, [
      "ipaidpclientid",
      "ipaidpclientsecret",
      "ipaidpscope",
      "ipaidpsub",
      "ipaidpauthendpoint",
      "ipaidpdevauthendpoint",
      "ipaidptokenendpoint",
      "ipaidpuserinfoendpoint",
      "ipaidpkeysendpoint",
      "ipaidpissuerurl",
    ]);

    saveIdpRef(payload).then((response) => {
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
          props.onIdpRefChange(data.result.result);
          dispatch(
            addAlert({
              name: "success",
              title: "Identity Provider '" + props.idpRef.cn + "' updated",
              variant: "success",
            })
          );
          // Reset values. Disable 'revert' and 'save' buttons
          props.onResetValues();
        }
      }
      setIsDataLoading(false);
    });
  };

  // 'Reset password' option
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    React.useState(false);

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);

  const kebabItems = [
    <DropdownItem
      data-cy="idp-references-tab-settings-kebab-reset-password"
      key="reset password"
      onClick={() => setIsResetPasswordModalOpen(true)}
    >
      Reset password
    </DropdownItem>,
  ];

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="idp-references-tab-settings-button-refresh"
          onClickHandler={props.onRefresh}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          dataCy="idp-references-tab-settings-button-revert"
          isDisabled={!props.isModified || isDataLoading}
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
          dataCy="idp-references-tab-settings-button-save"
          isDisabled={!props.isModified || isDataLoading}
          onClickHandler={onSave}
        >
          Save
        </SecondaryButton>
      ),
    },
    {
      key: 3,
      element: (
        <KebabLayout
          dataCy="idp-references-tab-settings-kebab"
          direction={"up"}
          onDropdownSelect={() => setIsKebabOpen(!isKebabOpen)}
          onKebabToggle={() => setIsKebabOpen(!isKebabOpen)}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={kebabItems}
          isDisabled={isDataLoading}
        />
      ),
    },
  ];

  // Render component
  return (
    <>
      <TabLayout id="settings-page" toolbarItems={toolbarFields}>
        <Sidebar isPanelRight>
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
              scrollableSelector="#idp-reference-page"
              expandable={{ default: "expandable", md: "nonExpandable" }}
              className="pf-v6-u-mt-md"
            >
              <JumpLinksItem key={0} href="#oauth-client-settings">
                OAuth 2.0 client details
              </JumpLinksItem>
              <JumpLinksItem key={1} href="#idp-details">
                Identity provider details
              </JumpLinksItem>
            </JumpLinks>
          </SidebarPanel>
          <SidebarContent className="pf-v6-u-mr-xl">
            <TitleLayout
              key={0}
              id="oauth-client-settings"
              text="OAuth 2.0 client details"
              headingLevel="h2"
              className="pf-v6-u-mt-lg pf-v6-u-mb-md"
            />
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup
                    label="Identity Provider reference name"
                    role="group"
                  >
                    <IpaTextContent
                      dataCy="idp-references-tab-settings-textbox-cn"
                      name={"cn"}
                      ariaLabel={"Identity Provider reference name"}
                      ipaObject={ipaObject}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Client identifier"
                    fieldId="ipaidpclientid"
                    isRequired
                  >
                    <IpaTextInput
                      dataCy="idp-references-tab-settings-textbox-ipaidpclientid"
                      name={"ipaidpclientid"}
                      ariaLabel={"Client identifier"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="Secret" fieldId="ipaidpclientsecret">
                    <IpaPasswordInput
                      dataCy="idp-references-tab-settings-textbox-ipaidpclientsecret"
                      name={"ipaidpclientsecret"}
                      ariaLabel={"Secret"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
            <TitleLayout
              key={1}
              headingLevel="h2"
              id="idp-details"
              text="Identity provider details"
              className="pf-v6-u-mt-lg pf-v6-u-mb-md"
            />
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup label="Scope" fieldId="ipaidpscope">
                    <IpaTextInput
                      dataCy="idp-references-tab-settings-textbox-ipaidpscope"
                      name={"ipaidpscope"}
                      ariaLabel={"Scope"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="External IdP user identifier attribute"
                    fieldId="ipaidpsub"
                  >
                    <IpaTextInput
                      dataCy="idp-references-tab-settings-textbox-ipaidpsub"
                      name={"ipaidpsub"}
                      ariaLabel={"External IdP user identifier attribute"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Authorization URI"
                    fieldId="ipaidpauthendpoint"
                  >
                    <IpaTextInput
                      dataCy="idp-references-tab-settings-textbox-ipaidpauthendpoint"
                      name={"ipaidpauthendpoint"}
                      ariaLabel={"Authorization URI"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Device authorization URI"
                    fieldId="ipaidpdevauthendpoint"
                  >
                    <IpaTextInput
                      dataCy="idp-references-tab-settings-textbox-ipaidpdevauthendpoint"
                      name={"ipaidpdevauthendpoint"}
                      ariaLabel={"Device authorization URI"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="Token URI" fieldId="ipaidptokenendpoint">
                    <IpaTextInput
                      dataCy="idp-references-tab-settings-textbox-ipaidptokenendpoint"
                      name={"ipaidptokenendpoint"}
                      ariaLabel={"Token URI"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="User info URI"
                    fieldId="ipaidpuserinfoendpoint"
                  >
                    <IpaTextInput
                      dataCy="idp-references-tab-settings-textbox-ipaidpuserinfoendpoint"
                      name={"ipaidpuserinfoendpoint"}
                      ariaLabel={"User info URI"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="JWKS URI" fieldId="ipaidpkeysendpoint">
                    <IpaTextInput
                      dataCy="idp-references-tab-settings-textbox-ipaidpkeysendpoint"
                      name={"ipaidpkeysendpoint"}
                      ariaLabel={"JWKS URI"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="OIDC URL" fieldId="ipaidpissuerurl">
                    <IpaTextInput
                      dataCy="idp-references-tab-settings-textbox-ipaidpissuerurl"
                      name={"ipaidpissuerurl"}
                      ariaLabel={"OIDC URL"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="idp"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
          </SidebarContent>
        </Sidebar>
        <ResetIdpPassword
          idpId={props.idpRef.cn as string}
          isOpen={isResetPasswordModalOpen}
          onClose={() => setIsResetPasswordModalOpen(false)}
          onIdpRefChange={props.onIdpRefChange}
          onRefresh={props.onRefresh}
        />
      </TabLayout>
    </>
  );
};

export default IdpRefSettings;
