import React from "react";
import { User } from "src/utils/datatypes/globalDataTypes";
import { asRecord } from "src/utils/userUtils";

const useFieldComparison = (
  user: User,
  onUserChange: (element: User) => void,
  setFieldChanged: (value: boolean) => void
) => {
  // Track ipaObject
  const [currentIpaObject, setCurrentIpaObject] = React.useState<User>(
    user as User
  );
  // The first time the data is retrieved
  const [dataRendered, setDataRendered] = React.useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(user, onUserChange);

  // Returns if a specific field has been modified
  const isModified = (parameter: string) => {
    return ipaObject[parameter][0] !== currentIpaObject[parameter][0];
  };

  // Returns if a specific field has been modified (for potential undefined fields)
  const isUndefinedFieldModified = (parameter: string) => {
    return (
      (ipaObject[parameter] !== undefined &&
        currentIpaObject[parameter] !== undefined &&
        ipaObject[parameter][0] !== currentIpaObject[parameter][0]) ||
      (currentIpaObject[parameter] === undefined &&
        ipaObject[parameter] !== undefined &&
        ipaObject[parameter][0] !== "")
    );
  };

  React.useEffect(() => {
    if (!dataRendered && currentIpaObject !== undefined) {
      setCurrentIpaObject(ipaObject as User);
      setDataRendered(true);
    }

    // Check if data has changed
    if (dataRendered && currentIpaObject !== undefined) {
      // 'Indentity settings'
      if (
        isModified("givenname") ||
        isModified("sn") ||
        isModified("cn") ||
        isModified("displayname") ||
        isModified("gecos") ||
        isModified("title") ||
        isUndefinedFieldModified("userclass")
      ) {
        setFieldChanged(true);
      } else {
        setFieldChanged(false);
      }
    }
  }, [ipaObject]);

  return { ipaObject, recordOnChange };
};

export default useFieldComparison;
