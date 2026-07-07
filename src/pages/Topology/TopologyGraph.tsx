import React from "react";
// PatternFly
import { PageSection } from "@patternfly/react-core";
import {
  EdgeStyle,
  NodeShape,
  NodeModel,
  EdgeModel,
  NodeStatus,
} from "@patternfly/react-topology";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import DataSpinner from "src/components/layouts/DataSpinner";
import TopologyVisualization from "src/components/TopologyVisualization/TopologyVisualization";
// Hooks
import { useTopologyGraph } from "src/hooks/useTopologyGraph";
import useUpdateRoute from "src/hooks/useUpdateRoute";

// Constants
const NODE_SHAPE = NodeShape.ellipse;
const NODE_DIAMETER = 70;

// Main component
const TopologyGraph = () => {
  const { isLoading, refetch, servers, topologySegments } = useTopologyGraph();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "topology-graph" });

  // Transform server data to node models
  const nodes: NodeModel[] = React.useMemo(
    () =>
      servers.map((server) => ({
        id: `node-${server.cn}`,
        type: "node",
        label: server.cn,
        status: NodeStatus.info,
        width: NODE_DIAMETER,
        height: NODE_DIAMETER,
        shape: NODE_SHAPE,
        data: { badge: "Server" },
      })),
    [servers]
  );

  // Transform topology segments to edge models
  const edges: EdgeModel[] = React.useMemo(
    () =>
      topologySegments.map((segment) => ({
        id: `edge-${segment.iparepltoposegmentleftnode}-${segment.iparepltoposegmentrightnode}`,
        type: "edge",
        source: `node-${segment.iparepltoposegmentleftnode}`,
        target: `node-${segment.iparepltoposegmentrightnode}`,
        edgeStyle: EdgeStyle.default,
        data: { suffixType: segment.suffixType },
      })),
    [topologySegments]
  );

  // Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="topology-graph-button-refresh"
          onClickHandler={refetch}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          dataCy="topology-graph-button-add"
          onClickHandler={() => {}}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          dataCy="topology-graph-button-delete"
          onClickHandler={() => {}}
        >
          Delete
        </SecondaryButton>
      ),
    },
  ];

  // Spinner on loading state
  if (isLoading) {
    return <DataSpinner />;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="topology-graph-page"
          headingLevel="h1"
          text="Topology Graph"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled={true}>
        <ToolbarLayout toolbarItems={toolbarItems} />
        <TopologyVisualization nodes={nodes} edges={edges} />
      </PageSection>
    </>
  );
};

export default TopologyGraph;
