import React, { useMemo, useState } from "react";
import {
  Button,
  Flex,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
import IpaCheckboxes from "src/components/Form/IpaCheckboxes";
import IpaCheckboxListWithFilter from "src/components/Form/IpaCheckboxListWithFilter";
import IpaSelect from "src/components/Form/IpaSelect";
import IpaTextInput from "src/components/Form/IpaTextInput";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import TabLayout from "src/components/layouts/TabLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import { ErrorResult } from "src/services/rpc";
import { useDelegationModMutation } from "src/services/rpcDelegations";
import { useFindGroupsQuery } from "src/services/rpcUserGroups";
import { addAlert } from "src/store/Global/alerts-slice";
import { useAppDispatch } from "src/store/hooks";
import {
  Delegation,
  Metadata,
  SELF_SERVICE_ATTRS,
} from "src/utils/datatypes/globalDataTypes";
import { asRecord } from "src/utils/delegationsUtils";
import HelperTextWithIcon from "src/components/layouts/HelperTextWithIcon";

interface GroupEntry {
  cn: string[];
}

interface PropsToSettings {
  delegation: Partial<Delegation>;
  originalDelegation: Partial<Delegation>;
  metadata: Metadata;
  onDelegationChange: (delegation: Partial<Delegation>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<Delegation>;
  onResetValues: () => void;
  onOpenContextualPanel?: () => void;
}

const PERMISSION_OPTIONS = [
  { value: "read", text: "read" },
  { value: "write", text: "write" },
];

const ATTRIBUTE_OPTIONS = SELF_SERVICE_ATTRS.map((attr) => ({
  value: attr,
  text: attr,
}));

const DelegationsSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();
  const [saveDelegation] = useDelegationModMutation();
  const groupsQuery = useFindGroupsQuery();

  useUpdateRoute({ pathname: "delegations", noBreadcrumb: true });

  const { ipaObject, recordOnChange } = asRecord(
    props.delegation,
    props.onDelegationChange
  );

  const [isSaving, setSaving] = useState(false);

  const isFormDataLoading =
    Boolean(props.isDataLoading) || groupsQuery.isFetching;

  const groupOptions = useMemo(() => {
    const results = (groupsQuery.data?.result.result || []) as GroupEntry[];
    return results
      .map((entry) => entry.cn[0])
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => a.localeCompare(b));
  }, [groupsQuery.data]);

  const hasRequiredValues =
    (props.delegation.permissions?.length || 0) > 0 &&
    (props.delegation.group?.trim().length || 0) > 0 &&
    (props.delegation.memberof?.trim().length || 0) > 0 &&
    (props.delegation.attrs?.length || 0) > 0;

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const modifiedValues = props.modifiedValues();
    modifiedValues.aciname =
      props.originalDelegation.aciname || props.delegation.aciname;
    setSaving(true);

    saveDelegation(modifiedValues)
      .then((response) => {
        if ("data" in response) {
          if (response.data?.result) {
            dispatch(
              addAlert({
                name: "save-success",
                title: "Delegation modified",
                variant: "success",
              })
            );
            props.onRefresh();
          } else if (response.data?.error) {
            const errorMessage = response.data.error as ErrorResult;
            dispatch(
              addAlert({
                name: "save-error",
                title: errorMessage.message,
                variant: "danger",
              })
            );
            props.onResetValues();
          }
        } else if ("error" in response) {
          dispatch(
            addAlert({
              name: "save-error",
              title: "Could not modify delegation",
              variant: "danger",
            })
          );
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const onRevert = () => {
    props.onDelegationChange(props.originalDelegation);
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Delegation data reverted",
        variant: "success",
      })
    );
  };

  const toolbarFields = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="delegations-tab-settings-button-refresh"
          onClick={props.onRefresh}
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 1,
      element: (
        <Button
          variant="secondary"
          data-cy="delegations-tab-settings-button-revert"
          isDisabled={!props.isModified || isSaving || isFormDataLoading}
          onClick={onRevert}
        >
          Revert
        </Button>
      ),
    },
    {
      key: 2,
      element: (
        <Button
          variant="primary"
          data-cy="delegations-tab-settings-button-save"
          isDisabled={
            !props.isModified ||
            !hasRequiredValues ||
            isSaving ||
            isFormDataLoading
          }
          type="submit"
          form="delegations-settings-form"
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
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
            onClick={props.onOpenContextualPanel}
          />
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
            <TitleLayout headingLevel="h2" id="general" text="General" />
            <Form
              className="pf-v6-u-mt-sm pf-v6-u-mb-lg pf-v6-u-mr-md"
              id="delegations-settings-form"
              isHorizontal
              onSubmit={onSave}
            >
              <FormGroup label="Delegation name" fieldId="aciname">
                <IpaTextInput
                  dataCy="delegations-tab-settings-textinput-aciname"
                  name="aciname"
                  ariaLabel="Delegation name"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="delegation"
                  metadata={props.metadata}
                />
              </FormGroup>
              <FormGroup label="Permissions" fieldId="permissions">
                <>
                  <IpaCheckboxes
                    dataCy="delegations-tab-settings-checkbox-permissions"
                    name="permissions"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="delegation"
                    metadata={props.metadata}
                    options={PERMISSION_OPTIONS}
                  />
                  <HelperTextWithIcon
                    message="If no permission is selected, it defaults to write."
                    type="info"
                  />
                </>
              </FormGroup>
              <FormGroup label="User group" fieldId="group">
                <IpaSelect
                  dataCy="delegations-tab-settings-select-group"
                  id="delegations-settings-group"
                  name="group"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="delegation"
                  metadata={props.metadata}
                  options={groupOptions}
                  readOnly={isFormDataLoading ? true : undefined}
                />
              </FormGroup>
              <FormGroup label="Member user group" fieldId="memberof">
                <IpaSelect
                  dataCy="delegations-tab-settings-select-memberof"
                  id="delegations-settings-memberof"
                  name="memberof"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="delegation"
                  metadata={props.metadata}
                  options={groupOptions}
                  readOnly={isFormDataLoading ? true : undefined}
                />
              </FormGroup>
              <FormGroup label="Attributes" fieldId="attrs">
                <IpaCheckboxListWithFilter
                  dataCy="delegations-tab-settings-checkboxlist-attrs"
                  name="attrs"
                  ipaObject={ipaObject}
                  onChange={recordOnChange}
                  objectName="delegation"
                  metadata={props.metadata}
                  options={ATTRIBUTE_OPTIONS}
                  maxHeight="260px"
                />
              </FormGroup>
            </Form>
          </Flex>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default DelegationsSettings;
