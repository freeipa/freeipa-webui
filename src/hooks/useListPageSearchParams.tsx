import React from "react";
import { useSearchParams } from "react-router";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";

const useListPageSearchParams = () => {
  const [params, setParams] = useSearchParams();

  // States
  // Page indexes
  // - Ensure that the page index is always a positive integer
  const getPageParam = () => {
    const pageParam = params.get("p");
    if (pageParam && (parseInt(pageParam) < 1 || isNaN(parseInt(pageParam)))) {
      return 1;
    } else {
      return Math.max(1, parseInt(pageParam || "1"));
    }
  };

  const getPerPageParam = () => {
    const pageParam = params.get("size");
    if (pageParam && (parseInt(pageParam) < 1 || isNaN(parseInt(pageParam)))) {
      return 10;
    } else {
      return Math.max(10, parseInt(pageParam || "10"));
    }
  };

  const [page, _setPage] = React.useState(getPageParam());
  const [perPage, _setPerPage] = React.useState(getPerPageParam());

  // Ensure 'page' is always >= 1
  const setPage = (newPage: number) => {
    _setPage(Math.max(1, newPage));
  };

  // Ensure 'perPage' is always >= 1
  const setPerPage = (newPerPage: number) => {
    _setPerPage(Math.max(1, newPerPage));
  };

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
    setParams(
      (params) => {
        if (page > 1) {
          params.set("p", page.toString());
        } else {
          params.delete("p");
        }

        if (searchValue !== "") {
          params.set("search", searchValue);
        } else {
          params.delete("search");
        }

        if (membershipDirection !== "direct") {
          params.set("membership", membershipDirection);
        } else {
          params.delete("membership");
        }

        params.set("size", perPage.toString());
        return params;
      },
      { replace: true }
    );
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

export default useListPageSearchParams;
