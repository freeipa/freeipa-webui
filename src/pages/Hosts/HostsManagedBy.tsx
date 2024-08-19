import React, { useState } from "react";
// PatternFly
import {
  Badge,
  Page,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
// Data type
import { Host } from "src/utils/datatypes/globalDataTypes";
// Components
import ManagedByHosts from "src/components/ManagedBy/ManagedByHosts";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetHostByIdQuery } from "src/services/rpcHosts";
// Navigation
import { useNavigate } from "react-router-dom";

interface PropsToHostsManagedBy {
  host: Host;
}

const HostsManagedBy = (props: PropsToHostsManagedBy) => {
  const navigate = useNavigate();

  // Host's full data
  const hostQuery = useGetHostByIdQuery(props.host.fqdn);
  const hostData = hostQuery.data || {};

  // Current Host's full data
  const [host, setHost] = useState<Partial<Host>>({});

  React.useEffect(() => {
    if (!hostQuery.isFetching && hostData) {
      setHost({ ...hostData });
    }
  }, [hostData, hostQuery.isFetching]);

  const onRefreshHostData = () => {
    hostQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "hosts" });

  // Render component
  return (
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg"
      >
        <Tabs
          activeKey={"managedby_host"}
          isBox={false}
          mountOnEnter
          unmountOnExit
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onSelect={(_event) => {
            navigate("/hosts/" + props.host.fqdn + "/managedby_host");
          }}
        >
          <Tab
            eventKey={"managedby_host"}
            name="managedby_host"
            title={
              <TabTitleText>
                Hosts{" "}
                <Badge key={0} isRead>
                  {host && host.managedby_host ? host.managedby_host.length : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <ManagedByHosts
              entity={host}
              id={host.fqdn as string}
              from="host"
              isDataLoading={hostQuery.isFetching}
              onRefreshData={onRefreshHostData}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default HostsManagedBy;
