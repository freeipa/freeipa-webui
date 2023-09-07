import EN from './en.json';
import ZH_CN from "./zh_cn.json";

type LangType = "EN"|"ZH_CN";
const langPackage: Record<LangType, Record<string, string>> = {
  ZH_CN,
  EN
};

export function getLabel(key: string, type: LangType = "EN") {
  return langPackage[type][key] || key;
}
