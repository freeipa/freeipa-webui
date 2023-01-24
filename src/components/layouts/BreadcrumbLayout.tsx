import React from "react";
// PatternFly
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";

export interface PagesVisited {
  name: string;
  url: string;
}

export interface PropsToBreadcrumb {
  userId: string; // TODO: Replace 'userId' to a more reusable name
  className?: string;
  preText?: string;
  pagesVisited: PagesVisited[];
}

const BreadcrumbLayout = (props: PropsToBreadcrumb) => {
  return (
    <Breadcrumb className={props.className}>
      {props.pagesVisited.map((page) => (
        <BreadcrumbItem key={page.name} to={page.url}>
          {page.name}
        </BreadcrumbItem>
      ))}
      <BreadcrumbItem isActive>
        {props.preText !== undefined ? props.preText : "User login:"}{" "}
        {props.userId}
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export default BreadcrumbLayout;
