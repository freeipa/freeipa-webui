import { Page } from "@patternfly/react-core";
import React from "react";
import { useCommandQuery } from "src/store/services/rpc";

interface UserType {
  dn: string;
  uid: string[];
}

const getUsers = (rawUsersList) => {
  if (rawUsersList) return rawUsersList.result.result as UserType[];
  return [];
};

const APIBrowser = () => {
  const { data: response, isLoading } = useCommandQuery("user_find");
  const users = getUsers(response);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!users) {
    return <div>No users :(</div>;
  }

  if (users) {
    // console.log(response);
    console.log(users);
  }

  return (
    <Page>
      <ul>
        <li key={0}>Zero</li>
        {users.map((user) => (
          <li key={user.dn}>
            {user.uid[0]} - {user.dn} {user["uid"]}
          </li>
        ))}
      </ul>
    </Page>
  );
};

export default APIBrowser;
