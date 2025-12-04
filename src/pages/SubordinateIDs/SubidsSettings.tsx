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
} from "@patternfly/react-core";
// Data types
import { SubId, Metadata } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { addAlert } from "src/store/Global/alerts-slice";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Utils
import { asRecord } from "src/utils/subIdUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// RPC
import { SubidModPayload, useSubidModMutation } from "src/services/rpcSubIds";
// Components
import IpaTextInput from "src/components/Form/IpaTextInput";
import TabLayout from "src/components/layouts/TabLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import IpaTextContent from "src/components/Form/IpaTextContent";

interface PropsToSubidSettings {
  subId: Partial<SubId>;
  originalSubId: Partial<SubId>;
  metadata: Metadata;
  onSubIdChange: (subid: Partial<SubId>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<SubId>;
  onResetValues: () => void;
}

const SubidSettings = (props: PropsToSubidSettings) => {
  const dispatch = useAppDispatch();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "subordinate-ids" });

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.subId,
    props.onSubIdChange
  );

  // API calls
  const [subidMod] = useSubidModMutation();

  // 'Revert' handler method
  const onRevert = () => {
    props.onSubIdChange(props.originalSubId);
    props.onRefresh();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Subordinate ID data reverted",
        variant: "success",
      })
    );
  };

  // on Save handler method
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = props.modifiedValues();

    const payload: SubidModPayload = {
      ipauniqueid: props.subId.ipauniqueid?.toString() as string,
      description: modifiedValues.description?.toString() as string,
    };

    subidMod(payload).then((response) => {
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
          props.onSubIdChange(data.result.result);
          dispatch(
            addAlert({
              name: "success",
              title: "Subordinate ID " + props.subId.ipauniqueid + " updated",
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

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          data-cy="subids-tab-settings-button-refresh"
          onClick={props.onRefresh}
          variant="secondary"
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 1,
      element: (
        <Button
          data-cy="subids-tab-settings-button-revert"
          isDisabled={!props.isModified || isDataLoading}
          onClick={onRevert}
          variant="secondary"
        >
          Revert
        </Button>
      ),
    },
    {
      key: 2,
      element: (
        <Button
          data-cy="subids-tab-settings-button-save"
          isDisabled={!props.isModified || isDataLoading}
          onClick={onSave}
          variant="secondary"
        >
          Save
        </Button>
      ),
    },
  ];

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
          </SidebarPanel>
          <SidebarContent className="pf-v6-u-mr-xl">
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <Form className="pf-v6-u-mb-lg">
                  <FormGroup label="Unique ID" fieldId="ipauniqueid">
                    <IpaTextInput
                      dataCy="subids-tab-settings-textbox-unique-id"
                      name={"ipauniqueid"}
                      ariaLabel={"Unique ID"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="subid"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="Description" fieldId="description">
                    <IpaTextInput
                      dataCy="subids-tab-settings-textbox-description"
                      name={"description"}
                      ariaLabel={"Description"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="subid"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="Owner" fieldId="ipaowner" role="group">
                    <IpaTextContent
                      dataCy="subids-tab-settings-textbox-owner"
                      name={"ipaowner"}
                      ariaLabel={"Owner"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="subid"
                      metadata={props.metadata}
                      linkTo={
                        "/active-users/" + props.subId.ipaowner?.toString()
                      }
                    />
                  </FormGroup>
                  <FormGroup
                    label="SubGID range start"
                    fieldId="ipasubgidnumber"
                  >
                    <IpaTextInput
                      dataCy="subids-tab-settings-textbox-subgid-range-start"
                      name={"ipasubgidnumber"}
                      ariaLabel={"SubGID range start"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="subid"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="SubGID range size" fieldId="ipasubgidcount">
                    <IpaTextInput
                      dataCy="subids-tab-settings-textbox-subgid-range-size"
                      name={"ipasubgidcount"}
                      ariaLabel={"SubGID range size"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="subid"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup
                    label="SubUID range start"
                    fieldId="ipasubuidnumber"
                  >
                    <IpaTextInput
                      dataCy="subids-tab-settings-textbox-subuid-range-start"
                      name={"ipasubuidnumber"}
                      ariaLabel={"SubUID range start"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="subid"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                  <FormGroup label="SubUID range size" fieldId="ipasubuidcount">
                    <IpaTextInput
                      dataCy="subids-tab-settings-textbox-subuid-range-size"
                      name={"ipasubuidcount"}
                      ariaLabel={"SubUID range size"}
                      ipaObject={ipaObject}
                      onChange={recordOnChange}
                      objectName="subid"
                      metadata={props.metadata}
                    />
                  </FormGroup>
                </Form>
              </FlexItem>
            </Flex>
          </SidebarContent>
        </Sidebar>
      </TabLayout>
    </>
  );
};

export default SubidSettings;
