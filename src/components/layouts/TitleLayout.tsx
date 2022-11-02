import React from "react";
// PatternFly
import { TextContent, Title } from "@patternfly/react-core";

interface PropsToTitleLayout {
  headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  text: string;
  className?: string;
  ouiaId?: number | string;
  ouiaSafe?: boolean;
  size?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

const TitleLayout = (props: PropsToTitleLayout) => {
  return (
    <TextContent>
      <Title
        headingLevel={props.headingLevel}
        className={props.className}
        ouiaId={props.ouiaId}
        ouiaSafe={props.ouiaSafe}
        size={props.size}
      >
        {props.text}
      </Title>
    </TextContent>
  );
};

export default TitleLayout;
