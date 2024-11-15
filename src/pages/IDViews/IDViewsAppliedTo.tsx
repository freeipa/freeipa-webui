import React, { useEffect, useState } from "react";
// PatternFly
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  Page,
  PageSection,
  PageSectionVariants,
  PaginationVariant,
  SearchInput,
  TextVariants,
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
// Tables
import IDViewsAppliedToTable from "src/pages/IDViews/IDViewsAppliedToTable";
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
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
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
  const [showUnapplyHostGroupModal, setShowUnapplyHostGroupModal] =
    useState(false);
  const [applySpinning, setApplySpinning] = useState(false);

  const openUnapplyHostgroupModal = () => {
    setShowUnapplyHostGroupModal(true);
  };
  const closeUnapplyHostgroupModal = () => {
    setShowUnapplyHostGroupModal(false);
  };

  const onUnapplyHosts = () => {
    setApplySpinning(true);

    // unapply views from hosts
    executeUnapplyHosts(selectedHosts).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
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
                    <li className="pf-v5-u-ml-sm" key={item}>
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
        } else if (response.data.error) {
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
    });
  };

  const onUnapplyHostgroups = (hostGroups: string[]) => {
    setApplySpinning(true);

    // unapply views from host groups
    executeUnapplyHostgroups(hostGroups).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
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
                    <li className="pf-v5-u-ml-sm" key={item}>
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
        } else if (response.data.error) {
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
      closeUnapplyHostgroupModal();
    });
  };

  // Apply functions
  const [showApplyHostModal, setShowApplyHostModal] = useState(false);
  const [showApplyHostGroupModal, setShowApplyHostGroupModal] = useState(false);
  const openApplyHostModal = () => {
    setShowApplyHostModal(true);
  };
  const closeApplyHostModal = () => {
    setShowApplyHostModal(false);
  };
  const openApplyHostGroupModal = () => {
    setShowApplyHostGroupModal(true);
  };
  const closeApplyHostGroupModal = () => {
    setShowApplyHostGroupModal(false);
  };

  const onApplyHosts = (hosts: string[]) => {
    setApplySpinning(true);

    const payload = {
      viewName: props.idView.cn,
      items: hosts,
    } as ViewApplyPayload;

    // Apply views to hosts
    executeApplyHosts(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
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
                    <li className="pf-v5-u-ml-sm" key={item}>
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
              "apply-id-view-hosts-success",
              "ID view applied to " +
                response.data.result["completed"] +
                " hosts",
              "success"
            );
          }
          // Refresh data
          refreshViewsData();
        } else if (response.data.error) {
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
      closeApplyHostModal();
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
        if (response.data.result) {
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
                    <li className="pf-v5-u-ml-sm" key={item}>
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
        } else if (response.data.error) {
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
      closeApplyHostModal();
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
          name="search"
          placeholder="Search hosts"
          value={searchValue}
          onChange={(_event, value) => updateSearchValue(value)}
          onClear={() => setSearchValue("")}
        />
      ),
      toolbarItemVariant: "search-filter",
      toolbarItemSpacer: { default: "spacerMd" },
    },
    {
      key: 2,
      toolbarItemVariant: "separator",
    },
    {
      key: 3,
      element: (
        <Button variant="secondary" onClick={refreshViewsData}>
          Refresh
        </Button>
      ),
    },
    {
      key: 4,
      element: (
        <Dropdown
          isOpen={isApplyOpen}
          onSelect={onSelectApply}
          onOpenChange={(isApplyOpen: boolean) => setIsApplyOpen(isApplyOpen)}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              className="pf-m-small"
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
          className="pf-m-small"
        >
          <DropdownList>
            <DropdownItem
              value={1}
              key="apply-hosts"
              onClick={() => setShowApplyHostModal(true)}
            >
              Apply hosts
            </DropdownItem>
            <DropdownItem
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
          isOpen={isUnapplyOpen}
          onSelect={onSelectUnapply}
          onOpenChange={(isUnapplyOpen: boolean) =>
            setIsUnapplyOpen(isUnapplyOpen)
          }
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
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
              value={1}
              key="unapply-hosts"
              onClick={onUnapplyHosts}
              isDisabled={isDeleteButtonDisabled}
            >
              Unapply hosts
            </DropdownItem>
            <DropdownItem
              value={2}
              key=""
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
      toolbarItemVariant: "separator",
    },
    {
      key: 7,
      element: (
        <HelpTextWithIconLayout
          textComponent={TextVariants.p}
          subTextComponent={TextVariants.a}
          subTextIsVisitedLink={true}
          textContent="Help"
          icon={
            <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
          }
        />
      ),
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
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  return (
    <Page>
      <alerts.ManagedAlerts />
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg pf-v5-u-pb-md pf-v5-u-pl-0 pf-v5-u-pr-0"
      >
        <ToolbarLayout
          className="pf-v5-u-pt-0 pf-v5-u-pl-lg pf-v5-u-pr-md"
          contentClassName="pf-v5-u-p-0"
          toolbarItems={toolbarItems}
        />
        <div className="pf-v5-u-ml-md pf-v5-u-mr-md">
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
        </div>
        <PaginationLayout
          list={hostsList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md pf-v5-u-mt-md"
        />
      </PageSection>
      <ModalErrors errors={modalErrors.getAll()} />
      <DualListLayout
        entry={""}
        target={"hostgroup"}
        showModal={showUnapplyHostGroupModal}
        onCloseModal={closeUnapplyHostgroupModal}
        onOpenModal={openUnapplyHostgroupModal}
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
        onCloseModal={closeApplyHostModal}
        onOpenModal={openApplyHostModal}
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
        onCloseModal={closeApplyHostGroupModal}
        onOpenModal={openApplyHostGroupModal}
        tableElementsList={[]}
        action={onApplyHostGroups}
        title={
          "Apply ID view '" + props.idView.cn + "' on hosts of host groups"
        }
        spinning={applySpinning}
        addBtnName="Apply"
        addSpinningBtnName="Applying"
      />
    </Page>
  );
};

export default IDViewsAppliedTo;
