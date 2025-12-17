import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Button,
  Title,
} from "@patternfly/react-core";

/**
 * A greeting component built using PatternFly 6 components
 */
const GreetingPatternfly = () => {
  return (
    <Card isCompact style={{ margin: "1rem 0" }}>
      <CardTitle>
        <Title headingLevel="h2" size="xl">
          <span style={{ color: "#06c" }}>
            ✨ Hello World Plugin (PatternFly 6) ✨
          </span>
        </Title>
      </CardTitle>
      <CardBody>
        <p style={{ fontStyle: "italic", color: "#484", margin: "0 0 1rem 0" }}>
          This content is provided by the Hello World plugin using PatternFly 6
          components!
        </p>
        <p style={{ color: "#06c", padding: "0.5rem 0", margin: "0" }}>
          Plugins can add content to various parts of the application using the
          official PatternFly component library.
        </p>
      </CardBody>
      <CardFooter>
        <Button
          variant="primary"
          data-cy="patternfly-demo-button"
          style={{
            background: "linear-gradient(45deg, #06c, #4a90e2)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          ✨ PatternFly Button ✨
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GreetingPatternfly;
