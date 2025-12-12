import React from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
// Redux
import { useAppDispatch } from "src/store/hooks";
// Hooks
import { useCertMapConfigData } from "src/hooks/useCertMapConfigData";
import { addAlert } from "src/store/Global/alerts-slice";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import {
  CertMapConfigPayload,
  useCertMapConfigModMutation,
} from "src/services/rpcCertMapping";
// Utils
import { certMapConfigAsRecord } from "src/utils/certMappingUtils";
// Icons
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
// Components
import { NotFound } from "src/components/errors/PageErrors";
import DataSpinner from "src/components/layouts/DataSpinner";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import PageWithGrayBorderLayout from "src/components/layouts/PageWithGrayBorderLayout";
import IpaCheckbox from "src/components/Form/IpaCheckbox";

const CertificateMappingGlobalConfig = () => {
  const dispatch = useAppDispatch();

  // API calls
  const certMapConfigData = useCertMapConfigData();
  const [saveConfigInfo] = useCertMapConfigModMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  const { browserTitle } = useUpdateRoute({
    pathname: "cert-id-mapping-global-config",
  });

  // Set the page title to be shown in the browser tab
  React.useEffect(() => {
    document.title = browserTitle;
  }, [browserTitle]);

  // States
  const [isDataLoading, setIsDataLoading] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = certMapConfigAsRecord(
    certMapConfigData.certMapConfig,
    certMapConfigData.setCertMapConfig
  );

  // 'Revert' handler method
  const onRevert = () => {
    certMapConfigData.setCertMapConfig(certMapConfigData.originalCertMapConfig);
    certMapConfigData.refetch();
    dispatch(
      addAlert({
        name: "revert-success",
        title: "Certificate mapping configuration data reverted",
        variant: "success",
      })
    );
  };

  // on Save handler method
  const onSave = () => {
    setIsDataLoading(true);
    const modifiedValues = certMapConfigData.modifiedValues();

    const payload: CertMapConfigPayload = {
      ipacertmappromptusername:
        modifiedValues.ipacertmappromptusername as boolean,
    };

    saveConfigInfo(payload).then((response) => {
      if ("data" in response) {
        const data = response.data;
        if (data?.error) {
          dispatch(
            addAlert({
              name: "error",
              title: (data.error as Error).message,
              variant: "danger",
            })
          );
        }
        if (data?.result) {
          certMapConfigData.setCertMapConfig(data.result.result);
          dispatch(
            addAlert({
              name: "success",
              title: "Certificate mapping configuration updated",
              variant: "success",
            })
          );
          // Reset values. Disable 'revert' and 'save' buttons
          certMapConfigData.resetValues();
        }
      }
      setIsDataLoading(false);
    });
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="certificate-mapping-global-config-button-refresh"
          onClickHandler={certMapConfigData.refetch}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          dataCy="certificate-mapping-global-config-button-revert"
          isDisabled={!certMapConfigData.modified || isDataLoading}
          onClickHandler={onRevert}
        >
          Revert
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          dataCy="certificate-mapping-global-config-button-save"
          isDisabled={!certMapConfigData.modified || isDataLoading}
          onClickHandler={onSave}
        >
          Save
        </SecondaryButton>
      ),
    },
  ];

  // Handling of the API data
  if (
    certMapConfigData.isLoading ||
    !certMapConfigData.certMapConfig ||
    !certMapConfigData.metadata
  ) {
    return <DataSpinner />;
  }

  // Show the 'NotFound' page if the host is not found
  if (
    !certMapConfigData.isLoading &&
    Object.keys(certMapConfigData.certMapConfig).length === 0
  ) {
    return <NotFound />;
  }

  // Return component
  return (
    <PageWithGrayBorderLayout
      id="certificate-id-mapping-global-config-page"
      pageTitle="Certificate Identity Mapping Global Configuration"
      toolbarItems={toolbarFields}
    >
      <Sidebar isPanelRight className="pf-v6-u-mb-0">
        <SidebarPanel variant="sticky">
          <HelpTextWithIconLayout
            textContent="Help"
            icon={
              <OutlinedQuestionCircleIcon className="pf-v6-u-primary-color-100 pf-v6-u-mr-sm" />
            }
          />
        </SidebarPanel>
        <SidebarContent className="pf-v6-u-mr-xl">
          <Flex direction={{ default: "column", lg: "row" }}>
            <FlexItem flex={{ default: "flex_1" }}>
              <Form className="pf-v6-u-mb-lg">
                <FormGroup fieldId="ipacertmappromptusername" role="group">
                  <IpaCheckbox
                    dataCy="certificate-mapping-global-config-checkbox-ipacertmappromptusername"
                    name="ipacertmappromptusername"
                    value={String(
                      certMapConfigData.certMapConfig.ipacertmappromptusername
                    )}
                    text="Prompt for the username"
                    ipaObject={ipaObject}
                    onChange={recordOnChange}
                    objectName="certmapconfig"
                    metadata={certMapConfigData.metadata}
                  />
                </FormGroup>
              </Form>
            </FlexItem>
          </Flex>
        </SidebarContent>
      </Sidebar>
    </PageWithGrayBorderLayout>
  );
};

export default CertificateMappingGlobalConfig;
