import React from "react";
import {
  Page,
  PageSection,
  Title,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { ExtensionSlot } from "src/core/plugins/ExtensionSlot";
import { dashboardContent } from "src/core/plugins/extensionPoints";

/**
 * Dashboard page component that displays the main dashboard
 * and includes the dashboardContent extension point
 */
const Dashboard = () => {
  return (
    <Page>
      <PageSection variant="light">
        <Title headingLevel="h1" size="2xl">
          Dashboard
        </Title>
      </PageSection>

      <PageSection>
        <Grid hasGutter>
          <GridItem span={12}>
            {/* Core dashboard content */}
            <div className="pf-v5-c-card">
              <div className="pf-v5-c-card__title">System Status</div>
              <div className="pf-v5-c-card__body">
                <p>FreeIPA system is up and running.</p>
              </div>
            </div>
          </GridItem>

          {/* Extension point for dashboard content from plugins */}
          <GridItem span={12}>
            <ExtensionSlot extensionPointId={dashboardContent} />
          </GridItem>
        </Grid>
      </PageSection>
    </Page>
  );
};

export default Dashboard;
