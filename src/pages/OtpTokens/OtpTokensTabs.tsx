import React from "react";
// PatternFly
import { PageSection, Tabs, Tab, TabTitleText } from "@patternfly/react-core";
// React Router DOM
import { useNavigate } from "react-router";
// Navigation
import { URL_PREFIX } from "src/navigation/NavRoutes";
import { NotFound } from "src/components/errors/PageErrors";
// Hooks
import { useOtpTokensSettingsData } from "src/hooks/useOtpTokensSettingsData";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import DataSpinner from "src/components/layouts/DataSpinner";
import BreadCrumb, {
  BreadCrumbItem,
} from "src/components/layouts/BreadCrumb/BreadCrumb";
import { IpatokenuniqueidParams, useSafeParams } from "src/utils/paramsUtils";
import OtpTokensSettings from "./OtpTokensSettings";

const OtpTokensTabs = ({ section }: { section: string }) => {
  const { ipatokenuniqueid } = useSafeParams<IpatokenuniqueidParams>([
    "ipatokenuniqueid",
  ]);
  const navigate = useNavigate();
  const pathname = "otp-tokens";

  // Data loaded from the API
  const otpTokensSettingsData = useOtpTokensSettingsData(ipatokenuniqueid);

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    if (tabIndex === "settings") {
      navigate("/" + pathname + "/" + ipatokenuniqueid);
    }
  };

  const breadcrumbItems: BreadCrumbItem[] = [
    {
      name: "Otp tokens",
      url: URL_PREFIX + "/" + pathname,
    },
    {
      name: ipatokenuniqueid,
      url: URL_PREFIX + "/" + pathname + "/" + ipatokenuniqueid,
      isActive: true,
    },
  ];

  if (otpTokensSettingsData.isLoading || !otpTokensSettingsData.otpToken) {
    return <DataSpinner />;
  }

  if (
    !otpTokensSettingsData.isLoading &&
    Object.keys(otpTokensSettingsData.otpToken).length === 0
  ) {
    return <NotFound />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <BreadCrumb breadcrumbItems={breadcrumbItems} />
        <TitleLayout
          id={ipatokenuniqueid}
          preText="OTP token:"
          text={ipatokenuniqueid}
          headingLevel="h1"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs" isFilled>
        <Tabs
          activeKey={section}
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
            data-cy="otp-tokens-tab-settings"
          >
            <OtpTokensSettings
              otpToken={otpTokensSettingsData.otpToken}
              originalOtpToken={otpTokensSettingsData.originalOtpToken}
              users={otpTokensSettingsData.users}
              metadata={otpTokensSettingsData.metadata}
              onOtpTokenChange={otpTokensSettingsData.setOtpToken}
              onRefresh={otpTokensSettingsData.refetch}
              isDataLoading={otpTokensSettingsData.isLoading}
              isModified={otpTokensSettingsData.modified}
              modifiedValues={otpTokensSettingsData.modifiedValues}
              onResetValues={otpTokensSettingsData.resetValues}
              pathname={pathname}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
export default OtpTokensTabs;
