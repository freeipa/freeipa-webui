import { createSlice } from "@reduxjs/toolkit";
import sudoRulesJson from "./sudoRules.json";
// Data type
import { SudoRulesOld } from "src/utils/datatypes/globalDataTypes";

interface SudoRulesState {
  sudoRulesList: SudoRulesOld[];
}

const initialState: SudoRulesState = {
  sudoRulesList: sudoRulesJson,
};

const sudoRulesSlice = createSlice({
  name: "sudorules",
  initialState,
  reducers: {},
});

export default sudoRulesSlice.reducer;
