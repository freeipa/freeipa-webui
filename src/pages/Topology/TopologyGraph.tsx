import React from "react";
// PatternFly
import { PageSection } from "@patternfly/react-core";
import {
  ColaLayout,
  ComponentFactory,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  Graph,
  GraphComponent,
  graphDropTargetSpec,
  Layout,
  LayoutFactory,
  ModelKind,
  NodeShape,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withPanZoom,
  withDndDrop,
  withDragNode,
  withTargetDrag,
  Edge,
  GraphElement,
  DragObjectWithType,
  Node as TopologyNode,
  NodeModel,
  EdgeModel,
  NodeStatus,
} from "@patternfly/react-topology";
// Icons
import { ServerIcon } from "@patternfly/react-icons";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";
import ToolbarLayout, {
  ToolbarItem,
} from "src/components/layouts/ToolbarLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import { useTopologyGraph } from "src/hooks/useTopologyGraph";
import DataSpinner from "src/components/layouts/DataSpinner";

interface CustomNodeProps {
  element: GraphElement;
}

interface SuffixEdgeClass {
  ca: string;
  domain: string;
}

// Constants
const CONNECTOR_TARGET_DROP = "connector-target-drop";

const SUFFIX_EDGE_CLASS: SuffixEdgeClass = {
  ca: "topology-ca-blue-edge",
  domain: "topology-domain-orange-edge",
};

const NODE_SHAPE = NodeShape.ellipse;
const NODE_DIAMETER = 70;

// Layout factory
const baselineLayoutFactory: LayoutFactory = (
  type: string,
  graph: Graph
): Layout | undefined => {
  switch (type) {
    case "Cola":
      return new ColaLayout(graph);
    default:
      return new ColaLayout(graph, { layoutOnDrag: false });
  }
};

// Custom node
const CustomStyledNode = ({ element }: CustomNodeProps) => {
  return (
    <DefaultNode
      element={element as TopologyNode}
      className="topology-node-server"
    >
      <g transform={`translate(23, 23)`}>
        <ServerIcon width={25} height={25} />
      </g>
    </DefaultNode>
  );
};

// Custom edge
const CustomStyledEdge = (props: { element: GraphElement }) => {
  const edge = props.element as Edge;
  const data = edge.getData();
  const suffixClassName = SUFFIX_EDGE_CLASS[data?.suffixType] || "";
  return <DefaultEdge {...props} className={suffixClassName} />;
};

// Component factory
const customComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string
) => {
  switch (type) {
    case "group":
      return DefaultGroup;
    default:
      switch (kind) {
        case ModelKind.graph:
          return withDndDrop(graphDropTargetSpec())(
            withPanZoom()(GraphComponent)
          );
        case ModelKind.node:
          return withDndDrop(nodeDropTargetSpec())(
            withDragNode(nodeDragSourceSpec("node", true, true))(
              CustomStyledNode
            )
          );
        case ModelKind.edge:
          return withTargetDrag<
            DragObjectWithType,
            Node,
            { dragging?: boolean },
            {
              element: GraphElement;
            }
          >({
            item: { type: CONNECTOR_TARGET_DROP },
            begin: (_monitor, props) => {
              props.element.raise();
              return props.element;
            },
            drag: (event, _monitor, props) => {
              (props.element as Edge).setEndPoint(event.x, event.y);
            },
            end: (dropResult, monitor, props) => {
              if (monitor.didDrop() && dropResult && props) {
                (props.element as Edge).setTarget(
                  dropResult as unknown as TopologyNode<NodeModel>
                );
              }
              (props.element as Edge).setEndPoint();
            },
            collect: (monitor) => ({
              dragging: monitor.isDragging(),
            }),
          })(CustomStyledEdge);
        default:
          return undefined;
      }
  }
};

// Main component
const TopologyGraph = () => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const { isLoading, refetch, servers, topologySegments } = useTopologyGraph();

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
        data: { badge: "Server" }, // More parameters can be added here
      })),
    [servers]
  );

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

  const controllerRef = React.useRef<Visualization | null>(null);
  if (!controllerRef.current) {
    const newController = new Visualization();
    newController.registerLayoutFactory(baselineLayoutFactory);
    newController.registerComponentFactory(customComponentFactory);
    newController.fromModel(
      {
        nodes: [],
        edges: [],
        graph: { id: "model-graph", type: "graph", layout: "Cola" },
      },
      false
    );
    controllerRef.current = newController;
  }
  const controller = controllerRef.current;

  React.useEffect(() => {
    controller.addEventListener(SELECTION_EVENT, setSelectedIds);
    return () => {
      controller.removeEventListener(SELECTION_EVENT, setSelectedIds);
    };
  }, [controller]);

  React.useEffect(() => {
    controller.fromModel(
      {
        nodes,
        edges,
        graph: { id: "model-graph", type: "graph", layout: "Cola" },
      },
      true
    );
  }, [nodes, edges, controller]);

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
        <TitleLayout id="ID ranges page" headingLevel="h1" text="ID ranges" />
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled={true}>
        <ToolbarLayout toolbarItems={toolbarItems} />
        <VisualizationProvider controller={controller}>
          <VisualizationSurface state={{ selectedIds }} />
        </VisualizationProvider>
      </PageSection>
    </>
  );
};

export default TopologyGraph;
