// For further information, visit the PatternFly page: https://www.patternfly.org/v4/components/text
import { TextContent, Text } from "@patternfly/react-core";
import React from "react";

interface PropsToTextLayout {
  // 'TextContent' props
  textContentClassName?: string;
  textContentIsVisited?: boolean;
  textContentChildren?: React.ReactNode;
  // Text
  className?: string;
  component?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "a"
    | "small"
    | "blockquote"
    | "pre";
  isvisitedLink?: boolean;
  ouiaId?: string | number;
  ouiaSafe?: boolean;
  children: React.ReactNode;
}

const TextLayout = (props: PropsToTextLayout) => {
  return (
    <TextContent
      className={props.textContentClassName}
      isVisited={props.textContentIsVisited}
    >
      {props.textContentChildren}
      <Text
        component={props.component}
        isVisitedLink={props.isvisitedLink}
        ouiaId={props.ouiaId}
        ouiaSafe={props.ouiaSafe}
        className={props.className}
      >
        {props.children}
      </Text>
    </TextContent>
  );
};

export default TextLayout;
