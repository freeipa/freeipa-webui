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
  TextInput,
} from "@patternfly/react-core";
// Data types
import { IdRange, Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// Components
import TabLayout from "src/components/layouts/TabLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";

interface IdRangesSettingsProps {
  idRange: Partial<IdRange>;
  metadata: Metadata;
  onIdRangeChange: (idRange: Partial<IdRange>) => void;
  onRefresh: () => void;
  isDataLoading: boolean;
  pathname: string;
}

const IdRangesSettings = (props: IdRangesSettingsProps) => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // Calculate effective range
  const effectiveRange =
    props.idRange.ipabaseid != null && props.idRange.ipaidrangesize != null
      ? `${props.idRange.ipabaseid} - ${
          Number(props.idRange.ipabaseid) +
          Number(props.idRange.ipaidrangesize) -
          1
        }`
      : "-";

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="id-ranges-tab-settings-button-refresh"
          onClick={props.onRefresh}
        >
          Refresh
        </Button>
      ),
    },
  ];

  return (
    <TabLayout
      id="settings-page"
      toolbarItems={toolbarFields}
      dataCy="id-ranges-settings"
    >
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            icon={
              <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
            }
          />
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Form className="pf-v6-u-mb-lg">
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <FormGroup label="ID range name" role="cn">
                  <TextInput
                    data-cy="id-ranges-tab-settings-textbox-cn"
                    name={"cn"}
                    aria-label={"ID range name text input"}
                    value={props.idRange.cn}
                    readOnlyVariant="plain"
                  />
                </FormGroup>
                <FormGroup label="Range type" role="iparangetype">
                  <TextInput
                    data-cy="id-ranges-tab-settings-textbox-iparangetype"
                    name={"iparangetype"}
                    aria-label={"Range type text input"}
                    value={props.idRange.iparangetype}
                    readOnlyVariant="plain"
                  />
                </FormGroup>
                <FormGroup label="Range type (raw)" role="iparangetyperaw">
                  <TextInput
                    data-cy="id-ranges-tab-settings-textbox-iparangetyperaw"
                    name={"iparangetyperaw"}
                    aria-label={"Range type (raw format) text input"}
                    value={props.idRange.iparangetyperaw}
                    readOnlyVariant="plain"
                  />
                </FormGroup>
                <FormGroup label="Base ID" role="ipabaseid">
                  <TextInput
                    data-cy="id-ranges-tab-settings-textbox-ipabaseid"
                    name={"ipabaseid"}
                    aria-label={"Base ID text input"}
                    value={props.idRange.ipabaseid}
                    readOnlyVariant="plain"
                    readOnly={true}
                  />
                </FormGroup>
                <FormGroup label="ID range size" role="ipaidrangesize">
                  <TextInput
                    data-cy="id-ranges-tab-settings-textbox-ipaidrangesize"
                    name={"ipaidrangesize"}
                    aria-label={"ID range size text input"}
                    value={props.idRange.ipaidrangesize}
                    readOnlyVariant="plain"
                    readOnly={true}
                  />
                </FormGroup>
              </FlexItem>
              <FlexItem flex={{ default: "flex_1" }}>
                <FormGroup
                  label="Effective range"
                  role="calculatedeffectiverange"
                >
                  <TextInput
                    data-cy="id-ranges-tab-settings-textbox-calculatedeffectiverange"
                    name={"calculatedeffectiverange"}
                    aria-label={"Effective range text input"}
                    value={effectiveRange}
                    readOnlyVariant="plain"
                  />
                </FormGroup>
                <FormGroup label="Base RID" role="ipabaserid">
                  <TextInput
                    data-cy="id-ranges-tab-settings-textbox-ipabaserid"
                    name={"ipabaserid"}
                    aria-label={"Base RID text input"}
                    value={props.idRange.ipabaserid}
                    readOnlyVariant="plain"
                    readOnly={true}
                  />
                </FormGroup>
                <FormGroup
                  label="Secondary Base RID"
                  role="ipasecondarybaserid"
                >
                  <TextInput
                    data-cy="id-ranges-tab-settings-textbox-ipasecondarybaserid"
                    name={"ipasecondarybaserid"}
                    aria-label={"Secondary Base RID text input"}
                    value={props.idRange.ipasecondarybaserid}
                    readOnlyVariant="plain"
                    readOnly={true}
                  />
                </FormGroup>
                <FormGroup
                  label="Auto private groups"
                  role="ipaautoprivategroups"
                >
                  <TextInput
                    data-cy="id-ranges-tab-settings-textbox-ipaautoprivategroups"
                    name={"ipaautoprivategroups"}
                    aria-label={"Auto private groups text input"}
                    value={props.idRange.ipaautoprivategroups}
                    readOnlyVariant="plain"
                    readOnly={true}
                  />
                </FormGroup>
              </FlexItem>
            </Flex>
          </Form>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default IdRangesSettings;
