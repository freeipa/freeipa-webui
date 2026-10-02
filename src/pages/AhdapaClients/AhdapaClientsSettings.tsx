import React from "react";
// PatternFly
import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  JumpLinks,
  JumpLinksItem,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Checkbox,
} from "@patternfly/react-core";
// Data types
import {
  AhdapaClient,
  AhdapaAuthMethod,
} from "src/utils/datatypes/ahdapaDataTypes";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { addAlert } from "src/store/Global/alerts-slice";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useUpdateAhdapaClientMutation } from "src/services/rpcAhdapaClients";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import TabLayout from "src/components/layouts/TabLayout";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";

interface PropsToSettings {
  client: AhdapaClient;
  originalClient: AhdapaClient;
  onClientChange: (client: AhdapaClient) => void;
  onRefresh: () => void;
  isFetching: boolean;
}

const AUTH_METHODS: AhdapaAuthMethod[] = [
  "none",
  "client_secret_basic",
  "client_secret_post",
  "client_secret_jwt",
  "private_key_jwt",
  "tls_client_auth",
  "self_signed_tls_client_auth",
  "kerberos_client_auth",
];

const AhdapaClientsSettings = (props: PropsToSettings) => {
  const dispatch = useAppDispatch();
  useUpdateRoute({ pathname: "ahdapa-clients" });

  const [isSaving, setIsSaving] = React.useState(false);
  const [updateClient] = useUpdateAhdapaClientMutation();

  // Detect modifications
  const isModified = React.useMemo(() => {
    return (
      JSON.stringify(props.client) !== JSON.stringify(props.originalClient)
    );
  }, [props.client, props.originalClient]);

  // Field change helpers
  const updateField = <K extends keyof AhdapaClient>(
    field: K,
    value: AhdapaClient[K]
  ) => {
    props.onClientChange({ ...props.client, [field]: value });
  };

  const updateArrayField = (field: keyof AhdapaClient, value: string) => {
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    props.onClientChange({ ...props.client, [field]: arr });
  };

  // Revert
  const onRevert = () => {
    props.onClientChange({ ...props.originalClient });
    props.onRefresh();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Client settings reverted",
        variant: "success",
      })
    );
  };

  // Save
  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateClient({
        clientId: props.client.client_id,
        body: {
          client_name: props.client.client_name,
          redirect_uris: props.client.redirect_uris,
          scopes: props.client.scopes,
          token_endpoint_auth_method: props.client.token_endpoint_auth_method,
          jwks_uri: props.client.jwks_uri,
          subject_type: props.client.subject_type,
          grant_types: props.client.grant_types,
          tls_client_auth_subject_dn: props.client.tls_client_auth_subject_dn,
          kerberos_principal: props.client.kerberos_principal,
          kerberos_principal_pattern: props.client.kerberos_principal_pattern,
          kerberos_hbac_service: props.client.kerberos_hbac_service,
          spiffe_id: props.client.spiffe_id,
          id_token_signed_response_alg:
            props.client.id_token_signed_response_alg,
          workload_type: props.client.workload_type,
          allow_token_exchange_actor: props.client.allow_token_exchange_actor,
          skip_consent: props.client.skip_consent,
          localhost_only: props.client.localhost_only,
          allowed_token_exchange_audiences:
            props.client.allowed_token_exchange_audiences,
          allowed_registry_repositories:
            props.client.allowed_registry_repositories,
        },
      }).unwrap();

      dispatch(
        addAlert({
          name: "save-success",
          title: `Client '${props.client.client_id}' updated`,
          variant: "success",
        })
      );
      props.onRefresh();
    } catch {
      dispatch(
        addAlert({
          name: "save-error",
          title: "Failed to update client",
          variant: "danger",
        })
      );
    }
    setIsSaving(false);
  };

  // Toolbar buttons
  const toolbarFields: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <Button
          variant="secondary"
          data-cy="ahdapa-client-settings-button-refresh"
          onClick={props.onRefresh}
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
          data-cy="ahdapa-client-settings-button-revert"
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
          variant="primary"
          data-cy="ahdapa-client-settings-button-save"
          isDisabled={!isModified || isSaving}
          type="submit"
          form="ahdapa-client-settings-form"
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <TabLayout id="ahdapa-client-settings-page" toolbarItems={toolbarFields}>
      <Sidebar isPanelRight>
        <SidebarPanel variant="sticky">
          <JumpLinks
            isVertical
            label="Jump to section"
            scrollableSelector="#ahdapa-client-settings-page"
            expandable={{ default: "expandable", md: "nonExpandable" }}
            className="pf-v6-u-mt-md"
          >
            <JumpLinksItem key={0} href="#client-identity">
              Client identity
            </JumpLinksItem>
            <JumpLinksItem key={1} href="#oauth-settings">
              OAuth settings
            </JumpLinksItem>
            <JumpLinksItem key={2} href="#auth-settings">
              Authentication settings
            </JumpLinksItem>
            <JumpLinksItem key={3} href="#advanced-settings">
              Advanced settings
            </JumpLinksItem>
          </JumpLinks>
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Form
            className="pf-v6-u-mb-lg"
            id="ahdapa-client-settings-form"
            onSubmit={onSave}
          >
            {/* Client Identity */}
            <TitleLayout
              id="client-identity"
              text="Client identity"
              headingLevel="h2"
              className="pf-v6-u-mt-lg pf-v6-u-mb-md"
            />
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <FormGroup label="Client ID" fieldId="client_id">
                  <TextInput
                    id="client_id"
                    data-cy="ahdapa-client-settings-client-id"
                    value={props.client.client_id}
                    isDisabled
                    aria-label="Client ID"
                  />
                </FormGroup>
                <FormGroup label="Client Name" fieldId="client_name" isRequired>
                  <TextInput
                    id="client_name"
                    data-cy="ahdapa-client-settings-client-name"
                    value={props.client.client_name}
                    onChange={(_event, value) =>
                      updateField("client_name", value)
                    }
                    aria-label="Client Name"
                  />
                </FormGroup>
                <FormGroup label="Source" fieldId="source">
                  <TextInput
                    id="source"
                    data-cy="ahdapa-client-settings-source"
                    value={props.client.source}
                    isDisabled
                    aria-label="Source"
                  />
                </FormGroup>
              </FlexItem>
            </Flex>

            {/* OAuth Settings */}
            <TitleLayout
              id="oauth-settings"
              text="OAuth settings"
              headingLevel="h2"
              className="pf-v6-u-mt-lg pf-v6-u-mb-md"
            />
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <FormGroup label="Redirect URIs" fieldId="redirect_uris">
                  <TextInput
                    id="redirect_uris"
                    data-cy="ahdapa-client-settings-redirect-uris"
                    value={(props.client.redirect_uris || []).join(", ")}
                    onChange={(_event, value) =>
                      updateArrayField("redirect_uris", value)
                    }
                    aria-label="Redirect URIs"
                  />
                </FormGroup>
                <FormGroup label="Scopes" fieldId="scopes">
                  <TextInput
                    id="scopes"
                    data-cy="ahdapa-client-settings-scopes"
                    value={(props.client.scopes || []).join(", ")}
                    onChange={(_event, value) =>
                      updateArrayField("scopes", value)
                    }
                    aria-label="Scopes"
                  />
                </FormGroup>
                <FormGroup label="Grant Types" fieldId="grant_types">
                  <TextInput
                    id="grant_types"
                    data-cy="ahdapa-client-settings-grant-types"
                    value={(props.client.grant_types || []).join(", ")}
                    onChange={(_event, value) =>
                      updateArrayField("grant_types", value)
                    }
                    aria-label="Grant Types"
                  />
                </FormGroup>
              </FlexItem>
            </Flex>

            {/* Authentication Settings */}
            <TitleLayout
              id="auth-settings"
              text="Authentication settings"
              headingLevel="h2"
              className="pf-v6-u-mt-lg pf-v6-u-mb-md"
            />
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <FormGroup
                  label="Token Endpoint Auth Method"
                  fieldId="token_endpoint_auth_method"
                >
                  <FormSelect
                    id="token_endpoint_auth_method"
                    data-cy="ahdapa-client-settings-auth-method"
                    value={props.client.token_endpoint_auth_method}
                    onChange={(_event, value) =>
                      updateField(
                        "token_endpoint_auth_method",
                        value as AhdapaAuthMethod
                      )
                    }
                    aria-label="Token endpoint auth method"
                  >
                    {AUTH_METHODS.map((method) => (
                      <FormSelectOption
                        key={method}
                        value={method}
                        label={method}
                      />
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup label="JWKS URI" fieldId="jwks_uri">
                  <TextInput
                    id="jwks_uri"
                    data-cy="ahdapa-client-settings-jwks-uri"
                    value={props.client.jwks_uri || ""}
                    onChange={(_event, value) =>
                      updateField("jwks_uri", value || undefined)
                    }
                    aria-label="JWKS URI"
                  />
                </FormGroup>
                <FormGroup
                  label="Kerberos Principal"
                  fieldId="kerberos_principal"
                >
                  <TextInput
                    id="kerberos_principal"
                    data-cy="ahdapa-client-settings-kerberos-principal"
                    value={props.client.kerberos_principal || ""}
                    onChange={(_event, value) =>
                      updateField("kerberos_principal", value || undefined)
                    }
                    aria-label="Kerberos Principal"
                  />
                </FormGroup>
                <FormGroup
                  label="Kerberos Principal Pattern"
                  fieldId="kerberos_principal_pattern"
                >
                  <TextInput
                    id="kerberos_principal_pattern"
                    data-cy="ahdapa-client-settings-kerberos-principal-pattern"
                    value={props.client.kerberos_principal_pattern || ""}
                    onChange={(_event, value) =>
                      updateField(
                        "kerberos_principal_pattern",
                        value || undefined
                      )
                    }
                    aria-label="Kerberos Principal Pattern"
                  />
                </FormGroup>
                <FormGroup
                  label="Kerberos HBAC Service"
                  fieldId="kerberos_hbac_service"
                >
                  <TextInput
                    id="kerberos_hbac_service"
                    data-cy="ahdapa-client-settings-kerberos-hbac-service"
                    value={props.client.kerberos_hbac_service || ""}
                    onChange={(_event, value) =>
                      updateField("kerberos_hbac_service", value || undefined)
                    }
                    aria-label="Kerberos HBAC Service"
                  />
                </FormGroup>
              </FlexItem>
            </Flex>

            {/* Advanced Settings */}
            <TitleLayout
              id="advanced-settings"
              text="Advanced settings"
              headingLevel="h2"
              className="pf-v6-u-mt-lg pf-v6-u-mb-md"
            />
            <Flex direction={{ default: "column", lg: "row" }}>
              <FlexItem flex={{ default: "flex_1" }}>
                <FormGroup label="Subject Type" fieldId="subject_type">
                  <TextInput
                    id="subject_type"
                    data-cy="ahdapa-client-settings-subject-type"
                    value={props.client.subject_type || ""}
                    onChange={(_event, value) =>
                      updateField("subject_type", value || undefined)
                    }
                    aria-label="Subject Type"
                  />
                </FormGroup>
                <FormGroup
                  label="ID Token Signed Response Algorithm"
                  fieldId="id_token_signed_response_alg"
                >
                  <TextInput
                    id="id_token_signed_response_alg"
                    data-cy="ahdapa-client-settings-id-token-alg"
                    value={props.client.id_token_signed_response_alg || ""}
                    onChange={(_event, value) =>
                      updateField(
                        "id_token_signed_response_alg",
                        (value as AhdapaClient["id_token_signed_response_alg"]) ||
                          undefined
                      )
                    }
                    aria-label="ID Token Algorithm"
                  />
                </FormGroup>
                <FormGroup label="SPIFFE ID" fieldId="spiffe_id">
                  <TextInput
                    id="spiffe_id"
                    data-cy="ahdapa-client-settings-spiffe-id"
                    value={props.client.spiffe_id || ""}
                    onChange={(_event, value) =>
                      updateField("spiffe_id", value || undefined)
                    }
                    aria-label="SPIFFE ID"
                  />
                </FormGroup>
                <FormGroup label="Workload Type" fieldId="workload_type">
                  <TextInput
                    id="workload_type"
                    data-cy="ahdapa-client-settings-workload-type"
                    value={props.client.workload_type || ""}
                    onChange={(_event, value) =>
                      updateField("workload_type", value || undefined)
                    }
                    aria-label="Workload Type"
                  />
                </FormGroup>
                <FormGroup fieldId="skip_consent">
                  <Checkbox
                    id="skip_consent"
                    data-cy="ahdapa-client-settings-skip-consent"
                    label="Skip consent"
                    isChecked={props.client.skip_consent || false}
                    onChange={(_event, checked) =>
                      updateField("skip_consent", checked)
                    }
                  />
                </FormGroup>
                <FormGroup fieldId="localhost_only">
                  <Checkbox
                    id="localhost_only"
                    data-cy="ahdapa-client-settings-localhost-only"
                    label="Localhost only"
                    isChecked={props.client.localhost_only || false}
                    onChange={(_event, checked) =>
                      updateField("localhost_only", checked)
                    }
                  />
                </FormGroup>
                <FormGroup fieldId="allow_token_exchange_actor">
                  <Checkbox
                    id="allow_token_exchange_actor"
                    data-cy="ahdapa-client-settings-allow-exchange"
                    label="Allow token exchange actor"
                    isChecked={props.client.allow_token_exchange_actor || false}
                    onChange={(_event, checked) =>
                      updateField("allow_token_exchange_actor", checked)
                    }
                  />
                </FormGroup>
                <FormGroup
                  label="Allowed Token Exchange Audiences"
                  fieldId="allowed_token_exchange_audiences"
                >
                  <TextInput
                    id="allowed_token_exchange_audiences"
                    data-cy="ahdapa-client-settings-exchange-audiences"
                    value={(
                      props.client.allowed_token_exchange_audiences || []
                    ).join(", ")}
                    onChange={(_event, value) =>
                      updateArrayField(
                        "allowed_token_exchange_audiences",
                        value
                      )
                    }
                    aria-label="Allowed token exchange audiences"
                  />
                </FormGroup>
              </FlexItem>
            </Flex>
          </Form>
        </SidebarContent>
      </Sidebar>
    </TabLayout>
  );
};

export default AhdapaClientsSettings;
