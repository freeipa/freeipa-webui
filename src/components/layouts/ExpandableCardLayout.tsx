import React from "react";
// PatternFly
import {
	Card,
	CardHeader,
	CardExpandableContent
} from '@patternfly/react-core';
import {
	Dropdown,
	KebabToggle
} from '@patternfly/react-core/deprecated';

interface PropsToCardLayout {
  className?: string;
  id: string;
  isCompact?: boolean;
  dropdownItems?: React.ReactNode[];
  headerToggleButtonProps?: Record<string, unknown>;
  cardActions?: React.ReactNode;
  cardTitle?: React.ReactNode;
  cardBody: React.ReactNode;
}

const ExpandableCardLayout = (props: PropsToCardLayout) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onExpand = (_event: React.MouseEvent) => {
    setIsExpanded(!isExpanded);
  };

  // KEBAB MENU
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const onSelect = () => {
    setIsOpen(!isOpen);
  };

  const getDropdownItems = () => {
    if (props.dropdownItems !== undefined && props.dropdownItems.length > 0) {
      return (
        <Dropdown
          onSelect={onSelect}
          toggle={<KebabToggle onToggle={(_event, val) => setIsOpen(val)} />}
          isOpen={isOpen}
          isPlain
          dropdownItems={props.dropdownItems}
          position={"right"}
          className="pf-u-ml-auto"
        />
      );
    }
  };

  return (
    <Card
      className={"pf-u-mb-sm " + props.className}
      isCompact={props.isCompact}
      isExpanded={isExpanded}
    >
      <CardHeader
        onExpand={onExpand}
        toggleButtonProps={props.headerToggleButtonProps}
      >
        {props.cardActions !== undefined && <>{props.cardActions}</>}
        {props.cardTitle !== undefined && <>{props.cardTitle}</>}
        {props.dropdownItems !== undefined && getDropdownItems()}
      </CardHeader>
      <CardExpandableContent>{props.cardBody}</CardExpandableContent>
    </Card>
  );
};

export default ExpandableCardLayout;
