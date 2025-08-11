import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  PaginationVariant,
  SearchInput,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Layouts
import DualListLayout from "src/components/layouts/DualListLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
// Components
import PaginationLayout from "src/components/layouts/PaginationLayout";
import MemberOfDeleteModal from "src/components/MemberOf/MemberOfDeleteModal";
// Tables
import IDViewsAppliedToTable from "src/pages/IDViews/IDViewsAppliedToTable";
import DeletedElementsTable from "src/components/tables/DeletedElementsTable";
// Utils
import { partialViewToView } from "src/utils/idViewUtils";
// Data types
import { IDView } from "src/utils/datatypes/globalDataTypes";
// Hooks
import { useAlerts } from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// Errors
import useApiError from "src/hooks/useApiError";
import ModalErrors from "src/components/errors/ModalErrors";
// RPC client
import { ErrorResult } from "../../services/rpc";
import {
  ViewApplyPayload,
  useGetIDViewsFullDataQuery,
  useApplyHostsMutation,
  useApplyHostGroupsMutation,
  useUnapplyHostsMutation,
  useUnapplyHostgroupsMutation,
} from "../../services/rpcIDViews";
import TabLayout from "src/components/layouts/TabLayout";

export interface AppliesToProps {
  idView: IDView;
  onRefresh: () => void;
}

