import React from "react";
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
import { Service } from "src/utils/datatypes/globalDataTypes";
// Components
import ManagedByHosts from "src/components/ManagedBy/ManagedByHosts";
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
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg"
      >
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
          <Tab
            eventKey={0}
            name="managedby_host"
            title={
              <TabTitleText>
                Hosts{" "}
                <Badge key={0} isRead>
                  {service && service.managedby_host
                    ? service.managedby_host.length
                    : 0}
                </Badge>
              </TabTitleText>
            }
          >
            <ManagedByHosts
              entity={service}
              id={service.krbcanonicalname as string}
              from="service"
              isDataLoading={serviceQuery.isFetching}
              onRefreshData={onRefreshServiceData}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default ServicesManagedBy;
