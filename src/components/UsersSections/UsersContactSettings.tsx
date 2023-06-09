/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
// PatternFly
import {
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Layouts
import SecondaryButton from "src/components/layouts/SecondaryButton";
// Utils
import { isFieldWritable } from "src/utils/utils";

interface PropsToUsersContactSettings {
  userData: any;
  attrLevelRights: any;
}

const UsersContactSettings = (props: PropsToUsersContactSettings) => {
  // TODO: This state variables should update the user data via the IPA API (`user_mod`)
  const [emailList, setEmailList] = useState<string[]>([]);
  const [telephoneList, setTelephoneList] = useState<string[]>([]);
  const [pagerList, setPagerList] = useState<string[]>([]);
  const [mobilePhoneList, setMobilePhoneList] = useState<string[]>([]);
  const [faxList, setFaxList] = useState<string[]>([]);

  // Updates data on 'userData' changes
  useEffect(() => {
    if (props.userData !== undefined) {
      const userData = props.userData as User;

      if (userData.mail !== undefined) setEmailList(userData.mail);
      if (userData.telephonenumber !== undefined) {
        setTelephoneList(userData.telephonenumber);
      }
      if (userData.pager !== undefined) setPagerList(userData.pager);
      if (userData.mobile !== undefined) setMobilePhoneList(userData.mobile);
      if (userData.facsimiletelephonenumber !== undefined) {
        setFaxList(userData.facsimiletelephonenumber);
      }
    }
  }, [props.userData]);

  // Email
  // - 'Add email field' handler
  const onAddEmailFieldHandler = () => {
    const emailListCopy = [...emailList];
    emailListCopy.push("");
    setEmailList(emailListCopy);
  };

  // - 'Change email' handle
  const onHandleEmailChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    const emailListCopy = [...emailList];
    emailListCopy[idx] = (event.target as HTMLInputElement).value;
    setEmailList(emailListCopy);
  };

  // - 'Remove email' handler
  const onRemoveEmailHandler = (idx: number) => {
    const emailListCopy = [...emailList];
    emailListCopy.splice(idx, 1);
    setEmailList(emailListCopy);
  };

  // Telephone number
  // - 'Add telephone number' handler
  const onAddTelephoneFieldHandler = () => {
    const telephoneListCopy = [...telephoneList];
    telephoneListCopy.push("");
    setTelephoneList(telephoneListCopy);
  };

  // - 'Change telephone number' handler
  const onHandleTelephoneChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    const telephoneListCopy = [...telephoneList];
    telephoneListCopy[idx]["telephone"] = (
      event.target as HTMLInputElement
    ).value;
    setTelephoneList(telephoneListCopy);
  };

  // - 'Remove telephone number' handler
  const onRemoveTelephoneHandler = (idx: number) => {
    const telephoneListCopy = [...telephoneList];
    telephoneListCopy.splice(idx, 1);
    setTelephoneList(telephoneListCopy);
  };

  // Pager
  // - 'Add pager number' handler
  const onAddPagerFieldHandler = () => {
    const pagerListCopy = [...pagerList];
    pagerListCopy.push("");
    setPagerList(pagerListCopy);
  };

  // - 'Change pager number' handler
  const onHandlePagerChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    const pagerListCopy = [...pagerList];
    pagerListCopy[idx]["pager"] = (event.target as HTMLInputElement).value;
    setPagerList(pagerListCopy);
  };

  // - 'Remove pager number' handler
  const onRemovePagerHandler = (idx: number) => {
    const pagerListCopy = [...pagerList];
    pagerListCopy.splice(idx, 1);
    setPagerList(pagerListCopy);
  };

  // Mobile phone
  // - 'Add mobile phone' handler
  const onAddMobilePhoneFieldHandler = () => {
    const mobilePhoneListCopy = [...mobilePhoneList];
    mobilePhoneListCopy.push("");
    setMobilePhoneList(mobilePhoneListCopy);
  };

  // - 'Change mobile number' handler
  const onHandleMobilePhoneChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    const mobilePhoneListCopy = [...mobilePhoneList];
    mobilePhoneListCopy[idx]["mobile"] = (
      event.target as HTMLInputElement
    ).value;
    setMobilePhoneList(mobilePhoneListCopy);
  };

  // - 'Remove mobile number' handler
  const onRemoveMobilePhoneHandler = (idx: number) => {
    const mobilePhoneListCopy = [...mobilePhoneList];
    mobilePhoneListCopy.splice(idx, 1);
    setMobilePhoneList(mobilePhoneListCopy);
  };

  // Fax
  // - 'Add fax' handler
  const onAddFaxFieldHandler = () => {
    const faxListCopy = [...faxList];
    faxListCopy.push("");
    setFaxList(faxListCopy);
  };

  // - 'Change fax' handler
  const onHandleFaxChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
    idx: number
  ) => {
    const faxListCopy = [...faxList];
    faxListCopy[idx]["mobile"] = (event.target as HTMLInputElement).value;
    setFaxList(faxListCopy);
  };

  // - 'Remove fax' handler
  const onRemoveFaxHandler = (idx: number) => {
    const faxListCopy = [...faxList];
    faxListCopy.splice(idx, 1);
    setFaxList(faxListCopy);
  };

  return (
    <Flex direction={{ default: "column", md: "row" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Mail address" fieldId="mail-address">
            <Flex direction={{ default: "column" }} name="mail">
              {emailList.map((userEmail, idx) => (
                <Flex
                  direction={{ default: "row" }}
                  key={"mail-" + idx + "-div"}
                  name="value"
                >
                  <FlexItem
                    key={"mail-" + idx + "-textbox"}
                    flex={{ default: "flex_1" }}
                  >
                    <TextInput
                      id="user-email"
                      value={userEmail}
                      type="email"
                      name={"mail-" + idx}
                      aria-label="user email"
                      onChange={(value, event) =>
                        onHandleEmailChange(value, event, idx)
                      }
                      isDisabled={!isFieldWritable(props.attrLevelRights.mail)}
                    />
                  </FlexItem>
                  {isFieldWritable(props.attrLevelRights.mail) && (
                    <FlexItem key={"mail-" + idx + "-delete-button"}>
                      <SecondaryButton
                        name="remove"
                        onClickHandler={() => onRemoveEmailHandler(idx)}
                      >
                        Delete
                      </SecondaryButton>
                    </FlexItem>
                  )}
                </Flex>
              ))}
            </Flex>
            {isFieldWritable(props.attrLevelRights.mail) && (
              <SecondaryButton
                classname="pf-u-mt-sm"
                name="add"
                onClickHandler={onAddEmailFieldHandler}
              >
                Add
              </SecondaryButton>
            )}
          </FormGroup>

          <FormGroup label="Telephone number" fieldId="telephone-number">
            <Flex direction={{ default: "column" }} name="telephonenumber">
              {telephoneList !== undefined &&
                telephoneList.map((userTelephone, idx) => (
                  <Flex
                    direction={{ default: "row" }}
                    key={"telephonenumber-" + idx + "-div"}
                    name="value"
                  >
                    <FlexItem
                      key={"telephonenumber-" + idx + "-textbox"}
                      flex={{ default: "flex_1" }}
                    >
                      <TextInput
                        id="user-telephone"
                        value={userTelephone}
                        type="tel"
                        name={"telephonenumber-" + idx}
                        aria-label="user telephone"
                        onChange={(value, event) =>
                          onHandleTelephoneChange(value, event, idx)
                        }
                        isDisabled={
                          !isFieldWritable(
                            props.attrLevelRights.telephonenumber
                          )
                        }
                      />
                    </FlexItem>
                    {isFieldWritable(props.attrLevelRights.telephonenumber) && (
                      <FlexItem
                        key={"telephonenumber-" + idx + "-delete-button"}
                      >
                        <SecondaryButton
                          name="remove"
                          onClickHandler={() => onRemoveTelephoneHandler(idx)}
                        >
                          Delete
                        </SecondaryButton>
                      </FlexItem>
                    )}
                  </Flex>
                ))}
            </Flex>
            {isFieldWritable(props.attrLevelRights.telephonenumber) && (
              <SecondaryButton
                classname="pf-u-mt-sm"
                name="add"
                onClickHandler={onAddTelephoneFieldHandler}
              >
                Add
              </SecondaryButton>
            )}
          </FormGroup>

          <FormGroup label="Pager number" fieldId="pager-number">
            <Flex direction={{ default: "column" }} name="pager">
              {pagerList !== undefined &&
                pagerList.map((userPager, idx) => (
                  <Flex
                    direction={{ default: "row" }}
                    key={"pager-" + idx + "-div"}
                    name="value"
                  >
                    <FlexItem
                      key={"pager-" + idx + "-textbox"}
                      flex={{ default: "flex_1" }}
                    >
                      <TextInput
                        id="user-pager"
                        value={userPager}
                        type="text"
                        name={"pager-" + idx}
                        aria-label="user pager"
                        onChange={(value, event) =>
                          onHandlePagerChange(value, event, idx)
                        }
                        isDisabled={
                          !isFieldWritable(props.attrLevelRights.pager)
                        }
                      />
                    </FlexItem>
                    {isFieldWritable(props.attrLevelRights.pager) && (
                      <FlexItem key={"pager-" + idx + "-delete-button"}>
                        <SecondaryButton
                          name="remove"
                          onClickHandler={() => onRemovePagerHandler(idx)}
                        >
                          Delete
                        </SecondaryButton>
                      </FlexItem>
                    )}
                  </Flex>
                ))}
            </Flex>
            {isFieldWritable(props.attrLevelRights.pager) && (
              <SecondaryButton
                classname="pf-u-mt-sm"
                name="add"
                onClickHandler={onAddPagerFieldHandler}
              >
                Add
              </SecondaryButton>
            )}
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Mobile phone number" fieldId="mobile-phone-number">
            <Flex direction={{ default: "column" }} name="mobile">
              {mobilePhoneList !== undefined &&
                mobilePhoneList.map((userMobilePhone, idx) => (
                  <Flex
                    direction={{ default: "row" }}
                    key={"mobile-" + idx + "-div"}
                    name="value"
                  >
                    <FlexItem
                      key={"mobile-" + idx + "-textbox"}
                      flex={{ default: "flex_1" }}
                    >
                      <TextInput
                        id="user-mobile-phone"
                        value={userMobilePhone}
                        type="tel"
                        name={"mobile-" + idx}
                        aria-label="user mobile phone"
                        onChange={(value, event) =>
                          onHandleMobilePhoneChange(value, event, idx)
                        }
                        isDisabled={
                          !isFieldWritable(props.attrLevelRights.mobile)
                        }
                      />
                    </FlexItem>
                    {isFieldWritable(props.attrLevelRights.mobile) && (
                      <FlexItem key={"mobile-" + idx + "-delete-button"}>
                        <SecondaryButton
                          name="remove"
                          onClickHandler={() => onRemoveMobilePhoneHandler(idx)}
                        >
                          Delete
                        </SecondaryButton>
                      </FlexItem>
                    )}
                  </Flex>
                ))}
            </Flex>
            {isFieldWritable(props.attrLevelRights.mobile) && (
              <SecondaryButton
                classname="pf-u-mt-sm"
                name="add"
                onClickHandler={onAddMobilePhoneFieldHandler}
              >
                Add
              </SecondaryButton>
            )}
          </FormGroup>
          <FormGroup label="Fax number" fieldId="fax-number">
            <Flex
              direction={{ default: "column" }}
              name="facsimiletelephonenumber"
            >
              {faxList !== undefined &&
                faxList.map((userFax, idx) => (
                  <Flex
                    direction={{ default: "row" }}
                    key={"facsimiletelephonenumber-" + idx + "-div"}
                    name="value"
                  >
                    <FlexItem
                      key={"facsimiletelephonenumber-" + idx + "-textbox"}
                      flex={{ default: "flex_1" }}
                    >
                      <TextInput
                        id="user-fax"
                        value={userFax}
                        type="tel"
                        name={"facsimiletelephonenumber-" + idx}
                        aria-label="user fax"
                        onChange={(value, event) =>
                          onHandleFaxChange(value, event, idx)
                        }
                        isDisabled={
                          !isFieldWritable(
                            props.attrLevelRights.facsimiletelephonenumber
                          )
                        }
                      />
                    </FlexItem>
                    {isFieldWritable(
                      props.attrLevelRights.facsimiletelephonenumber
                    ) && (
                      <FlexItem
                        key={
                          "facsimiletelephonenumber-" + idx + "-delete-button"
                        }
                      >
                        <SecondaryButton
                          name="remove"
                          onClickHandler={() => onRemoveFaxHandler(idx)}
                        >
                          Delete
                        </SecondaryButton>
                      </FlexItem>
                    )}
                  </Flex>
                ))}
            </Flex>
            {isFieldWritable(
              props.attrLevelRights.facsimiletelephonenumber
            ) && (
              <SecondaryButton
                classname="pf-u-mt-sm"
                name="add"
                onClickHandler={onAddFaxFieldHandler}
              >
                Add
              </SecondaryButton>
            )}
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersContactSettings;
