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

export interface PropsToBreadcrumb {
  className?: string;
  preText?: string;
}

const BreadCrumb = (props: PropsToBreadcrumb) => {
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadCrumbItem[]
  >([]);
  const pagesVisited = useAppSelector((state) => state.routes.breadCrumbPath);

  React.useEffect(() => {
    if (pagesVisited) {
      setBreadcrumbItems(pagesVisited);
    }
  }, [pagesVisited]);

  // When rendering the elements, the last item can contain some text before the name
  return (
    <Breadcrumb className={props.className}>
      {breadcrumbItems.map((page, idx) =>
        idx === breadcrumbItems.length - 1 ? (
          <BreadcrumbItem key={idx} isActive={page.isActive || false}>
            {props.preText && props.preText + " "}
            {page.name}
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem
            key={idx}
            to={page.url}
            isActive={page.isActive || false}
          >
            {page.name}
          </BreadcrumbItem>
        )
      )}
    </Breadcrumb>
  );
};

export default BreadCrumb;
