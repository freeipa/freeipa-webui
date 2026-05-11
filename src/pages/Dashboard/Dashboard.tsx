import React from "react";
import {
  PageSection,
  Content,
  ContentVariants,
  Gallery,
  GalleryItem,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Icon,
} from "@patternfly/react-core";
import { ServerIcon } from "@patternfly/react-icons";
import { ExtensionSlot, EXTENSION_POINTS } from "@freeipa/plugin-sdk";

const Dashboard: React.FC = () => {
  return (
    <PageSection>
      <Content component={ContentVariants.h1}>Dashboard</Content>
      <Gallery hasGutter>
        <GalleryItem>
          <Card isCompact>
            <CardHeader>
              <CardTitle>
                <Icon isInline>
                  <ServerIcon />
                </Icon>{" "}
                System Status
              </CardTitle>
            </CardHeader>
            <CardBody>
              FreeIPA server is running. Use the navigation to manage identity,
              policy, and authentication.
            </CardBody>
          </Card>
        </GalleryItem>
        <ExtensionSlot
          extensionPointId={EXTENSION_POINTS.DASHBOARD_CONTENT}
        />
      </Gallery>
    </PageSection>
  );
};

export default Dashboard;
