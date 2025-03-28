import React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Button,
  Title,
  Text,
  TextVariants,
} from "@patternfly/react-core";

/**
 * A greeting component built using PatternFly 5 components
 */
const GreetingPatternfly = () => {
  return (
    <Card isCompact style={{ margin: "1rem 0" }}>
      <CardTitle>
        <Title headingLevel="h2" size="xl">
          <span style={{ color: "#06c" }}>
            ✨ Hello World Plugin (PatternFly 5) ✨
          </span>
        </Title>
      </CardTitle>
      <CardBody>
        <Text component={TextVariants.p}>
          <span style={{ fontStyle: "italic", color: "#484" }}>
            This content is provided by the Hello World plugin using PatternFly
            5 components!
          </span>
        </Text>
        <Text component={TextVariants.p} style={{ padding: "0.5rem 0" }}>
          <span style={{ color: "#06c" }}>
            Plugins can add content to various parts of the application using
            the official PatternFly component library.
          </span>
        </Text>
      </CardBody>
      <CardFooter>
        <Button
          variant="primary"
          style={{
            background: "linear-gradient(45deg, #06c, #4a90e2)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          className="pf-u-px-lg pf-u-py-md"
        >
          ✨ PatternFly Button ✨
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GreetingPatternfly;
