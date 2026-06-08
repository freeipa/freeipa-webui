import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Label,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
// Components
import KeytabTableWithFilter, {
  TableEntry,
} from "src/components/tables/KeytabTableWithFilter";
import IpaToggleGroup from "src/components/Form/IpaToggleGroup";
import { DualListTarget } from "src/components/layouts/DualListLayout";
// Data types
import { Metadata } from "src/utils/datatypes/globalDataTypes";

/**
 * Configuration for a single tab in the CategoryToggleSection
 */
export interface CategoryTabConfig {
  key: number;
  name: string;
  label: string;
  entityType: DualListTarget;
  fieldName: string;
  columnNames: string[];
  entries: TableEntry[];
  externalOption?: boolean;
}

/**
 * Props for the CategoryToggleSection component
 */
interface CategoryToggleSectionProps {
  // Toggle configuration
  categoryFieldName: string;
  categoryLabel: string;
  categoryOptions: { label: string; value: string }[];
  categoryValue: string;
  // IPA form integration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipaObject: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordOnChange: (ipaObject: Record<string, any>) => void;
  metadata: Metadata;
  objectName: string;
  dataCy: string;
  // Tabs configuration
  tabs: CategoryTabConfig[];
  // Operations
  entityId: string;
  entityFrom: string;
  isSpinning: boolean;
  onAdd: (tabName: string, members: string[]) => void;
  onDelete: (tabName: string, members: string[]) => void;
  onRefresh: () => void;
  // Optional
  extraId?: string;
  title?: React.ReactNode;
  className?: string;
  tabsClassName?: string;
  startTabKey?: number;
}

/**
 * Generic component for category-based toggle sections with tabbed membership tables.
 * Combines a category toggle (e.g., "Anyone" vs "Specified") with tabs of KeytabTableWithFilter.
 */
const CategoryToggleSection = (props: CategoryToggleSectionProps) => {
  const startKey = props.startTabKey ?? props.tabs[0]?.key ?? 0;
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(
    startKey
  );

  const handleTabClick = (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const [optionSelected, setOptionSelected] = React.useState<string>(
    props.categoryValue === "all"
      ? props.categoryOptions[0].label
      : props.categoryOptions[1].label
  );

  const anyoneSelected = optionSelected === props.categoryOptions[0].label;

  const filter = (
    <Flex name={props.categoryFieldName} className={props.className}>
      <FlexItem>{props.categoryLabel} </FlexItem>
      <FlexItem>
        <IpaToggleGroup
          dataCy={props.dataCy}
          ipaObject={props.ipaObject}
          name={props.categoryFieldName}
          options={props.categoryOptions}
          optionSelected={optionSelected}
          setOptionSelected={setOptionSelected}
          onChange={props.recordOnChange}
          objectName={props.objectName}
          metadata={props.metadata}
          isCompact
        />
      </FlexItem>
    </Flex>
  );

  return (
    <>
      {filter}
      {props.title}
      <Tabs
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        aria-label={`Tabs for ${props.categoryFieldName}`}
        className={props.tabsClassName}
      >
        {props.tabs.map((tab) => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={
              <TabTitleText>
                {tab.label} <Label isCompact>{tab.entries.length}</Label>
              </TabTitleText>
            }
            aria-label={`${tab.label} in the ${props.entityFrom}`}
          >
            <KeytabTableWithFilter
              className="pf-v6-u-ml-md pf-v6-u-mt-sm"
              id={props.entityId}
              extraId={props.extraId}
              from={props.entityFrom}
              name={tab.fieldName}
              isSpinning={props.isSpinning}
              entityType={tab.entityType}
              operationTitle={`Add ${tab.label.toLowerCase()} into ${props.entityFrom} ${props.entityId}`}
              tableEntryList={tab.entries}
              columnNames={tab.columnNames}
              onRefresh={props.onRefresh}
              onAdd={(members) => props.onAdd(tab.name, members)}
              onDelete={(members) => props.onDelete(tab.name, members)}
              checkboxesDisabled={anyoneSelected}
              externalOption={tab.externalOption}
            />
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

export default CategoryToggleSection;
