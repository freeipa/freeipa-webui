import React from "react";
// PatternFly
import {
  Icon,
  Title,
  Page,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
// Components
import UserSettings from "../../components/UserSettings";
import UserMemberOf from "./UserMemberOf";
import BreadCrumb, { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
// Layouts
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import { useUserSettings } from "src/hooks/useUserSettingsData";
// Icons
import LockIcon from "@patternfly/react-icons/dist/esm/icons/lock-icon";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
// Utils
import { partialUserToUser } from "src/utils/userUtils";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";

// eslint-disable-next-line react/prop-types
const ActiveUsersTabs = ({ memberof }) => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  React.useEffect(() => {
    if (!uid) {
      // Redirect to the active users page
      navigate("/active-users");
    } else {
      // Update breadcrumb route
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Active users",
          url: URL_PREFIX + "/active-users",
        },
        {
          name: uid,
          url: URL_PREFIX + "/active-users/" + uid,
          isActive: true,
        },
      ];
      setBreadcrumbItems(currentPath);
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [uid]);

  React.useEffect(() => {
    if (!memberof) {
      navigate("/active-users/" + uid);
    }
  }, [memberof]);

  // Data loaded from DB
  const userSettingsData = useUserSettings(uid as string);

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
  const titleText = (
    <div className="pf-v5-u-display-flex">
      <div className="pf-v5-u-color-400">User:</div>
      <div className="pf-v5-u-ml-sm">{uid}</div>
    </div>
  );

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-v5-u-pr-0">
        <BreadCrumb
          className="pf-v5-u-mb-md"
          breadcrumbItems={breadcrumbItems}
        />
        <TextContent>
          <Title headingLevel="h1">
            <Text
              className="pf-v5-u-display-flex"
              title={disabled ? "User is disabled" : ""}
            >
              {titleText}
              {disabled ? (
                <Icon
                  className="pf-v5-u-ml-sm pf-v5-u-mt-sm"
                  status="info"
                  size="md"
                >
                  <LockIcon />
                </Icon>
              ) : (
                ""
              )}
            </Text>
          </Title>
        </TextContent>
      </PageSection>
      <PageSection type="tabs" variant={PageSectionVariants.light} isFilled>
        <Tabs
          activeKey={activeTab}
          onSelect={(_event, tabIndex) => {
            if (tabIndex === "settings") {
              navigate("/active-users/" + uid);
            } else if (tabIndex === "memberof") {
              navigate("memberof_group");
            }
          }}
          variant="light300"
          isBox
          className="pf-v5-u-ml-lg"
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"settings"}
            name="details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <PageSection className="pf-v5-u-pb-0"></PageSection>
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
            />
          </Tab>
          <Tab
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
    </Page>
  );
};

export default ActiveUsersTabs;
