import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import HBACRulesJson from "./hbacRules.json";
// Data type
import { HBACRules } from "src/utils/datatypes/globalDataTypes";

interface HBACRulesState {
  hbacRulesList: HBACRules[];
}

const initialState: HBACRulesState = {
  hbacRulesList: HBACRulesJson,
};

const hbacRulesSlice = createSlice({
  name: "hbacrules",
  initialState,
  reducers: {},
});

export const selectHBACRules = (state: RootState) =>
  state.hbacrules.hbacRulesList;
export default hbacRulesSlice.reducer;
