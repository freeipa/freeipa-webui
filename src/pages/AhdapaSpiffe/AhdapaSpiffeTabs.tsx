import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextArea,
  TextInput,
  PageSection,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
// React Router
import { useNavigate, useParams } from "react-router";
// Data types
import { AhdapaSpiffeEntry } from "src/utils/datatypes/ahdapaDataTypes";
// Components
import { NotFound } from "src/components/errors/PageErrors";
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import TabLayout from "src/components/layouts/TabLayout";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
// RPC
import {
  useGetAhdapaSpiffeEntryQuery,
  useUpdateAhdapaSpiffeEntryMutation,
  useDeleteAhdapaSpiffeEntryMutation,
} from "src/services/rpcAhdapaSpiffe";

const AhdapaSpiffeTabs = ({ section }: { section?: string }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const pathname = "ahdapa-spiffe";

  useUpdateRoute({ pathname });

  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);

  const [activeTabKey, setActiveTabKey] = React.useState(section || "settings");

  const {
    data: entry,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useGetAhdapaSpiffeEntryQuery(id || "");

  const [updateEntry] = useUpdateAhdapaSpiffeEntryMutation();
  const [deleteEntry] = useDeleteAhdapaSpiffeEntryMutation();

  // Editable copy
  const [editedEntry, setEditedEntry] = React.useState<
    AhdapaSpiffeEntry | undefined
  >(entry);

  React.useEffect(() => {
    if (entry && !isFetching) {
      setEditedEntry({ ...entry });
    }
  }, [entry, isFetching]);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as string);
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + encodeURIComponent(id || ""));
    }
  };

  React.useEffect(() => {
    const currentPath: BreadCrumbItem[] = [
      {
        name: "SPIFFE Workload Entries",
        url: "/" + pathname,
      },
      {
        name: id || "",
        url: "/" + pathname + "/" + encodeURIComponent(id || ""),
        isActive: true,
      },
    ];
    setBreadcrumbItems(currentPath);
    setActiveTabKey(section || "settings");
  }, [id, section]);

  // Detect modifications
  const isModified = React.useMemo(() => {
    return JSON.stringify(editedEntry) !== JSON.stringify(entry);
  }, [editedEntry, entry]);

  // Field change helpers
  const updateField = <K extends keyof AhdapaSpiffeEntry>(
    field: K,
    value: AhdapaSpiffeEntry[K]
  ) => {
    if (editedEntry) {
      setEditedEntry({ ...editedEntry, [field]: value });
    }
  };

  // Revert
  const onRevert = () => {
    if (entry) {
      setEditedEntry({ ...entry });
    }
    refetch();
    dispatch(
      addAlert({
        name: "revert-spiffe-entry-success",
        title: "SPIFFE entry settings reverted",
        variant: "success",
      })
    );
  };

  // Save
  const [isSaving, setIsSaving] = React.useState(false);

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editedEntry || !id) return;
    setIsSaving(true);

    try {
      await updateEntry({
        id,
        body: {
          spiffe_id: editedEntry.spiffe_id,
          selectors: editedEntry.selectors,
          node_constraint: editedEntry.node_constraint,
          ttl_seconds: editedEntry.ttl_seconds,
        },
      }).unwrap();
      dispatch(
        addAlert({
          name: "save-spiffe-entry-success",
          title: `SPIFFE entry '${id}' updated`,
          variant: "success",
        })
      );
      refetch();
    } catch {
      dispatch(
        addAlert({
          name: "save-spiffe-entry-error",
          title: "Failed to update SPIFFE entry",
          variant: "danger",
        })
      );
    }
    setIsSaving(false);
  };

  // Delete
  const onDelete = async () => {
    if (!id) return;
    try {
      await deleteEntry(id).unwrap();
      dispatch(
        addAlert({
          name: "delete-spiffe-entry-success",
          title: `SPIFFE entry '${id}' deleted`,
          variant: "success",
        })
      );
      navigate("/" + pathname);
    } catch {
      dispatch(
        addAlert({
          name: "delete-spiffe-entry-error",
          title: "Failed to delete SPIFFE entry",
          variant: "danger",
        })
      );
    }
  };

  // Toolbar buttons
  const toolbarFields: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="ahdapa-spiffe-settings-button-refresh"
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      ),
    },
    {
      key: 1,
      element: (
        <Button
          variant="secondary"
          data-cy="ahdapa-spiffe-settings-button-revert"
          isDisabled={!isModified || isSaving}
          onClick={onRevert}
        >
          Revert
        </Button>
      ),
    },
    {
      key: 2,
      element: (
        <Button
          variant="secondary"
          data-cy="ahdapa-spiffe-settings-button-delete"
          isDanger
          onClick={onDelete}
        >
          Delete
        </Button>
      ),
    },
    {
      key: 3,
      element: (
        <Button
          variant="primary"
          data-cy="ahdapa-spiffe-settings-button-save"
          isDisabled={!isModified || isSaving}
          type="submit"
          form="ahdapa-spiffe-settings-form"
        >
          Save
        </Button>
      ),
    },
  ];

  if (isLoading || (isFetching && !entry)) {
    return <DataSpinner />;
  }

  if (!isLoading && (isError || !entry)) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={id || ""}
          preText="SPIFFE Entry:"
          text={id || ""}
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
            {editedEntry && (
              <TabLayout
                id="ahdapa-spiffe-settings-page"
                toolbarItems={toolbarFields}
              >
                <Form
                  className="pf-v6-u-mb-lg"
                  id="ahdapa-spiffe-settings-form"
                  onSubmit={onSave}
                >
                  <TitleLayout
                    id="spiffe-identity"
                    text="SPIFFE Identity"
                    headingLevel="h2"
                    className="pf-v6-u-mt-lg pf-v6-u-mb-md"
                  />
                  <Flex direction={{ default: "column", lg: "row" }}>
                    <FlexItem flex={{ default: "flex_1" }}>
                      <FormGroup label="ID" fieldId="entry_id">
                        <TextInput
                          id="entry_id"
                          data-cy="ahdapa-spiffe-settings-id"
                          value={editedEntry.id}
                          isDisabled
                          aria-label="Entry ID"
                        />
                      </FormGroup>
                      <FormGroup
                        label="SPIFFE ID"
                        fieldId="spiffe_id"
                        isRequired
                      >
                        <TextInput
                          id="spiffe_id"
                          data-cy="ahdapa-spiffe-settings-spiffe-id"
                          value={editedEntry.spiffe_id}
                          onChange={(_event, value) =>
                            updateField("spiffe_id", value)
                          }
                          aria-label="SPIFFE ID"
                        />
                      </FormGroup>
                      <FormGroup
                        label="Selectors (one per line)"
                        fieldId="selectors"
                        isRequired
                      >
                        <TextArea
                          id="selectors"
                          data-cy="ahdapa-spiffe-settings-selectors"
                          value={editedEntry.selectors.join("\n")}
                          onChange={(_event, value) =>
                            updateField(
                              "selectors",
                              value
                                .split("\n")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            )
                          }
                          rows={4}
                          aria-label="Selectors"
                        />
                      </FormGroup>
                      <FormGroup
                        label="Node Constraint"
                        fieldId="node_constraint"
                      >
                        <TextInput
                          id="node_constraint"
                          data-cy="ahdapa-spiffe-settings-node-constraint"
                          value={editedEntry.node_constraint || ""}
                          onChange={(_event, value) =>
                            updateField("node_constraint", value || null)
                          }
                          aria-label="Node Constraint"
                        />
                      </FormGroup>
                      <FormGroup label="TTL (seconds)" fieldId="ttl_seconds">
                        <TextInput
                          id="ttl_seconds"
                          data-cy="ahdapa-spiffe-settings-ttl"
                          type="number"
                          value={editedEntry.ttl_seconds.toString()}
                          onChange={(_event, value) =>
                            updateField("ttl_seconds", parseInt(value, 10) || 0)
                          }
                          aria-label="TTL Seconds"
                        />
                      </FormGroup>
                    </FlexItem>
                  </Flex>
                </Form>
              </TabLayout>
            )}
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default AhdapaSpiffeTabs;
