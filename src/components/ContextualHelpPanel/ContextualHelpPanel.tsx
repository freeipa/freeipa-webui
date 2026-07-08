import React, { useCallback, useMemo } from "react";
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
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  closeHelpPanel,
  selectHelpPanelExpanded,
  selectHelpTopic,
} from "src/store/Global/contextual-help-slice";

interface DocLink {
  name: string;
  url: string;
}

interface ContextualHelpPanelProps {
  children: React.ReactNode;
}

/**
 * Contextual help panel drawer rendered once in AppLayout.
 * State is managed entirely via Redux (contextual-help-slice).
 */
const ContextualHelpPanel = (props: ContextualHelpPanelProps) => {
  const dispatch = useAppDispatch();

  const isExpanded = useAppSelector(selectHelpPanelExpanded);
  const fromPage = useAppSelector(selectHelpTopic);

  const handleClose = useCallback(() => {
    dispatch(closeHelpPanel());
  }, [dispatch]);

  const urlList = useMemo<DocLink[]>(() => {
    if (!fromPage) {
      return [];
    }

    const links = DocumentationLinks[fromPage];
    if (!links || links.length === 0) {
      return [];
    }

    return links.map((entry) => ({
      name: entry.name,
      url: entry.url,
    }));
  }, [fromPage]);

  const drawerRef = React.useRef<HTMLDivElement>(null);

  const onExpand = useCallback(() => {
    if (drawerRef.current) {
      drawerRef.current.focus();
    }
  }, []);

  const listOfDocLinks = useMemo(
    () =>
      urlList.map((linkEntry) => (
        <ListItem key={linkEntry.url} icon={<ExternalLinkAltIcon />}>
          <a href={linkEntry.url} target="_blank" rel="noreferrer">
            {linkEntry.name}
          </a>
        </ListItem>
      )),
    [urlList]
  );

  const panelContent = useMemo(
    () => (
      <DrawerPanelContent>
        <DrawerHead id="contextual-help-panel-header">
          <span tabIndex={isExpanded ? 0 : -1} ref={drawerRef}>
            <Content component="h2">Links</Content>
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={handleClose} />
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
    ),
    [isExpanded, handleClose, urlList, listOfDocLinks]
  );

  return (
    <Drawer
      isExpanded={isExpanded}
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
