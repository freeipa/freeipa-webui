import React from "react";
import {
  ColaLayout,
  ComponentFactory,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  Graph,
  GraphComponent,
  graphDropTargetSpec,
  isEdge,
  isNode,
  Layout,
  LayoutFactory,
  ModelKind,
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
} from "@patternfly/react-topology";
import { ServerIcon } from "@patternfly/react-icons";

// Types
interface CustomNodeProps {
  element: GraphElement;
}

interface SuffixEdgeClass {
  ca: string;
  domain: string;
}

interface TopologyVisualizationProps {
  nodes: NodeModel[];
  edges: EdgeModel[];
}

// Constants
const CONNECTOR_TARGET_DROP = "connector-target-drop";

const SUFFIX_EDGE_CLASS: SuffixEdgeClass = {
  ca: "topology-ca-blue-edge",
  domain: "topology-domain-orange-edge",
};

// Layout factory
const createLayoutFactory = (): LayoutFactory => {
  return (type: string, graph: Graph): Layout => {
    switch (type) {
      case "Cola":
        return new ColaLayout(graph);
      default:
        return new ColaLayout(graph, { layoutOnDrag: false });
    }
  };
};

// Custom node component
const CustomStyledNode = ({ element }: CustomNodeProps) => {
  if (!isNode(element)) return null;
  return (
    <DefaultNode element={element} className="topology-node-server">
      <g transform={`translate(23, 23)`}>
        <ServerIcon width={25} height={25} />
      </g>
    </DefaultNode>
  );
};

// Custom edge component
const CustomStyledEdge = (props: { element: GraphElement }) => {
  if (!isEdge(props.element)) return null;
  const data = props.element.getData();
  const suffixClassName = SUFFIX_EDGE_CLASS[data?.suffixType] || "";
  return <DefaultEdge {...props} className={suffixClassName} />;
};

// Component factory
const createComponentFactory = (): ComponentFactory => {
  return (kind: ModelKind, type: string) => {
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
            throw Error(`Unexpected ModelKind ${kind satisfies never}.`);
        }
    }
  };
};

/**
 * Component for rendering PatternFly Topology visualization
 * Encapsulates controller initialization, factories, and event handling
 */
const TopologyVisualization = ({
  nodes,
  edges,
}: TopologyVisualizationProps) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const controller = React.useMemo(() => {
    const newController = new Visualization();
    newController.registerLayoutFactory(createLayoutFactory());
    newController.registerComponentFactory(createComponentFactory());
    newController.addEventListener(SELECTION_EVENT, setSelectedIds);
    newController.fromModel(
      {
        nodes,
        edges,
        graph: { id: "model-graph", type: "graph", layout: "Cola" },
      },
      false
    );
    return newController;
  }, [nodes, edges, setSelectedIds]);

  return (
    <VisualizationProvider controller={controller}>
      <VisualizationSurface state={{ selectedIds }} />
    </VisualizationProvider>
  );
};

export default TopologyVisualization;
