import { useState } from "react";
// Components
import type { ContextualHelpPanelProps } from "src/components/ContextualHelpPanel/ContextualHelpPanel";

interface UseContextualHelpPanelOptions {
  defaultPage?: string;
}

type HookPanelProps = Omit<ContextualHelpPanelProps, "children"> & {
  fromPage: string;
};

interface UseContextualHelpPanelReturn {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
  fromPage: string;
  setFromPage: (page: string) => void;
  panelProps: HookPanelProps;
}

export function useContextualHelpPanel(
  options: UseContextualHelpPanelOptions = {}
): UseContextualHelpPanelReturn {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fromPage, setFromPage] = useState(options.defaultPage ?? "");

  const toggle = () => setIsExpanded((prev) => !prev);

  const panelProps: HookPanelProps = {
    fromPage,
    isExpanded,
    onClose: () => setIsExpanded(false),
  };

  return {
    isExpanded,
    setIsExpanded,
    toggle,
    fromPage,
    setFromPage,
    panelProps,
  };
}
