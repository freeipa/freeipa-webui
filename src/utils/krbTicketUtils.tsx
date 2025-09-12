// Data types
import { KrbTicket } from "./datatypes/globalDataTypes";
// Utils

export const asRecord = (
  element: Partial<KrbTicket>,
  onElementChange: (element: Partial<KrbTicket>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as KrbTicket);
  }

  return { ipaObject, recordOnChange };
};
