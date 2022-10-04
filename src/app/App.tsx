import React from "react";

import "@patternfly/react-core/dist/styles/base.css";
// Layouts
import { AppLayout } from "./AppLayout";
// Navigation
import { AppRoutes } from "./navigation/AppRoutes";

// Context
export const Context = React.createContext<{
  groupActive: string;
  setGroupActive: React.Dispatch<any>;
  browserTitle: string;
  setBrowserTitle: React.Dispatch<any>;
  superGroupActive: string;
  setSuperGroupActive: React.Dispatch<any>;
}>({
  groupActive: "active-users",
  setGroupActive: () => null,
  browserTitle: "Active users title",
  setBrowserTitle: () => null,
  superGroupActive: "users",
  setSuperGroupActive: () => null,
});

const App: React.FunctionComponent = () => {
  // - Initial active group
  const [groupActive, setGroupActive] = React.useState("active-users");
  // - Initial title
  const [browserTitle, setBrowserTitle] = React.useState("Active users title");
  // - Initial active super group
  const [superGroupActive, setSuperGroupActive] = React.useState("users");

  // Update the 'browserTitle' on document.title when this changes
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  return (
    <Context.Provider
      value={{
        groupActive,
        setGroupActive,
        browserTitle,
        setBrowserTitle,
        superGroupActive,
        setSuperGroupActive,
      }}
    >
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </Context.Provider>
  );
};

export default App;
