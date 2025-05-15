import React from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { IDView } from "src/utils/datatypes/globalDataTypes";
// Navigation
import { useNavigate } from "react-router-dom";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
import IDViewsOverrideUsers from "./IDViewsOverrideUsers";
import IDViewsOverrideGroups from "./IDViewsOverrideGroups";

interface PropsToOverrides {
  idView: IDView;
  onRefresh: () => void;
  tabSection: string;
}

const IDViewsOverrides = (props: PropsToOverrides) => {
  const navigate = useNavigate();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "id-views", noBreadcrumb: true });

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/id-views/" + props.idView.cn + "/" + tabIndex);
  };

  // Render component
  return (
    <TabLayout id="override sections">
      <Tabs
        activeKey={props.tabSection}
        onSelect={handleTabClick}
        isBox={false}
        mountOnEnter
        unmountOnExit
      >
        <Tab
          eventKey={"override-users"}
          name="users"
          title={
            <TabTitleText>
              Users{" "}
              <Badge key={0} id="user_count" isRead>
                {props.idView.useroverrides.length}
              </Badge>
            </TabTitleText>
          }
        >
          <IDViewsOverrideUsers
            idview={props.idView.cn}
            users={props.idView.useroverrides}
            onRefresh={props.onRefresh}
          />
        </Tab>
        <Tab
          eventKey={"override-groups"}
          name="groups"
          title={
            <TabTitleText>
              User groups{" "}
              <Badge key={1} id="group_count" isRead>
                {props.idView.groupoverrides.length}
              </Badge>
            </TabTitleText>
          }
        >
          <IDViewsOverrideGroups
            idview={props.idView.cn}
            groups={props.idView.groupoverrides}
            onRefresh={props.onRefresh}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default IDViewsOverrides;
