// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
// PatternFly
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";

export interface PagesVisited {
  name: string;
  url: string;
}

export interface PropsToBreadcrumb {
  userId: string;
  className?: string;
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
      <BreadcrumbItem isActive>User login: {props.userId}</BreadcrumbItem>
    </Breadcrumb>
  );
};

export default BreadcrumbLayout;
