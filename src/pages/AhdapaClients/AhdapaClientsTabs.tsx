import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router
import { useNavigate, useParams } from "react-router";
// Components
import { NotFound } from "src/components/errors/PageErrors";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import AhdapaClientsSettings from "./AhdapaClientsSettings";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetAhdapaClientQuery } from "src/services/rpcAhdapaClients";

const AhdapaClientsTabs = ({ section }: { section?: string }) => {
  const { client_id } = useParams<{ client_id: string }>();
  const navigate = useNavigate();
  const pathname = "ahdapa-clients";

  useUpdateRoute({ pathname });

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const [activeTabKey, setActiveTabKey] = React.useState(section || "settings");

  const {
    data: client,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useGetAhdapaClientQuery(client_id || "");

  // Editable copy of the client for settings form
  const [editedClient, setEditedClient] = React.useState(client);

  React.useEffect(() => {
    if (client && !isFetching) {
      setEditedClient({ ...client });
    }
  }, [client, isFetching]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + encodeURIComponent(client_id || ""));
    }
  };

  React.useEffect(() => {
    const currentPath: BreadCrumbItem[] = [
      {
        name: "OAuth2 Clients",
        url: "/" + pathname,
      },
      {
        name: client_id || "",
        url: "/" + pathname + "/" + encodeURIComponent(client_id || ""),
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey(section || "settings");
  }, [client_id, section]);

  if (isLoading || (isFetching && !client)) {
    return <DataSpinner />;
  }

  if (!isLoading && (isError || !client)) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={client_id || ""}
          preText="OAuth2 Client:"
          text={client_id || ""}
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
            {editedClient && (
              <AhdapaClientsSettings
                client={editedClient}
                originalClient={client!}
                onClientChange={setEditedClient}
                onRefresh={refetch}
                isFetching={isFetching}
              />
            )}
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default AhdapaClientsTabs;
