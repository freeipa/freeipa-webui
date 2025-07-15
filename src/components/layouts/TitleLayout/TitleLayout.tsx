import React from "react";
// PatternFly
import { TextContent, Title } from "@patternfly/react-core";

interface PropsToTitleLayout {
  headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  id: string;
  text: string;
  className?: string;
  ouiaId?: number | string;
  ouiaSafe?: boolean;
  size?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  preText?: string;
}

const TitleLayout = (props: PropsToTitleLayout) => {
  const titleText = props.preText ? (
    <div className="pf-v5-u-display-flex">
      <div className="pf-v5-u-color-400">{props.preText}</div>
      <div className="pf-v5-u-ml-sm">{props.text}</div>
    </div>
  ) : (
    <>{props.text}</>
  );
  return (
    <TextContent key={props.id}>
      <Title
        headingLevel={props.headingLevel}
        id={props.id}
        className={props.className}
        ouiaId={props.ouiaId}
        ouiaSafe={props.ouiaSafe}
        size={props.size}
      >
        {titleText}
      </Title>
    </TextContent>
  );
};

export default TitleLayout;
