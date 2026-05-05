import React from "react";
import { usePluginExtensions } from "./hooks";

// ---------------------------------------------------------------------------
// Error boundary that catches crashes in plugin components
// ---------------------------------------------------------------------------

interface ErrorBoundaryProps {
  pluginId: string;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class PluginErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error(
      `[ExtensionSlot] Plugin "${this.props.pluginId}" crashed:`,
      error,
      info.componentStack
    );
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: "8px 12px",
            margin: "4px 0",
            background: "#fef3f2",
            border: "1px solid #f04438",
            borderRadius: 4,
            fontSize: "0.85em",
            color: "#b42318",
          }}
        >
          Plugin &quot;{this.props.pluginId}&quot; encountered an error.
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// ExtensionSlot component
// ---------------------------------------------------------------------------

export interface ExtensionSlotProps {
  extensionPointId: string;
  /** Arbitrary context passed as props to every plugin component. */
  context?: Record<string, unknown>;
}

export const ExtensionSlot: React.FC<ExtensionSlotProps> = ({
  extensionPointId,
  context = {},
}) => {
  const extensions = usePluginExtensions(extensionPointId);

  if (extensions.length === 0) {
    return null;
  }

  return (
    <>
      {extensions.map((ext, idx) => {
        const Component = ext.component;
        return (
          <PluginErrorBoundary
            key={`${ext.pluginId}-${idx}`}
            pluginId={ext.pluginId}
          >
            <Component {...context} />
          </PluginErrorBoundary>
        );
      })}
    </>
  );
};