const IDViewsAppliedTo = (props: AppliesToProps) => {
  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "id-views",
    noBreadcrumb: true,
  });

  // API
  const [executeApplyHosts] = useApplyHostsMutation();
  const [executeApplyHostgroups] = useApplyHostGroupsMutation();
  const [executeUnapplyHosts] = useUnapplyHostsMutation();
  const [executeUnapplyHostgroups] = useUnapplyHostgroupsMutation();

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // Initialize views (Redux)
  const [hostsList, setHostsList] = useState<string[]>([]);
  const [shownHostsList, setShownHostsList] = useState<string[]>([]);

  // Alerts to show in the UI
  const alerts = useAlerts();

  // URL parameters: page number, page size, search value
  const { page, setPage, perPage, setPerPage, searchValue, setSearchValue } =
    useListPageSearchParams();

  // Handle API calls errors
  const modalErrors = useApiError([]);

  // Table comps
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const updateSelectedPerPage = (selected: number) => {
    setSelectedPerPage(selected);
  };
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };
  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsUnapplyButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  const [isUnapply, setIsUnapply] = useState(false);
  const updateIsUnapply = (value: boolean) => {
    setIsUnapply(value);
  };

  const updateShownHosts = (newShownHostsList: string[]) => {
    setShownHostsList(newShownHostsList);
  };

  // Page indexes
  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const idViewFullDataQuery = useGetIDViewsFullDataQuery(props.idView.cn);
  const idViewFullData = idViewFullDataQuery.data;

  useEffect(() => {
    if (
      idViewFullData &&
      idViewFullData.idView &&
      !idViewFullDataQuery.isFetching
    ) {
      const idView = partialViewToView(idViewFullData.idView);
      const length = idView["appliedtohosts"].length;
      const shownHosts: string[] = [];
      for (let i = firstIdx; i < length && i < lastIdx; i++) {
        shownHosts.push(idView["appliedtohosts"][i]);
      }
      setHostsList(idView["appliedtohosts"]);
      setShownHostsList(shownHosts);
    }
  }, [idViewFullData, idViewFullDataQuery.isFetching]);

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  useEffect(() => {
    idViewFullDataQuery.refetch();
  }, [page, perPage]);

  // Refresh button handling
  const refreshViewsData = () => {
    setTotalCount(0);
    clearSelectedHosts();
    setPage(1);
    props.onRefresh();
  };

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    const searchResults: string[] = [];
    for (let i = 0; i < hostsList.length; i++) {
      if (hostsList[i].toLowerCase().includes(searchValue.toLowerCase())) {
        searchResults.push(hostsList[i]);
      }
    }
    setShownHostsList(searchResults);
  }, [searchValue]);

  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const clearSelectedHosts = () => {
    const emptyList: string[] = [];
    setSelectedHosts(emptyList);
  };

  // Unapply functions
  const [showUnapplyHostsModal, setShowUnapplyHostsModal] = useState(false);
  const [showUnapplyHostGroupModal, setShowUnapplyHostGroupModal] =
    useState(false);
  const [applySpinning, setApplySpinning] = useState(false);

  const onUnapplyHosts = () => {
    setApplySpinning(true);

    // unapply views from hosts
    executeUnapplyHosts(selectedHosts).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          const failed_response = response.data.result["failed"];
          if (failed_response.memberhost.host.length > 0) {
            const failed_hosts = failed_response.memberhost.host;
            const failed_msgs: string[] = [];
            for (let i = 0; i < failed_hosts.length; i++) {
              failed_msgs.push(failed_hosts[i][0]);
            }
            const alert_msg = (
              <>
                ID View cannot be unapplied to IPA master
                {failed_msgs.length > 1 ? "s" : ""}:
                <ul>
                  {failed_msgs.map((item) => (
                    <li className="pf-v6-u-ml-sm" key={item}>
                      &#8226; {item}
                    </li>
                  ))}
                </ul>
                {response.data.result["completed"] > 0
                  ? "However " +
                    response.data.result["completed"] +
                    " hosts were unapplied"
                  : ""}
              </>
            );
            alerts.addAlert("unapply-id-view-hosts-error", alert_msg, "danger");
          } else {
            alerts.addAlert(
              "unapply-id-view-hosts-success",
              "ID view unapplied from " +
                response.data.result["completed"] +
                " hosts",
              "success"
            );
          }
          // Refresh data
          refreshViewsData();
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "unapply-id-view-hosts-error",
            "ID view unapplied from hosts failed: " + errorMessage.message,
            "danger"
          );
        }
      }
      setApplySpinning(false);
      // Close Unapply modal
      setShowUnapplyHostsModal(false);
    });
  };

  const onUnapplyHostgroups = (hostGroups: string[]) => {
    setApplySpinning(true);

    // unapply views from host groups
    executeUnapplyHostgroups(hostGroups).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          const failed_response = response.data.result["failed"];
          if (failed_response.memberhost.host.length > 0) {
            const failed_hosts = failed_response.memberhost.host;
            const failed_msgs: string[] = [];
            for (let i = 0; i < failed_hosts.length; i++) {
              failed_msgs.push(failed_hosts[i][0]);
            }
            const alert_msg = (
              <>
                ID View cannot be unapplied to IPA master
                {failed_msgs.length > 1 ? "s" : ""}:
                <ul>
                  {failed_msgs.map((item) => (
                    <li className="pf-v6-u-ml-sm" key={item}>
                      &#8226; {item}
                    </li>
                  ))}
                </ul>
                {response.data.result["completed"] > 0
                  ? "However " +
                    response.data.result["completed"] +
                    " hosts were unapplied"
                  : ""}
              </>
            );
            alerts.addAlert(
              "unapply-id-view-host-groups-error",
              alert_msg,
              "danger"
            );
          } else {
            alerts.addAlert(
              "unapply-id-view-hosts-success",
              "ID view unapplied from " +
                response.data.result["completed"] +
                " hosts",
              "success"
            );
          }
          // Refresh data
          refreshViewsData();
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "unapply-id-view-hosts-error",
            "ID view unapplied from host groups failed: " +
              errorMessage.message,
            "danger"
          );
        }
      }
      setApplySpinning(false);
      // Close Unapply modal
      setShowUnapplyHostGroupModal(false);
    });
  };

  // Apply functions
  const [showApplyHostModal, setShowApplyHostModal] = useState(false);
  const [showApplyHostGroupModal, setShowApplyHostGroupModal] = useState(false);

  const onApplyHosts = (hosts: string[]) => {
    setApplySpinning(true);

    const payload = {
      viewName: props.idView.cn,
      items: hosts,
    } as ViewApplyPayload;

    // Apply views to hosts
    executeApplyHosts(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          const failed_response = response.data.result["failed"];
          if (failed_response.memberhost.host.length > 0) {
            const failed_hosts = failed_response.memberhost.host;
            const failed_msgs: string[] = [];
            for (let i = 0; i < failed_hosts.length; i++) {
              failed_msgs.push(failed_hosts[i][0]);
            }
            const alert_msg = (
              <>
                ID View cannot be applied to IPA master
                {failed_msgs.length > 1 ? "s" : ""}:
                <ul>
                  {failed_msgs.map((item) => (
                    <li className="pf-v6-u-ml-sm" key={item}>
                      &#8226; {item}
                    </li>
                  ))}
                </ul>
                {response.data?.result["completed"] > 0
                  ? "However " +
                    response.data?.result["completed"] +
                    " hosts were applied"
                  : ""}
              </>
            );
            alerts.addAlert("apply-id-view-hosts-error", alert_msg, "danger");
          } else {
            alerts.addAlert(
              "apply-id-view-hosts-success",
              "ID view applied to " +
                response.data?.result["completed"] +
                " hosts",
              "success"
            );
          }
          // Refresh data
          refreshViewsData();
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "apply-id-view-hosts-error",
            "ID view applied to hosts failed: " + errorMessage.message,
            "danger"
          );
        }
      }
      setApplySpinning(false);
      // Close Apply modal
      setShowApplyHostModal(false);
    });
  };

  const onApplyHostGroups = (hostGroups: string[]) => {
    setApplySpinning(true);

    const payload = {
      viewName: props.idView.cn,
      items: hostGroups,
    } as ViewApplyPayload;

    // Apply views to host groups
    executeApplyHostgroups(payload).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          const failed_response = response.data.result["failed"];
          if (failed_response.memberhost.host.length > 0) {
            const failed_hosts = failed_response.memberhost.host;
            const failed_msgs: string[] = [];
            for (let i = 0; i < failed_hosts.length; i++) {
              failed_msgs.push(failed_hosts[i][0]);
            }
            const alert_msg = (
              <>
                ID View cannot be applied to IPA master
                {failed_msgs.length > 1 ? "s" : ""}:
                <ul>
                  {failed_msgs.map((item) => (
                    <li className="pf-v6-u-ml-sm" key={item}>
                      &#8226; {item}
                    </li>
                  ))}
                </ul>
                {response.data.result["completed"] > 0
                  ? "However " +
                    response.data.result["completed"] +
                    " hosts were applied"
                  : ""}
              </>
            );
            alerts.addAlert("apply-id-view-hosts-error", alert_msg, "danger");
          } else {
            alerts.addAlert(
              "apply-id-view-host-groups-success",
              "ID view applied to " +
                response.data.result["completed"] +
                " hosts",
              "success"
            );
          }
          // Refresh data
          refreshViewsData();
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "apply-id-view-host-groups-error",
            "ID view applied to host groups failed: " + errorMessage.message,
            "danger"
          );
        }
      }
      setApplySpinning(false);
      // Close Apply modal
      setShowApplyHostGroupModal(false);
    });
  };

  // Data wrappers
  // - 'PaginationLayout'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    updateSelectedPerPage,
    updateShownElementsList: updateShownHosts,
    totalCount,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  const hostsTableData = {
    selectedHosts,
    hostsList,
    setSelectedHosts,
    clearSelectedHosts,
  };

  const viewsTableButtonsData = {
    updateIsUnapplyButtonDisabled,
    isUnapply,
    updateIsUnapply,
  };

  // Dropdown select feature
  const [isApplyOpen, setIsApplyOpen] = React.useState(false);
  const onToggleClickApply = () => {
    setIsApplyOpen(!isApplyOpen);
  };
  const onSelectApply = () => {
    setIsApplyOpen(false);
  };

  const [isUnapplyOpen, setIsUnapplyOpen] = React.useState(false);
  const onToggleClickUnapply = () => {
    setIsUnapplyOpen(!isUnapplyOpen);
  };
  const onSelectUnapply = () => {
    setIsUnapplyOpen(false);
  };

  // List of toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 1,
      element: (
        <SearchInput
          data-cy="search"
          name="search"
          placeholder="Search hosts"
          value={searchValue}
          onChange={(_event, value) => updateSearchValue(value)}
          onClear={() => setSearchValue("")}
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    },
    {
      key: 2,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 3,
      element: (
        <Button
          data-cy="id-views-tab-applied-to-refresh"
          variant="secondary"
          onClick={refreshViewsData}
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 4,
      element: (
        <Dropdown
          data-cy="id-views-tab-applied-to-kebab"
          isOpen={isApplyOpen}
          onSelect={onSelectApply}
          onOpenChange={(isApplyOpen: boolean) => setIsApplyOpen(isApplyOpen)}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              data-cy="id-views-tab-applied-to-kebab-apply-toggle"
              ref={toggleRef}
              onClick={onToggleClickApply}
              isExpanded={isApplyOpen}
              variant="secondary"
            >
              Apply
            </MenuToggle>
          )}
          ouiaId="ApplyDropdown"
          shouldFocusToggleOnSelect
        >
          <DropdownList>
            <DropdownItem
              data-cy="id-views-tab-applied-to-kebab-apply-hosts"
              value={1}
              key="apply-hosts"
              onClick={() => setShowApplyHostModal(true)}
            >
              Apply hosts
            </DropdownItem>
            <DropdownItem
              data-cy="id-views-tab-applied-to-kebab-apply-host-groups"
              value={2}
              key="apply-host-groups"
              onClick={() => setShowApplyHostGroupModal(true)}
            >
              Apply host groups
            </DropdownItem>
          </DropdownList>
        </Dropdown>
      ),
    },
    {
      key: 5,
      element: (
        <Dropdown
          data-cy="id-views-tab-applied-to-kebab-unapply"
          isOpen={isUnapplyOpen}
          onSelect={onSelectUnapply}
          onOpenChange={(isUnapplyOpen: boolean) =>
            setIsUnapplyOpen(isUnapplyOpen)
          }
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              data-cy="id-views-tab-applied-to-kebab-unapply-toggle"
              ref={toggleRef}
              onClick={onToggleClickUnapply}
              isExpanded={isUnapplyOpen}
              variant="secondary"
            >
              Unapply
            </MenuToggle>
          )}
          ouiaId="UnapplyDropdown"
          shouldFocusToggleOnSelect
        >
          <DropdownList>
            <DropdownItem
              data-cy="id-views-tab-applied-to-kebab-unapply-hosts"
              value={1}
              key="unapply-hosts"
              onClick={() => setShowUnapplyHostsModal(true)}
              isDisabled={isDeleteButtonDisabled}
            >
              Unapply hosts
            </DropdownItem>
            <DropdownItem
              data-cy="id-views-tab-applied-to-kebab-unapply-host-groups"
              value={2}
              key="unapply-host-groups"
              onClick={() => setShowUnapplyHostGroupModal(true)}
            >
              Unapply host groups
            </DropdownItem>
          </DropdownList>
        </Dropdown>
      ),
    },
    {
      key: 6,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 7,
      element: <HelpTextWithIconLayout textContent="Help" />,
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={hostsList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <div
      style={{
        height: `var(--subsettings-calc)`,
      }}
    >
      <TabLayout id="override sections">
        <alerts.ManagedAlerts />
        <PageSection hasBodyWrapper={false} isFilled={false}>
          <ToolbarLayout toolbarItems={toolbarItems} />
          <OuterScrollContainer>
            <InnerScrollContainer>
              <IDViewsAppliedToTable
                hosts={hostsList}
                shownHosts={shownHostsList}
                hostsData={hostsTableData}
                buttonsData={viewsTableButtonsData}
                paginationData={selectedPerPageData}
              />
            </InnerScrollContainer>
          </OuterScrollContainer>
          <PaginationLayout
            list={hostsList}
            paginationData={paginationData}
            variant={PaginationVariant.bottom}
            widgetId="pagination-options-menu-bottom"
          />
        </PageSection>
        <ModalErrors
          errors={modalErrors.getAll()}
          dataCy="id-views-tab-applied-to-modal-error"
        />
        <DualListLayout
          entry={""}
          target={"hostgroup"}
          showModal={showUnapplyHostGroupModal}
          onCloseModal={() => setShowUnapplyHostGroupModal(false)}
          onOpenModal={() => setShowUnapplyHostGroupModal(true)}
          tableElementsList={[]}
          action={onUnapplyHostgroups}
          title={"Un-apply ID Views from hosts of hostgroups"}
          spinning={applySpinning}
          addBtnName="Unapply"
          addSpinningBtnName="Unapplying"
        />
        <DualListLayout
          entry={""}
          target={"host"}
          showModal={showApplyHostModal}
          onCloseModal={() => setShowApplyHostModal(false)}
          onOpenModal={() => setShowApplyHostModal(true)}
          tableElementsList={hostsList}
          action={onApplyHosts}
          title={"Apply ID view '" + props.idView.cn + "' on hosts"}
          spinning={applySpinning}
          addBtnName="Apply"
          addSpinningBtnName="Applying"
        />
        <DualListLayout
          entry={""}
          target={"hostgroup"}
          showModal={showApplyHostGroupModal}
          onCloseModal={() => setShowApplyHostGroupModal(false)}
          onOpenModal={() => setShowApplyHostGroupModal(true)}
          tableElementsList={[]}
          action={onApplyHostGroups}
          title={
            "Apply ID view '" + props.idView.cn + "' on hosts of host groups"
          }
          spinning={applySpinning}
          addBtnName="Apply"
          addSpinningBtnName="Applying"
        />
        {/* Delete confirmation modal - Unapply Hosts*/}
        <MemberOfDeleteModal
          showModal={showUnapplyHostsModal}
          onCloseModal={() => setShowUnapplyHostsModal(false)}
          title={"Un-apply ID view '" + props.idView.cn + "' from hosts"}
          onDelete={onUnapplyHosts}
          spinning={applySpinning}
        >
          <DeletedElementsTable
            mode="passing_id"
            elementsToDelete={selectedHosts}
            columnNames={["Hosts"]}
            elementType="Host"
            idAttr="fqdn"
          />
        </MemberOfDeleteModal>
      </TabLayout>
    </div>
  );
};

export default IDViewsAppliedTo;
