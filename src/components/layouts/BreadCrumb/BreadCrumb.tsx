import React from "react";
// PatternFly
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";
// Redux
import { useAppSelector } from "src/store/hooks";

export interface BreadCrumbItem {
  name: string;
  url: string;
  isActive?: boolean;
}

interface PropsToBreadcrumb {
  className?: string;
  preText?: string;
  breadcrumbItems?: BreadCrumbItem[];
}

const BreadCrumb = (props: PropsToBreadcrumb) => {
  // Possibility of retrieving the 'breadcrumbItems' from the props or via Redux
  const pagesVisited = !props.breadcrumbItems
    ? useAppSelector((state) => state.routes.breadCrumbPath)
    : props.breadcrumbItems;

  const breadcrumbItems = pagesVisited || [];

  // When rendering the elements, the last item can contain some text before the name
  return (
    <Breadcrumb className={props.className}>
      {breadcrumbItems.map((page, idx) =>
        idx === 0 || !page.isActive ? (
          <BreadcrumbItem
            key={page.url}
            to={page.url}
            isActive={page.isActive || false}
          >
            {page.name}
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={page.url} isActive={page.isActive || false}>
            {props.preText && props.preText + " "}
            {page.name}
          </BreadcrumbItem>
        )
      )}
    </Breadcrumb>
  );
};

export default BreadCrumb;
