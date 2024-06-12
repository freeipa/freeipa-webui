import React from "react";
import { useSearchParams } from "react-router-dom";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";

const useRoutingParams = () => {
  const [params, setParams] = useSearchParams();

  // States
  // Page indexes
  // - Ensure that the page index is always a positive integer
  const getPageParam = () => {
    const pageParam = params.get("p");
    if (pageParam && (parseInt(pageParam) < 1 || isNaN(parseInt(pageParam)))) {
      return 1;
    } else {
      return parseInt(pageParam || "1");
    }
  };

  const getPerPageParam = () => {
    const pageParam = params.get("size");
    if (pageParam && (parseInt(pageParam) < 1 || isNaN(parseInt(pageParam)))) {
      return 10;
    } else {
      return parseInt(pageParam || "10");
    }
  };

  const [page, setPage] = React.useState(getPageParam());
  const [perPage, setPerPage] = React.useState(getPerPageParam());

  // Search value
  const [searchValue, setSearchValue] = React.useState(
    params.get("search") || ""
  );

  // Membership direction
  // - Ensure that the teo possible options are "direct" and "indirect"
  const getMembershipParam = () => {
    if (
      params.get("membership") !== "indirect" ||
      params.get("membership") !== "direct"
    ) {
      return "direct";
    } else {
      return params.get("membership") as MembershipDirection;
    }
  };

  const [membershipDirection, setMembershipDirection] =
    React.useState<MembershipDirection>(getMembershipParam());

  // Handle URLs with navigation parameters
  React.useEffect(() => {
    let searchParamsNew = {};

    if (page > 1) {
      searchParamsNew = {
        ...searchParamsNew,
        p: page.toString(),
      };
    }
    if (searchValue !== "") {
      searchParamsNew = {
        ...searchParamsNew,
        search: searchValue,
      };
    }
    if (membershipDirection !== "direct") {
      searchParamsNew = {
        ...searchParamsNew,
        membership: membershipDirection,
      };
    }
    searchParamsNew = {
      ...searchParamsNew,
      size: perPage.toString(),
    };

    setParams(searchParamsNew, { replace: true });
  }, [page, searchValue, membershipDirection, perPage]);

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    searchValue,
    setSearchValue,
    membershipDirection,
    setMembershipDirection,
  };
};

export default useRoutingParams;
