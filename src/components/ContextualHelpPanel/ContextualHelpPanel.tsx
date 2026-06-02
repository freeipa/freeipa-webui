import React from "react";
// PatternFly
import {
  Content,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  List,
  ListItem,
} from "@patternfly/react-core";
// JSON
import DocumentationLinks from "src/assets/documentation/documentation-links.json";
// Icons
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

interface DocLink {
  name: string;
  url: string;
}

export interface ContextualHelpPanelProps {
  fromPage?: string;
  isExpanded: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ContextualHelpPanel = (props: ContextualHelpPanelProps) => {
  const urlList = React.useMemo<DocLink[]>(() => {
    if (!props.fromPage) {
      return [];
    }

    const links = DocumentationLinks[props.fromPage];
    if (!links || links.length === 0) {
      return [];
    }

    return links.map((entry) => ({
      name: entry.name,
      url: entry.url,
    }));
  }, [props.fromPage]);

  const drawerRef = React.useRef<HTMLDivElement>(null);

  const onExpand = () => {
    if (drawerRef.current) {
      drawerRef.current.focus();
    }
  };

  const listOfDocLinks = urlList.map((linkEntry, idx) => {
    return (
      <ListItem key={"link-" + idx} icon={<ExternalLinkAltIcon />}>
        <a href={linkEntry.url} target="_blank" rel="noreferrer">
          {linkEntry.name}
        </a>
      </ListItem>
    );
  });

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead id="contextual-help-panel-header">
        <span tabIndex={props.isExpanded ? 0 : -1} ref={drawerRef}>
          <Content component="h2">Links</Content>
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={props.onClose} />
        </DrawerActions>
        <DrawerPanelBody id="contextual-help-panel-body">
          {urlList.length > 0 ? (
            <List isPlain>{listOfDocLinks}</List>
          ) : (
            <Content component="p" className="pf-v6-u-color-200">
              No documentation links available for this page.
            </Content>
          )}
        </DrawerPanelBody>
      </DrawerHead>
    </DrawerPanelContent>
  );

  return (
    <Drawer
      isExpanded={props.isExpanded}
      onExpand={onExpand}
      id="contextual-help-panel"
    >
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>{props.children}</DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ContextualHelpPanel;
