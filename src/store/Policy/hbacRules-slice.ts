import { createSlice } from "@reduxjs/toolkit";
import HBACRulesJson from "./hbacRules.json";
// Data type
import { HBACRulesOld } from "src/utils/datatypes/globalDataTypes";

interface HBACRulesState {
  hbacRulesList: HBACRulesOld[];
}

const initialState: HBACRulesState = {
  hbacRulesList: HBACRulesJson,
};

const hbacRulesSlice = createSlice({
  name: "hbacrules",
  initialState,
  reducers: {},
});

export default hbacRulesSlice.reducer;
