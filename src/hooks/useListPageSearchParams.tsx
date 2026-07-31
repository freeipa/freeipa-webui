import { useSearchParams } from "react-router";
import { MembershipDirection } from "src/components/MemberOf/MemberOfToolbar";

export const parsePage = (value: string | null): number => {
  const parsedValue = parseInt(value || "1", 10);
  return isNaN(parsedValue) ? 1 : parsedValue;
};

export const parsePerPage = (value: string | null): number => {
  const parsedValue = parseInt(value || "10", 10);
  return isNaN(parsedValue) ? 1 : parsedValue;
};

const parseMembership = (value: string | null): MembershipDirection =>
  value === "indirect" ? value : "direct";

const useListPageSearchParams = () => {
  const [params, setParams] = useSearchParams();

  const page = parsePage(params.get("p"));
  const perPage = parsePerPage(params.get("size"));
  const searchValue = params.get("search") || "";
  const membershipDirection = parseMembership(params.get("membership"));

  const setPage = (newPage: number) => {
    const nextPage = isNaN(newPage) ? 1 : Math.max(1, newPage);
    setParams(
      (currentParams) => {
        if (nextPage > 1) {
          currentParams.set("p", nextPage.toString(10));
        } else {
          currentParams.delete("p");
        }
        return currentParams;
      },
      { replace: true }
    );
  };

  const setPerPage = (newPerPage: number) => {
    const nextPerPage = isNaN(newPerPage) ? 10 : Math.max(10, newPerPage);
    setParams(
      (currentParams) => {
        if (nextPerPage !== 10) {
          currentParams.set("size", nextPerPage.toString(10));
        } else {
          currentParams.delete("size");
        }
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
