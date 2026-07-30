import { useSearchParams } from "react-router";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";

export const parsePage = (value: string | null): number => {
  if (value && (parseInt(value) < 1 || isNaN(parseInt(value)))) {
    return 1;
  }
  return Math.max(1, parseInt(value || "1"));
};

export const parsePerPage = (value: string | null): number => {
  if (value && (parseInt(value) < 1 || isNaN(parseInt(value)))) {
    return 10;
  }
  return parseInt(value || "10");
};

const parseMembership = (value: string | null): MembershipDirection => {
  if (value === "direct" || value === "indirect") {
    return value;
  }
  return "direct";
};

const useListPageSearchParams = () => {
  const [params, setParams] = useSearchParams();

  const page = parsePage(params.get("p"));
  const perPage = parsePerPage(params.get("size"));
  const searchValue = params.get("search") || "";
  const membershipDirection = parseMembership(params.get("membership"));

  const setPage = (newPage: number) => {
    const nextPage = Math.max(1, newPage);
    setParams(
      (currentParams) => {
        if (nextPage > 1) {
          currentParams.set("p", nextPage.toString());
        } else {
          currentParams.delete("p");
        }
        return currentParams;
      },
      { replace: true }
    );
  };

  const setPerPage = (newPerPage: number) => {
    const nextPerPage = Math.max(1, newPerPage);
    setParams(
      (currentParams) => {
        currentParams.set("size", nextPerPage.toString());
        return currentParams;
      },
      { replace: true }
    );
  };

  const setSearchValue = (value: string) => {
    setParams(
      (currentParams) => {
        if (value !== "") {
          currentParams.set("search", value);
        } else {
          currentParams.delete("search");
        }
        return currentParams;
      },
      { replace: true }
    );
  };

  const setMembershipDirection = (direction: MembershipDirection) => {
    setParams(
      (currentParams) => {
        if (direction !== "direct") {
          currentParams.set("membership", direction);
        } else {
          currentParams.delete("membership");
        }
        return currentParams;
      },
      { replace: true }
    );
  };

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
