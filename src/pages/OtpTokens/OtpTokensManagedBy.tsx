import React, { useMemo } from "react";
// PatternFly
import { Badge, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
// Data types
import { OtpToken } from "src/utils/datatypes/globalDataTypes";
// Layouts
import TabLayout from "src/components/layouts/TabLayout";
// Navigation
import { useNavigate } from "react-router";
// Hooks
import useUpdateRoute from "src/hooks/useUpdateRoute";
// RPC
import { useGetOtpTokenQuery } from "src/services/rpcOtpTokens";
// Utils
import { apiToOtpToken } from "src/utils/otpTokensUtils";
// Components
import ManagedByUsers from "src/components/ManagedBy/ManagedByUsers";

interface PropsToOtpTokensManagedBy {
  otpToken: OtpToken;
  tabSection: string;
}

const OtpTokensManagedBy = (props: PropsToOtpTokensManagedBy) => {
  const navigate = useNavigate();

  const otpTokenQuery = useGetOtpTokenQuery(props.otpToken.ipatokenuniqueid);
  const otpTokenData = otpTokenQuery.data;

  const otpToken = useMemo<Partial<OtpToken>>(() => {
    if (!otpTokenQuery.isFetching && otpTokenData?.result?.result) {
      return apiToOtpToken(otpTokenData.result.result);
    }
    return {};
  }, [otpTokenData, otpTokenQuery.isFetching]);

  const onRefreshData = () => {
    otpTokenQuery.refetch();
  };

  useUpdateRoute({ pathname: "otp-tokens", noBreadcrumb: true });

  const userCount = otpToken.managedby_user
    ? otpToken.managedby_user.length
    : 0;

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    navigate("/otp-tokens/" + props.otpToken.ipatokenuniqueid + "/" + tabIndex);
  };

  return (
    <div style={{ height: `var(--memberof-calc)` }}>
      <TabLayout id="managedby">
        <Tabs
          activeKey={props.tabSection}
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          unmountOnExit
        >
          <Tab
            eventKey={"managedby_user"}
            name="managedby_user"
            title={
              <TabTitleText>
                Users{" "}
                <Badge key={0} isRead>
                  {userCount}
                </Badge>
              </TabTitleText>
            }
          >
            <ManagedByUsers
              entity={otpToken}
              id={otpToken.ipatokenuniqueid as string}
              from="otp-tokens"
              isDataLoading={otpTokenQuery.isFetching}
              onRefreshData={onRefreshData}
            />
          </Tab>
        </Tabs>
      </TabLayout>
    </div>
  );
};

export default OtpTokensManagedBy;
