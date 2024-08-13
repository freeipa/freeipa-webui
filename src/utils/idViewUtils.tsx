// Data types
import { IDView } from "src/utils/datatypes/globalDataTypes";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

const simpleValues = new Set([
  "cn",
  "description",
  "dn",
  "ipadomainresolutionorder",
]);
const dateValues = new Set([]);

export function apiToIDView(apiRecord: Record<string, unknown>): IDView {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<IDView>;
  return partialViewToView(converted) as IDView;
}

export function partialViewToView(partialView: Partial<IDView>): IDView {
  return {
    ...createEmptyView(),
    ...partialView,
  };
}

// Get empty User object initialized with default values
export function createEmptyView(): IDView {
  const view: IDView = {
    dn: "",
    cn: "",
    description: "",
    ipadomainresolutionorder: "",
  };

  return view;
}
