import React from "react";
// PatternFly
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";
// Redux
import { useAppSelector } from "src/store/hooks";
import { Link } from "react-router";

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

  // When rendering the elements, the last item can contain some text before the name
  return (
    <Breadcrumb className={props.className}>
      {pagesVisited.map((page, idx) =>
        idx === 0 || !page.isActive ? (
          <BreadcrumbItem
            key={page.url}
            isActive={page.isActive || false}
            render={({ className, ariaCurrent }) => (
              <Link
                to={page.url}
                className={className}
                aria-current={ariaCurrent}
              >
                {page.name}
              </Link>
            )}
          />
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
