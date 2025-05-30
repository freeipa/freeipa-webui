import React from "react";
// PatternFly
import {
  DropdownItem,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Data types
import {
  CertificateMapping,
  Metadata,
} from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useAlerts from "src/hooks/useAlerts";
// Utils
import { certMapRuleAsRecord } from "src/utils/certMappingUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import {
  CertModPayload,
  useCertMapRuleModMutation,
} from "src/services/rpcCertMapping";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import KebabLayout from "src/components/layouts/KebabLayout";
import IpaTextArea from "src/components/Form/IpaTextArea";
import PopoverWithIconLayout from "src/components/layouts/PopoverWithIconLayout";
import IpaTextboxList from "src/components/Form/IpaTextboxList";
import IpaNumberInput from "src/components/Form/IpaNumberInput";
import EnableDisableRuleModal from "src/components/modals/CertificateMapping/EnableDisableRuleModal";
import DeleteRuleModal from "src/components/modals/CertificateMapping/DeleteRuleModal";

interface CertificateMappingSettingsProps {
  certMapping: Partial<CertificateMapping>;
  originalCertMapping: Partial<CertificateMapping>;
  metadata: Metadata;
  onCertMappingChange: (idpRef: Partial<CertificateMapping>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<CertificateMapping>;
  onResetValues: () => void;
  pathname: string;
}

const CertificateMappingSettings = (props: CertificateMappingSettingsProps) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [isRuleEnabled, setIsRuleEnabled] = React.useState(true);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = certMapRuleAsRecord(
    props.certMapping,
    props.onCertMappingChange
  );

  // Determine the rule status
  React.useEffect(() => {
    if (props.certMapping) {
      setIsRuleEnabled(
        props.certMapping.ipaenabledflag?.toString() === "true" ? true : false
      );
    }
  }, [props.certMapping]);

  // API calls
  const [saveCertMapping] = useCertMapRuleModMutation();

  // 'Revert' handler method
  const onRevert = () => {
    props.onCertMappingChange(props.originalCertMapping);
    props.onRefresh();
    alerts.addAlert(
      "revert-success",
      "Certificate mapping rule data reverted",
      "success"
    );
  };

  // Helper method to build the payload based on values
  const buildPayload = (
    modifiedValues: Partial<CertificateMapping>,
    keyArray: string[]
  ): CertModPayload => {
    const payload: CertModPayload = {
      ruleId: props.certMapping.cn?.toString() as string,
    };

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

  // on Save handler method
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();

    // Generate payload
    const payload = buildPayload(modifiedValues, [
      "description",
      "ipacertmapmaprule",
      "ipacertmapmatchrule",
      "associateddomain",
      "ipacertmappriority",
    ]);

    saveCertMapping(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          alerts.addAlert("error", (data.error as Error).message, "danger");
        }
        if (data?.result) {
          props.onCertMappingChange(data.result.result);
          alerts.addAlert("success", response.data.result.summary, "success");
          // Disable 'revert' and 'save' buttons
          props.onRefresh();
        }
      }
      setIsDataLoading(false);
    });
  };

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = React.useState(false);

  const kebabItems = [
    <DropdownItem
      key="enable"
      isDisabled={isRuleEnabled}
      onClick={() => setIsEnableDisableOpen(true)}
    >
      Enable
    </DropdownItem>,
    <DropdownItem
      key="disable"
      isDisabled={!isRuleEnabled}
      onClick={() => setIsEnableDisableOpen(true)}
    >
      Disable
    </DropdownItem>,
    <DropdownItem key="delete" onClick={() => setIsDeleteOpen(true)}>
      Delete
    </DropdownItem>,
  ];

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton onClickHandler={props.onRefresh}>
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
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
          direction={"up"}
          onDropdownSelect={() => setIsKebabOpen(!isKebabOpen)}
          onKebabToggle={() => setIsKebabOpen(!isKebabOpen)}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          dropdownItems={kebabItems}
        />
      ),
    },
  ];

  // Tooltip messages
  const mappingRuleMessage =
    "Rule used to map the certificate with a user entry";

  const matchingRuleMessage =
    "Rule used to check if a certificate can be used for authentication";

  const domainNameMessage = "Domain where the user entry will be searched";

  const priorityMessage =
    "Priority of the rule (higher number means lower priority)";

  // Modals
  const [isEnableDisableOpen, setIsEnableDisableOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  // Render component
  return (
    <>
      <TabLayout id="settings-page" toolbarItems={toolbarFields}>
        <alerts.ManagedAlerts />
        <Sidebar isPanelRight>
          <SidebarPanel variant="sticky">
            <HelpTextWithIconLayout
              textContent="Help"
              icon={
                <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
              }
            />
          </SidebarPanel>
          <SidebarContent className="pf-v5-u-mr-xl">
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v5-u-mb-lg">
                  <FormGroup label="Rule name" role="group">
                    <IpaTextInput
                      name={"cn"}
                      ariaLabel={"Rule name"}
                      ipaObject={ipaObject}
                      objectName="certmaprule"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="Description" fieldId="description">
                    <IpaTextArea
                      name={"description"}
                      ariaLabel={"Description"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="certmaprule"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Mapping rule"
                    fieldId="ipacertmapmaprule"
                    labelIcon={
                      <PopoverWithIconLayout message={mappingRuleMessage} />
                    }
                  >
                    <IpaTextInput
                      name={"ipacertmapmaprule"}
                      ariaLabel={"Mapping rule"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="certmaprule"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Matching rule"
                    fieldId="ipacertmapmatchrule"
                    labelIcon={
                      <PopoverWithIconLayout message={matchingRuleMessage} />
                    }
                  >
                    <IpaTextInput
                      name={"ipacertmapmatchrule"}
                      ariaLabel={"Matching rule"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="certmaprule"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Domain name"
                    fieldId="associateddomain"
                    labelIcon={
                      <PopoverWithIconLayout message={domainNameMessage} />
                    }
                  >
                    <IpaTextboxList
                      ipaObject={ipaObject}
                      setIpaObject={recordOnChange}
                      name={"associateddomain"}
                      ariaLabel={"Domain name list"}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Priority"
                    fieldId="ipacertmappriority"
                    labelIcon={
                      <PopoverWithIconLayout message={priorityMessage} />
                    }
                  >
                    <IpaNumberInput
                      id={"ipacertmappriority"}
                      name={"ipacertmappriority"}
                      aria-label={"Priority number"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="certmaprule"
                      metadata={props.metadata}
                      numCharsShown={6}
                      minValue={0}
                      maxValue={2147483647}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
          </SidebarContent>
        </Sidebar>
      </TabLayout>
      <EnableDisableRuleModal
        isOpen={isEnableDisableOpen}
        onClose={() => setIsEnableDisableOpen(false)}
        ruleId={props.certMapping.cn?.toString() as string}
        operation={isRuleEnabled ? "disable" : "enable"}
        setIsLoading={setIsDataLoading}
        onRefresh={props.onRefresh}
      />
      <DeleteRuleModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        ruleId={props.certMapping.cn?.toString() as string}
        setIsLoading={setIsDataLoading}
        onRefresh={props.onRefresh}
        pathToMainPage={props.pathname}
      />
    </>
  );
};

export default CertificateMappingSettings;
