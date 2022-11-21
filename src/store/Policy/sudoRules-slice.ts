import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import sudoRulesJson from "./sudoRules.json";
// Data type
import { SudoRules } from "src/utils/datatypes/globalDataTypes";

interface SudoRulesState {
  sudoRulesList: SudoRules[];
}

const initialState: SudoRulesState = {
  sudoRulesList: sudoRulesJson,
};

const sudoRulesSlice = createSlice({
  name: "sudorules",
  initialState,
  reducers: {},
});

export const selectSudoRules = (state: RootState) =>
  state.sudorules.sudoRulesList;
export default sudoRulesSlice.reducer;
