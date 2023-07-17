import React, { useEffect, useState } from "react";
// PatternFly
import {
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
import { useLocation } from "react-router-dom";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Other
import UserSettings from "../../components/UserSettings";
import UserMemberOf from "./UserMemberOf";
// Layouts
import BreadcrumbLayout from "src/components/layouts/BreadcrumbLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
// Hooks
import useUserSettingsData from "src/hooks/useUserSettingsData";
// RPC
import {
  BatchResult,
  Command,
  FindRPCResponse,
  useRefreshUsersMutation,
  useSaveUserDataMutation,
} from "src/services/rpc";

const ActiveUsersTabs = () => {
  // Get location (React Router DOM) and get state data
  const location = useLocation();
  const userData: User = location.state as User;

  const [user, setUser] = useState<User>(userData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pwPolicyData, setPwPolicyData] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [krbPolicyData, setKrbPolicyData] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [certData, setCertData] = useState<any>();

  // Loading data
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Make API calls needed for user Settings' data
  const { metadata, metadataLoading, batchResponse, isBatchLoading } =
    useUserSettingsData(userData.uid);

  // Define function to execute 'useRefreshUsersMutation' hook (via Mutation)
  const [retrieveUserData] = useRefreshUsersMutation();

  // Define function to execute 'useSaveUserDataMutation' hook (via mutation)
  const [saveData] = useSaveUserDataMutation();

  // Update states on receiving 'batchResponse' from 'useUserSettingsData'
  useEffect(() => {
    if (Object.keys(batchResponse).length > 0) {
      setUser(batchResponse[0].result);
      setPwPolicyData(batchResponse[1].result);
      setKrbPolicyData(batchResponse[2].result);
      setCertData(batchResponse[3].result);
      // TODO: Add the rest of the API calls
    }
  }, [batchResponse]);

  // Refresh data
  const refreshUserData = () => {
    // Payload
    const userShowCommand: Command = {
      method: "user_show",
      params: [userData.uid, { all: true, rights: true }],
    };
    const pwpolicyShowCommand: Command = {
      method: "pwpolicy_show",
      params: [[], { user: userData.uid[0], all: true, rights: true }],
    };
    const krbtpolicyShowCommand: Command = {
      method: "krbtpolicy_show",
      params: [userData.uid, { all: true, rights: true }],
    };
    const certFindCommand: Command = {
      method: "cert_find",
      params: [[], { user: userData.uid[0], sizelimit: 0, all: true }],
    };
    const batchPayload: Command[] = [
      userShowCommand,
      pwpolicyShowCommand,
      krbtpolicyShowCommand,
      certFindCommand,
    ];
    // TODO: Add the rest of the API calls

    // Set data loading flag
    setIsDataLoading(true);

    // Make API call
    retrieveUserData(batchPayload).then((batchResponse) => {
      if ("data" in batchResponse) {
        const responseData = batchResponse.data as BatchResult[];
        if (responseData !== undefined) {
          const newUserData = responseData[0].result;
          const newPwPolicyData = responseData[1].result;
          const newKrbPolicyData = responseData[2].result;
          const newCertData = responseData[3].result;
          setUser(newUserData as unknown as User);
          setPwPolicyData(newPwPolicyData);
          setKrbPolicyData(newKrbPolicyData);
          setCertData(newCertData);
          // TODO: Add the rest of the API calls
        }
      }
      // This batch will finish later than the other calls.
      //   So remove spinner and show data when finished.
      setIsDataLoading(false);
    });
  };

  // Revert button
  const revertUserData = () => {
    // Updates fields with the already retrieved data
    if (Object.keys(batchResponse).length > 0) {
      setUser(batchResponse[0].result);
      setPwPolicyData(batchResponse[1].result);
      setKrbPolicyData(batchResponse[2].result);
      setCertData(batchResponse[3].result);
    }
    // TODO: Set the rest of the values
  };

  // Save button
  const saveUserData = () => {
    // Prepare payload
    // - TODO: Take the new updated data from fields
    // - TEST
    const payload = { uid: "alee", params: { title: "Senior", sn: "Lee" } };

    // Make API call
    saveData(payload).then((response) => {
      if ("data" in response) {
        console.log(response.data as FindRPCResponse);
      }
    });
  };

  // Tab
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  // 'pagesVisited' array will contain the visited pages.
  // - Those will be passed to the BreadcrumbLayout component.
  const pagesVisited = [
    {
      name: "Active users",
      url: URL_PREFIX + "/active-users",
    },
  ];

  if (metadataLoading || isBatchLoading) {
    return <DataSpinner />;
  }

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light} className="pf-u-pr-0">
        <BreadcrumbLayout
          className="pf-u-mb-md"
          userId={userData.uid}
          pagesVisited={pagesVisited}
        />
        <TextContent>
          <Title headingLevel="h1">
            <Text>{userData.uid}</Text>
          </Title>
        </TextContent>
      </PageSection>
      <PageSection type="tabs" variant={PageSectionVariants.light} isFilled>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          variant="light300"
          isBox
          className="pf-u-ml-lg"
        >
          <Tab
            eventKey={0}
            name="details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <PageSection className="pf-u-pb-0"></PageSection>
            <UserSettings
              user={user}
              metadata={metadata}
              userData={user}
              pwPolicyData={pwPolicyData}
              krbPolicyData={krbPolicyData}
              certData={certData}
              onUserChange={setUser}
              onRefresh={refreshUserData}
              onRevert={revertUserData}
              onSave={saveUserData}
              isDataLoading={isDataLoading}
              from="active-users"
            />
          </Tab>
          <Tab
            eventKey={1}
            name="memberof-details"
            title={<TabTitleText>Is a member of</TabTitleText>}
          >
            <UserMemberOf user={userData} />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default ActiveUsersTabs;
