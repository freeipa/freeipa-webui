import React from "react";
// PatternFly
import {
  Button,
  Form,
  FormGroup,
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Data types
import { Metadata, TopologySuffix } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TitleLayout from "src/components/layouts/TitleLayout";

interface TopologySuffixesSettingsProps {
  topologySuffix: Partial<TopologySuffix>;
  metadata: Metadata;
  onRefresh: () => void;
  pathname: string;
}

const TopologySuffixesSettings = (props: TopologySuffixesSettingsProps) => {
  const dispatch = useAppDispatch();
  useContextualHelpTopic("topology-suffixes-settings");

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: props.pathname });

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="topology-suffixes-tab-settings-button-refresh"
          onClick={props.onRefresh}
        >
          Refresh
        </Button>
      ),
    },
  ];

  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            onClick={() => dispatch(toggleHelpPanel())}
          />
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#settings-page"
            expandable={{ default: "expandable", md: "nonExpandable" }}
            className="pf-v6-u-mt-md"
          >
            <JumpLinksItem key={0} href="#settings">
              Settings
            </JumpLinksItem>
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <TitleLayout
            key={0}
            id="settings"
            text="Settings"
            headingLevel="h2"
            className="pf-v6-u-mt-lg pf-v6-u-mb-md"
          />
          <Form className="pf-v6-u-mb-lg" isHorizontal>
            <FormGroup label="Suffix name" fieldId="cn">
              <IpaTextInput
                dataCy="topology-suffixes-tab-settings-textbox-cn"
                name="cn"
                ariaLabel="Suffix name"
                ipaObject={props.topologySuffix as Record<string, unknown>}
                objectName="topologysuffix"
                metadata={props.metadata}
                readOnly
              />
            </FormGroup>
            <FormGroup
              label="Managed LDAP suffix DN"
              fieldId="iparepltopoconfroot"
            >
              <IpaTextInput
                dataCy="topology-suffixes-tab-settings-textbox-iparepltopoconfroot"
                name="iparepltopoconfroot"
                ariaLabel="Managed LDAP suffix DN"
                ipaObject={props.topologySuffix as Record<string, unknown>}
                objectName="topologysuffix"
                metadata={props.metadata}
                readOnly
              />
            </FormGroup>
          </Form>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default TopologySuffixesSettings;
