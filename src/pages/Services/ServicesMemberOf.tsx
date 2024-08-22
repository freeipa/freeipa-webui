import React from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Components
import { BreadCrumbItem } from "src/components/layouts/BreadCrumb";
import MemberOfRoles from "src/components/MemberOf/MemberOfRoles";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";
// Data types
import { Service } from "src/utils/datatypes/globalDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
// React Router DOM
import { useNavigate } from "react-router-dom";
// RPC
import { useGetServiceByIdQuery } from "src/services/rpcServices";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";

interface PropsToServicesMemberOf {
  service: Service;
  tabSection: string;
}

const ServicesMemberOf = (props: PropsToServicesMemberOf) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Update breadcrumb route
  React.useEffect(() => {
    if (!props.service.krbcanonicalname) {
      // Redirect to the main page
      navigate("/services");
    } else {
      const currentPath: BreadCrumbItem[] = [
        {
          name: "Services",
          url: "../../services",
        },
        {
          name: props.service.krbcanonicalname,
          url: "../../services/" + props.service.krbcanonicalname,
          isActive: true,
        },
      ];
      dispatch(updateBreadCrumbPath(currentPath));
    }
  }, [props.service.krbcanonicalname]);

  // User's full data
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

  // Render component
  return (
    <TabLayout id="memberof">
      <Tabs activeKey={0} isBox={false} mountOnEnter unmountOnExit>
        <Tab
          eventKey={0}
          name="memberof_role"
          title={
            <TabTitleText>
              Roles{" "}
              <Badge key={0} isRead>
                {service && service.memberof_role
                  ? service.memberof_role.length
                  : 0}
              </Badge>
            </TabTitleText>
          }
        >
          <MemberOfRoles
            entity={service}
            id={service.krbcanonicalname as string}
            from={"services"}
            isDataLoading={serviceQuery.isFetching}
            onRefreshData={onRefreshServiceData}
            memberof_role={service.memberof_role as string[]}
            membershipDisabled={true}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setDirection={() => {}}
            direction={"direct" as MembershipDirection}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default ServicesMemberOf;
