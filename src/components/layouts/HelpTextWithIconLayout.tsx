import React from "react";
import { TextContent, Text } from "@patternfly/react-core";

interface PropsToHelpTextLayout {
  // TextContent
  textContentClassName?: string;
  // Text 1
  textComponent:
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
  textClassName?: string;
  textIsVisitedLink?: boolean | undefined;
  textLinkUrl?: string | undefined;
  textOuiaId?: number | string;
  textOuiaSafe?: boolean;
  // Text 2
  subTextComponent:
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
  subTextClassName?: string;
  subTextIsVisitedLink?: boolean | undefined;
  subTextLinkUrl?: string | undefined;
  subTextOuiaId?: number | string;
  subTextOuiaSafe?: boolean;
  // Children
  textContent: string;
  icon: JSX.Element;
}

const HelpTextWithIconLayout = (props: PropsToHelpTextLayout) => {
  return (
    <TextContent>
      <Text
        component={props.textComponent}
        className={props.textClassName}
        isVisitedLink={props.textIsVisitedLink}
        href={props.textLinkUrl}
        ouiaId={props.textOuiaId}
        ouiaSafe={props.textOuiaSafe}
      >
        {props.icon}
        <Text
          component={props.subTextComponent}
          className={props.subTextClassName}
          isVisitedLink={props.subTextIsVisitedLink}
          href={props.subTextLinkUrl}
          ouiaId={props.subTextOuiaId}
          ouiaSafe={props.subTextOuiaSafe}
        >
          {props.textContent}
        </Text>
      </Text>
    </TextContent>
  );
};

export default HelpTextWithIconLayout;
