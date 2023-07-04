// Data types
import { User } from "src/utils/datatypes/globalDataTypes";

// Parse the 'textInputField' data into expected data type
// - TODO: Adapt it to work with many types of data
export const asRecord = (
  // property: string,
  element: Partial<User>,
  onElementChange: (element: Partial<User>) => void
  // metadata: Metadata
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as User);
  }

  return { ipaObject, recordOnChange };
};
