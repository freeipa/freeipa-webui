import React from "react";
// PatternFly
import {
  Card,
  CardHeader,
  CardExpandableContent,
  Dropdown,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
// Icons
import { EllipsisVIcon } from "@patternfly/react-icons";

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

  // Toggle
  const KebabToggleWithRef = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      id={props.id}
      aria-label="kebab dropdown toggle"
      variant="plain"
      isExpanded={isOpen}
      onClick={onSelect}
    >
      <EllipsisVIcon />
    </MenuToggle>
  );

  const getDropdownItems = () => {
    if (props.dropdownItems !== undefined && props.dropdownItems.length > 0) {
      return (
        <Dropdown toggle={KebabToggleWithRef} isOpen={isOpen}>
          <DropdownList>{props.dropdownItems}</DropdownList>
        </Dropdown>
      );
    }
  };

  return (
    <Card
      className={"pf-v5-u-mb-sm " + props.className}
      isCompact={props.isCompact}
      isExpanded={isExpanded}
    >
      <CardHeader
        onExpand={onExpand}
        toggleButtonProps={props.headerToggleButtonProps}
      >
        <Flex>
          <FlexItem>
            {props.cardActions !== undefined && <>{props.cardActions}</>}
          </FlexItem>
          <FlexItem>
            {props.cardTitle !== undefined && <>{props.cardTitle}</>}
          </FlexItem>
          <FlexItem align={{ default: "alignRight" }}>
            {props.dropdownItems !== undefined && getDropdownItems()}
          </FlexItem>
        </Flex>
      </CardHeader>
      <CardExpandableContent>{props.cardBody}</CardExpandableContent>
    </Card>
  );
};

export default ExpandableCardLayout;
