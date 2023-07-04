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

interface PropsToUsersContactSettings {
  user: Partial<User>;
}

interface TelephoneData {
  id: number | string;
  telephone: string;
}

interface PagerData {
  id: number | string;
  pager: string;
}

interface MobilePhoneData {
  id: number | string;
  mobile: string;
}

interface FaxData {
  id: number | string;
  fax: string;
}

const UsersContactSettings = (props: PropsToUsersContactSettings) => {
  // TODO: This state variables should update the user data via the IPA API (`user_mod`)
  const [emailList, setEmailList] = useState<string[]>([]);
  const [telephoneList, setTelephoneList] = useState<TelephoneData[]>([]);
  const [pagerList, setPagerList] = useState<PagerData[]>([]);
  const [mobilePhoneList, setMobilePhoneList] = useState<MobilePhoneData[]>([]);
  const [faxList, setFaxList] = useState<FaxData[]>([]);

  useEffect(() => {
    if (props.user.mail !== undefined) {
      setEmailList(props.user.mail);
    }
  }, [props.user]);

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
    telephoneListCopy.push({ id: Date.now.toString(), telephone: "" });
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
    pagerListCopy.push({ id: Date.now.toString(), pager: "" });
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
    mobilePhoneListCopy.push({ id: Date.now.toString(), mobile: "" });
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
    faxListCopy.push({ id: Date.now.toString(), fax: "" });
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
                    />
                  </FlexItem>
                  <FlexItem key={"mail-" + idx + "-delete-button"}>
                    <SecondaryButton
                      name="remove"
                      onClickHandler={() => onRemoveEmailHandler(idx)}
                    >
                      Delete
                    </SecondaryButton>
                  </FlexItem>
                </Flex>
              ))}
            </Flex>
            <SecondaryButton
              classname="pf-u-mt-sm"
              name="add"
              onClickHandler={onAddEmailFieldHandler}
            >
              Add
            </SecondaryButton>
          </FormGroup>
          <FormGroup label="Telephone number" fieldId="telephone-number">
            <Flex direction={{ default: "column" }} name="telephonenumber">
              {telephoneList.map((userTelephone, idx) => (
                <Flex
                  direction={{ default: "row" }}
                  key={userTelephone.id + "-" + idx + "-div"}
                  name="value"
                >
                  <FlexItem
                    key={userTelephone.id + "-textbox"}
                    flex={{ default: "flex_1" }}
                  >
                    <TextInput
                      id="user-telephone"
                      value={userTelephone.telephone}
                      type="tel"
                      name={"telephonenumber-" + idx}
                      aria-label="user telephone"
                      onChange={(value, event) =>
                        onHandleTelephoneChange(value, event, idx)
                      }
                    />
                  </FlexItem>
                  <FlexItem key={userTelephone.id + "-delete-button"}>
                    <SecondaryButton
                      name="remove"
                      onClickHandler={() => onRemoveTelephoneHandler(idx)}
                    >
                      Delete
                    </SecondaryButton>
                  </FlexItem>
                </Flex>
              ))}
            </Flex>
            <SecondaryButton
              classname="pf-u-mt-sm"
              name="add"
              onClickHandler={onAddTelephoneFieldHandler}
            >
              Add
            </SecondaryButton>
          </FormGroup>
          <FormGroup label="Pager number" fieldId="pager-number">
            <Flex direction={{ default: "column" }} name="pager">
              {pagerList.map((userPager, idx) => (
                <Flex
                  direction={{ default: "row" }}
                  key={userPager.id + "-" + idx + "-div"}
                  name="value"
                >
                  <FlexItem
                    key={userPager.id + "-textbox"}
                    flex={{ default: "flex_1" }}
                  >
                    <TextInput
                      id="user-pager"
                      value={userPager.pager}
                      type="text"
                      name={"pager-" + idx}
                      aria-label="user pager"
                      onChange={(value, event) =>
                        onHandlePagerChange(value, event, idx)
                      }
                    />
                  </FlexItem>
                  <FlexItem key={userPager.id + "-delete-button"}>
                    <SecondaryButton
                      name="remove"
                      onClickHandler={() => onRemovePagerHandler(idx)}
                    >
                      Delete
                    </SecondaryButton>
                  </FlexItem>
                </Flex>
              ))}
            </Flex>
            <SecondaryButton
              classname="pf-u-mt-sm"
              name="add"
              onClickHandler={onAddPagerFieldHandler}
            >
              Add
            </SecondaryButton>
          </FormGroup>
        </Form>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <Form className="pf-u-mb-lg">
          <FormGroup label="Mobile phone number" fieldId="mobile-phone-number">
            <Flex direction={{ default: "column" }} name="mobile">
              {mobilePhoneList.map((userMobilePhone, idx) => (
                <Flex
                  direction={{ default: "row" }}
                  key={userMobilePhone.id + "-" + idx + "-div"}
                  name="value"
                >
                  <FlexItem
                    key={userMobilePhone.id + "-textbox"}
                    flex={{ default: "flex_1" }}
                  >
                    <TextInput
                      id="user-mobile-phone"
                      value={userMobilePhone.mobile}
                      type="tel"
                      name={"mobile-" + idx}
                      aria-label="user mobile phone"
                      onChange={(value, event) =>
                        onHandleMobilePhoneChange(value, event, idx)
                      }
                    />
                  </FlexItem>
                  <FlexItem key={userMobilePhone.id + "-delete-button"}>
                    <SecondaryButton
                      name="remove"
                      onClickHandler={() => onRemoveMobilePhoneHandler(idx)}
                    >
                      Delete
                    </SecondaryButton>
                  </FlexItem>
                </Flex>
              ))}
            </Flex>
            <SecondaryButton
              classname="pf-u-mt-sm"
              name="add"
              onClickHandler={onAddMobilePhoneFieldHandler}
            >
              Add
            </SecondaryButton>
          </FormGroup>
          <FormGroup label="Fax number" fieldId="fax-number">
            <Flex
              direction={{ default: "column" }}
              name="facsimiletelephonenumber"
            >
              {faxList.map((userFax, idx) => (
                <Flex
                  direction={{ default: "row" }}
                  key={userFax.id + "-" + idx + "-div"}
                  name="value"
                >
                  <FlexItem
                    key={userFax.id + "-textbox"}
                    flex={{ default: "flex_1" }}
                  >
                    <TextInput
                      id="user-fax"
                      value={userFax.fax}
                      type="tel"
                      name={"mobile-" + idx}
                      aria-label="user fax"
                      onChange={(value, event) =>
                        onHandleFaxChange(value, event, idx)
                      }
                    />
                  </FlexItem>
                  <FlexItem key={userFax.id + "-delete-button"}>
                    <SecondaryButton
                      name="remove"
                      onClickHandler={() => onRemoveFaxHandler(idx)}
                    >
                      Delete
                    </SecondaryButton>
                  </FlexItem>
                </Flex>
              ))}
            </Flex>
            <SecondaryButton
              classname="pf-u-mt-sm"
              name="add"
              onClickHandler={onAddFaxFieldHandler}
            >
              Add
            </SecondaryButton>
          </FormGroup>
        </Form>
      </FlexItem>
    </Flex>
  );
};

export default UsersContactSettings;
