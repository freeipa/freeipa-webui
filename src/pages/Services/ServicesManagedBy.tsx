import React from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data type
import { Service } from "src/utils/datatypes/globalDataTypes";
// Components
import ManagedByHosts from "src/components/ManagedBy/ManagedByHosts";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetServiceByIdQuery } from "src/services/rpcServices";
// Navigation
import { useNavigate } from "react-router-dom";

interface PropsToServicesManagedBy {
  service: Service;
}

const ServicesManagedBy = (props: PropsToServicesManagedBy) => {
  const navigate = useNavigate();

  // Service full data
  const serviceQuery = useGetServiceByIdQuery(props.service.krbcanonicalname);
  const serviceData = serviceQuery.data || {};

  const [service, setService] = React.useState<Partial<Service>>({});

  React.useEffect(() => {
    if (!serviceQuery.isFetching && serviceData) {
      setService({ ...serviceData });
    }
  }, [serviceData, serviceQuery.isFetching]);

  const onRefreshServiceData = () => {
    serviceQuery.refetch();
  };

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "services", noBreadcrumb: true });

  // Encoded data to pass to the URL
  const encodedServiceId = encodeURIComponent(props.service.krbcanonicalname);

  return (
    <TabLayout id="managedby">
      <Tabs
        activeKey={0}
        isBox={false}
        mountOnEnter
        unmountOnExit
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSelect={(_event) => {
          navigate("/services/" + encodedServiceId + "/managedby_host");
        }}
      >
        <Tabs activeKey={0} isBox={false}>
          <Tab
            eventKey={0}
            name="managedby_host"
            title={
              <TabTitleText>
                Hosts{" "}
                <Badge key={0} isRead>
                  {hostsList.length}
                </Badge>
              </TabTitleText>
            }
          >
            <ManagedByToolbar
              pageRepo={hostsList}
              shownItems={shownHostsList}
              updateShownElementsList={updateShownHostsList}
              pageData={toolbarPageData}
              buttonData={toolbarButtonData}
            />
            <ManagedByTable
              list={shownHostsList}
              tableName={"Hosts"}
              showTableRows={showTableRows}
              updateElementsSelected={updateHostsSelected}
              buttonData={tableButtonData}
            />
          </Tab>
        </Tabs>
        <Pagination
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          itemCount={hostsList.length}
          widgetId="pagination-options-menu-bottom"
          perPage={perPage}
          page={page}
          variant={PaginationVariant.bottom}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
        />
      </PageSection>
      <>
        {showAddModal && (
          <ManagedByAddModal
            modalData={addModalData}
            availableData={hostsFilteredData}
            groupRepository={hostsList}
            updateGroupRepository={updateGroupRepository}
            updateAvOptionsList={updateAvailableHostsList}
            tabData={tabData}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default ServicesManagedBy;
