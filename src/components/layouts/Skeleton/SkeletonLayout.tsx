// SPDX-FileCopyrightText: 2022 Red Hat, Inc.
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import { Skeleton } from "@patternfly/react-core";

interface PropsToSkeleton {
  className?: string;
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  height?: string;
  screenreaderText?: string;
  shape?: "circle" | "square";
  width?: string;
}

const SkeletonLayout = (propsToSkeleton: PropsToSkeleton) => {
  return (
    <Skeleton
      className={propsToSkeleton.className}
      fontSize={propsToSkeleton.fontSize}
      height={propsToSkeleton.height}
      screenreaderText={propsToSkeleton.screenreaderText}
      shape={propsToSkeleton.shape}
      width={propsToSkeleton.width}
    />
  );
};

export default SkeletonLayout;
