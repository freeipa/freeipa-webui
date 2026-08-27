import React, { useState } from "react";
import { PageSection, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import { useNavigate } from "react-router";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import DataSpinner from "src/components/layouts/DataSpinner";
import TitleLayout from "src/components/layouts/TitleLayout";
import { NotFound } from "src/components/errors/PageErrors";
import { useDelegationSettings } from "src/hooks/useDelegationsSettingsData";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { useAppDispatch } from "src/store/hooks";
import { updateBreadCrumbPath } from "src/store/Global/routes-slice";
import {
  closeHelpPanel,
  toggleHelpPanel,
} from "src/store/Global/contextual-help-slice";
import { useSafeParams } from "src/utils/paramsUtils";
import DelegationsSettings from "./DelegationsSettings";

interface DelegationsTabsProps {
  section: string;
}

type DelegationParams = {
  aciname: string;
};

const TAB_ROUTES: Record<string, (aciname: string) => string> = {
  settings: (aciname) => `/delegations/${aciname}`,
};

const DelegationsTabs = ({ section }: DelegationsTabsProps) => {
  const { aciname } = useSafeParams<DelegationParams>(["aciname"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useContextualHelpTopic("delegations-settings");

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  React.useEffect(() => {
    dispatch(closeHelpPanel());
  }, [section, dispatch]);

  const delegationSettingsData = useDelegationSettings(aciname);
  const [activeTabKey, setActiveTabKey] = useState(section || "settings");

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    const tabKey = String(tabIndex);
    const toPath = TAB_ROUTES[tabKey];
    if (toPath) {
      navigate(toPath(aciname));
    }
  };

  React.useEffect(() => {
    const currentPath: BreadCrumbItem[] = [
      {
        name: "Delegations",
        url: "/delegations",
      },
      {
        name: aciname,
        url: "/delegations/" + aciname,
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey("settings");
    dispatch(updateBreadCrumbPath(currentPath));
  }, [aciname, dispatch]);

  React.useEffect(() => {
    if (!section) {
      navigate("/delegations/" + aciname);
    }
    setActiveTabKey(section || "settings");
  }, [section, aciname, navigate]);

  if (delegationSettingsData.isLoading) {
    return <DataSpinner />;
  }

  if (!delegationSettingsData.delegation.aciname) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb
          className="pf-v6-u-mb-sm"
          breadcrumbItems={breadcrumbItems}
        />
        <TitleLayout
          id={delegationSettingsData.delegation.aciname}
          preText="Delegation:"
          text={delegationSettingsData.delegation.aciname}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs" isFilled>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          variant="secondary"
          isBox
          className="pf-v6-u-ml-lg"
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"settings"}
            name="settings-details"
            title={<TabTitleText>Settings</TabTitleText>}
          >
            <DelegationsSettings
              delegation={delegationSettingsData.delegation}
              originalDelegation={delegationSettingsData.originalDelegation}
              metadata={delegationSettingsData.metadata}
              onDelegationChange={delegationSettingsData.setDelegation}
              onRefresh={delegationSettingsData.refetch}
              isModified={delegationSettingsData.modified}
              isDataLoading={delegationSettingsData.isFetching}
              modifiedValues={delegationSettingsData.modifiedValues}
              onResetValues={delegationSettingsData.resetValues}
              onOpenContextualPanel={() => dispatch(toggleHelpPanel())}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default DelegationsTabs;
