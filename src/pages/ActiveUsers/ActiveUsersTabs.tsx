import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Components
import UserSettings from "src/components/UsersSections/UserSettings";
import UserMemberOf from "./UserMemberOf";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import TitleLayout from "src/components/layouts/TitleLayout";
// Layouts
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useUserSettings } from "src/hooks/useUserSettingsData";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import {
  setHelpTopic,
  toggleHelpPanel,
} from "src/store/Global/contextual-help-slice";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
// Utils
import { partialUserToUser } from "src/utils/userUtils";
// Navigation
import { NotFound } from "src/components/errors/PageErrors";
import { UidParams, useSafeParams } from "src/utils/paramsUtils";

// eslint-disable-next-line react/prop-types
const ActiveUsersTabs = ({ memberof }) => {
  const { uid } = useSafeParams<UidParams>(["uid"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useContextualHelpTopic("active-users-settings");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  React.useEffect(() => {
    // Update breadcrumb route
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Active users",
        url: "/active-users",
      },
      {
        name: uid,
        url: "/active-users/" + uid,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    dispatch(updateBreadCrumbPath(currentPath));
  }, [uid]);

  React.useEffect(() => {
    if (!memberof) {
      navigate("/active-users/" + uid);
    }
  }, [memberof]);

  // Data loaded from DB
  const userSettingsData = useUserSettings(uid);

  // Tab
  const activeTab = memberof ? "memberof" : "settings";

  if (userSettingsData.isLoading || !userSettingsData.user) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the user is not found
  if (
    !userSettingsData.isLoading &&
    Object.keys(userSettingsData.user).length === 0
  ) {
    return <NotFound />;
  }

  const disabled = userSettingsData.user.nsaccountlock;
  const user = userSettingsData.user;

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={uid}
          preText="User:"
          text={uid}
          headingLevel="h1"
          statusText={disabled ? "Disabled" : undefined}
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs" isFilled>
        <Tabs
          activeKey={activeTab}
          onSelect={(_event, tabIndex) => {
            if (tabIndex === "settings") {
              navigate("/active-users/" + uid);
            } else if (tabIndex === "memberof") {
              navigate("memberof_group");
            }
          }}
          variant="secondary"
          isBox
          className="pf-v6-u-ml-lg"
          mountOnEnter
          unmountOnExit
        >
          <Tab
            data-cy="active-users-tab-settings"
            eventKey={"settings"}
            name="details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <UserSettings
              originalUser={userSettingsData.originalUser}
              user={userSettingsData.user}
              metadata={userSettingsData.metadata}
              pwPolicyData={userSettingsData.pwPolicyData}
              krbPolicyData={userSettingsData.krbtPolicyData}
              certData={userSettingsData.certData}
              onUserChange={userSettingsData.setUser}
              isDataLoading={userSettingsData.isFetching}
              onRefresh={userSettingsData.refetch}
              isModified={userSettingsData.modified}
              onResetValues={userSettingsData.resetValues}
              modifiedValues={userSettingsData.modifiedValues}
              radiusProxyData={userSettingsData.radiusServers}
              idpData={userSettingsData.idpServers}
              activeUsersList={userSettingsData.activeUsersList}
              from="active-users"
              changeFromPage={(page) => dispatch(setHelpTopic(page))}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
            />
          </Tab>
          <Tab
            data-cy="active-users-tab-memberof"
            eventKey={"memberof"}
            name="memberof-details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <UserMemberOf
              user={partialUserToUser(user)}
              tab={memberof || "group"}
              from="active-users"
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default ActiveUsersTabs;
