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
import { useAppSelector } from "src/store/hooks";
// Repositories
import { servicesRolesInitialData } from "src/utils/data/GroupRepositories";
// Modals
import MemberOfAddModal from "src/components/MemberOf/MemberOfAddModalOld";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModal";

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
    <Page>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg"
      >
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox={false}>
          <Tab
            eventKey={2}
            name="memberof_role"
            title={
              <TabTitleText>
                Roles{" "}
                <Badge key={2} isRead>
                  {rolesRepoLength}
                </Badge>
              </TabTitleText>
            }
          >
            <MemberOfToolbar
              pageRepo={rolesRepository}
              shownItems={shownRolesList}
              toolbar="roles"
              settersData={toolbarSettersData}
              pageData={toolbarPageData}
              buttonData={toolbarButtonData}
              searchValueData={searchValueData}
            />
            <MemberOfTable
              group={shownRolesList}
              tableName={"Roles"}
              activeTabKey={activeTabKey}
              changeSelectedGroups={updateGroupsNamesSelected}
              buttonData={tableButtonData}
              showTableRows={showTableRows}
              searchValue={searchValue}
              fullGroupList={rolesRepository}
            />
          </Tab>
        </Tabs>
        <Pagination
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          itemCount={rolesRepository.length}
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
          <MemberOfAddModal
            modalData={addModalData}
            availableData={rolesFilteredData}
            groupRepository={rolesRepository}
            updateGroupRepository={updateGroupRepository}
            updateAvOptionsList={updateRolesList}
            tabData={tabData}
          />
        </Tab>
      </Tabs>
    </TabLayout>
  );
};

export default ServicesMemberOf;
