import React from "react";
// PatternFly
import {
  Button,
  Checkbox,
  List,
  ListComponent,
  ListItem,
  MenuToggle,
  MenuToggleElement,
  OrderType,
  Select,
  SelectOption,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Modals
import ModalWithFormLayout, { Field } from "../layouts/ModalWithFormLayout";
// RTK
import { ErrorResult } from "src/services/rpc";
import {
  CertRequestPayload,
  useAddCertRequestMutation,
  useGetCertProfileQuery,
  useGetCertificateAuthorityQuery,
} from "src/services/rpcCerts";
// Data types
import {
  CertProfile,
  CertificateAuthority,
} from "src/utils/datatypes/globalDataTypes";
// Components
import PopoverWithIconLayout from "../layouts/PopoverWithIconLayout";

interface PropsToIssueNewCertificate {
  isOpen: boolean;
  onClose: () => void;
  id: string | undefined;
  showPrincipalFields: boolean | false;
  onRefresh: () => void;
  principal: string | undefined;
}

const IssueNewCertificate = (props: PropsToIssueNewCertificate) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // RPC hooks
  const [addCertRequest] = useAddCertRequestMutation();
  const certAuthQuery = useGetCertificateAuthorityQuery();
  const certProfileQuery = useGetCertProfileQuery();

  // Certificate Authority
  const [certAuthList, setCertAuthList] = React.useState<
    CertificateAuthority[]
  >([]);
  const isCertAuthLoading = certAuthQuery.isLoading;

  React.useEffect(() => {
    if (!isCertAuthLoading && certAuthQuery.data !== undefined) {
      setCertAuthList(certAuthQuery.data as CertificateAuthority[]);
      setSelectedCA(certAuthQuery.data[0].cn[0]);
    }
  }, [isCertAuthLoading]);

  // Certificate Profile
  const [certProfileList, setCertProfileList] = React.useState<CertProfile[]>(
    []
  );
  const isCertProfileLoading = certProfileQuery.isLoading;

  React.useEffect(() => {
    if (!isCertProfileLoading && certProfileQuery.data !== undefined) {
      setCertProfileList(certProfileQuery.data as CertProfile[]);
    }
  }, [isCertProfileLoading]);

  // 'Principal' and 'Add principal' fields
  // - These will be inferred depending on where the modal is shown from ('Settings' or 'Certificates' pages)
  const [principal, setPrincipal] = React.useState("");
  const [isAddPrincipalChecked, setIsAddPrincipalChecked] =
    React.useState(false);

  const addPrincipalTooltipMessage = () => (
    <div>
      Automatically add the principal if does not exist (service principals
      only)
    </div>
  );

  // 'CA' field - Selector
  const [selectedCA, setSelectedCA] = React.useState(
    certAuthList[0]?.cn[0] || ""
  );
  const [isCAOpen, setIsCAOpen] = React.useState(false);
  const onCASelect = (_event, selection) => {
    if (Array.isArray(selection)) {
      setSelectedCA(selection[0]);
    } else {
      setSelectedCA(selection);
    }

    setIsCAOpen(false);
  };

  const onCAToggle = () => {
    setIsCAOpen(!isCAOpen);
  };

  const toggleCA = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle ref={toggleRef} onClick={onCAToggle} className="pf-v5-u-w-100">
      {selectedCA}
    </MenuToggle>
  );

  // 'Profile ID' field - Selector
  const [selectedProfile, setSelectedProfile] = React.useState("");
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const onProfileSelect = (_event, selection) => {
    if (Array.isArray(selection)) {
      setSelectedProfile(selection[0]);
    } else {
      setSelectedProfile(selection);
    }
    setIsProfileOpen(false);
  };

  const onProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleProfile = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onProfileToggle}
      className="pf-v5-u-w-100"
    >
      {selectedProfile}
    </MenuToggle>
  );

  // Certificate - Text area
  const [certificate, setCertificate] = React.useState("");

  // Manage 'Principal' and 'Add principal' fields
  const principalField = {
    id: "principal",
    name: "Principal",
    pfComponent: (
      <TextInput
        id="principal"
        name="principal"
        type="text"
        value={principal}
        onChange={(_event, value) => setPrincipal(value)}
      />
    ),
  };

  const addPrincipalField = {
    id: "add-principal",
    name: "Add principal",
    labelIcon: <PopoverWithIconLayout message={addPrincipalTooltipMessage} />,
    pfComponent: (
      <Checkbox
        label="Add principal"
        id="add-principal"
        name="add-principal"
        isChecked={isAddPrincipalChecked}
        onChange={(_event, checked) => setIsAddPrincipalChecked(checked)}
      />
    ),
  };

  React.useEffect(() => {
    if (props.showPrincipalFields) {
      fields.unshift(addPrincipalField);
      fields.unshift(principalField);
    }
  }, [props.showPrincipalFields]);

  // Add certificate
  const onAddCertificate = () => {
    const payload = {
      csr: certificate,
      cacn: selectedCA,
      principal: props.principal,
      profile_id: selectedProfile,
    } as CertRequestPayload;

    addCertRequest(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Close modal
          resetFieldsAndClose();
          // Set alert: success
          alerts.addAlert(
            "add-certificate-success",
            "Added certificate to '" + props.id + "'",
            "success"
          );
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert(
            "add-certificate-error",
            errorMessage.message,
            "danger"
          );
        }
        // Refresh data to show new changes in the UI
        props.onRefresh();
      }
    });
  };

  // Fields
  const fields: Field[] = [
    {
      id: "certificate-authority-selector",
      name: "CA",
      fieldRequired: true,
      pfComponent: (
        <Select
          id={"ca-selector"}
          aria-label={"Selector for certificate authority"}
          toggle={toggleCA}
          onSelect={onCASelect}
          selected={selectedCA}
          isOpen={isCAOpen}
        >
          {certAuthList.map((option, index) => {
            return (
              <SelectOption key={index} value={option.cn}>
                {option.cn}
              </SelectOption>
            );
          })}
        </Select>
      ),
    },
    {
      id: "profile-selector",
      name: "Profile ID",
      pfComponent: (
        <Select
          id={"profile-selector"}
          aria-label={"Selector for profile ID"}
          toggle={toggleProfile}
          onSelect={onProfileSelect}
          selected={selectedProfile}
          isOpen={isProfileOpen}
        >
          {certProfileList.map((option, index) => {
            return (
              <SelectOption key={index} value={option.cn}>
                {option.cn}
              </SelectOption>
            );
          })}
        </Select>
      ),
    },
    {
      id: "how-to-issue-certificate",
      pfComponent: (
        <List
          component={ListComponent.ol}
          type={OrderType.number}
          className="pf-v5-u-font-size-md"
        >
          <ListItem>
            Create a certificate database or use an existing one. To create a
            new database:
            <br />
            <code># certutil -N -d &lt;database path&gt;</code>
          </ListItem>
          <ListItem>
            Create a CSR with subject{" "}
            <i>CN=&lt;common name&gt;,O=&lt;realm&gt;</i>, for example: <br />
            <code>
              # certutil -R -d &lt;database path&gt; -a -g &lt;key size&gt; -s
              &apos;CN=&lt;common name&gt;,O=IPA.DEMO&apos;
            </code>
          </ListItem>
          <ListItem>
            Copy and paste the CSR (from &quot;
            <i>
              <b>-----BEGIN NEW CERTIFICATE REQUEST-----</b>
            </i>
            &quot;{" to "}
            &quot;
            <i>
              <b>-----END NEW CERTIFICATE REQUEST-----</b>
            </i>
            &quot;) into the text area below:
          </ListItem>
        </List>
      ),
    },
    {
      id: "certificate-textarea-field",
      pfComponent: (
        <TextArea
          id="certificate-textarea"
          name="csr"
          aria-label="Text area for certificate"
          value={certificate}
          onChange={(_event, value) => setCertificate(value)}
          style={{ height: "250px" }}
          className="pf-u-mb-lg"
          autoFocus
        />
      ),
      fieldRequired: true,
    },
  ];

  // Reset fields and close modal
  const resetFieldsAndClose = () => {
    // Reset fields
    setPrincipal("");
    setIsAddPrincipalChecked(false);
    setSelectedCA(certAuthList[0]?.cn[0] || "");
    setSelectedProfile("");
    setCertificate("");
    // Close modal
    props.onClose();
  };

  // Actions
  const actions = [
    <Button
      key={"issue-new-certificate"}
      variant="primary"
      onClick={onAddCertificate}
      isDisabled={certificate === ""}
    >
      Issue
    </Button>,
    <Button
      key={"cancel-issue-new-certificate"}
      variant="link"
      onClick={resetFieldsAndClose}
    >
      Cancel
    </Button>,
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="medium"
        modalPosition="top"
        title={"Issue new certificate for '" + props.id + "'"}
        formId="issue-new-certificate-form"
        fields={fields}
        show={props.isOpen}
        onClose={resetFieldsAndClose}
        actions={actions}
      />
    </>
  );
};

export default IssueNewCertificate;
