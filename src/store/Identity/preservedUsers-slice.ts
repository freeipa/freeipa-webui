import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "src/store/store";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";

interface PreservedUsersState {
  usersList: User[];
}

interface ChangeStatusData {
  newStatus: boolean;
  selectedUsers: string[];
}

const initialState: PreservedUsersState = {
  usersList: [],
};

const preservedUsersSlice = createSlice({
  name: "preservedUsers",
  initialState,
  reducers: {
    updateUsersList: (state, action: PayloadAction<User[]>) => {
      const updatedUserList = action.payload;
      state.usersList = updatedUserList;
    },
    addUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      state.usersList.push({
        // identity
        title: newUser.title,
        givenname: newUser.givenname,
        sn: newUser.sn,
        displayname: newUser.displayname,
        initials: newUser.initials,
        gecos: newUser.gecos,
        userclass: newUser.userclass,
        // account
        uid: newUser.uid,
        has_password: newUser.has_password,
        krbpasswordexpiration: newUser.krbpasswordexpiration,
        uidnumber: newUser.uidnumber,
        gidnumber: newUser.gidnumber,
        krbprincipalname: newUser.krbprincipalname,
        krbprincipalexpiration: newUser.krbprincipalexpiration,
        loginshell: newUser.loginshell,
        homedirectory: newUser.homedirectory,
        ipasshpubkey: newUser.ipasshpubkey,
        usercertificate: newUser.usercertificate,
        ipacertmapdata: newUser.ipacertmapdata,
        ipauserauthtype: newUser.ipauserauthtype,
        ipatokenradiusconfiglink: newUser.ipatokenradiusconfiglink,
        ipatokenradiususername: newUser.ipatokenradiususername,
        ipaidpconfiglink: newUser.ipaidpconfiglink,
        ipaidpsub: newUser.ipaidpsub,
        // pwpolicy
        krbmaxpwdlife: newUser.krbmaxpwdlife,
        krbminpwdlife: newUser.krbminpwdlife,
        krbpwdhistorylength: newUser.krbpwdhistorylength,
        krbpwdmindiffchars: newUser.krbpwdmindiffchars,
        krbpwdminlength: newUser.krbpwdminlength,
        krbpwdmaxfailure: newUser.krbpwdmaxfailure,
        krbpwdfailurecountinterval: newUser.krbpwdfailurecountinterval,
        krbpwdlockoutduration: newUser.krbpwdlockoutduration,
        passwordgracelimit: newUser.passwordgracelimit,
        // krbtpolicy
        krbmaxrenewableage: newUser.krbmaxrenewableage,
        krbmaxticketlife: newUser.krbmaxticketlife,
        // contact
        mail: newUser.mail,
        telephonenumber: newUser.telephonenumber,
        pager: newUser.pager,
        mobile: newUser.mobile,
        facsimiletelephonenumber: newUser.facsimiletelephonenumber,
        // mailing
        street: newUser.street,
        l: newUser.l,
        st: newUser.st,
        postalcode: newUser.postalcode,
        // employee
        ou: newUser.ou,
        manager: newUser.manager,
        departmentnumber: newUser.departmentnumber,
        employeenumber: newUser.employeenumber,
        employeetype: newUser.employeetype,
        preferredlanguage: newUser.preferredlanguage,
        // misc
        carlicense: newUser.carlicense,
        // smb_attributes
        ipantlogonscript: newUser.ipantlogonscript,
        ipantprofilepath: newUser.ipantprofilepath,
        ipanthomedirectory: newUser.ipanthomedirectory,
        ipanthomedirectorydrive: newUser.ipanthomedirectorydrive,
        // 'Member of' data
        memberof_group: newUser.memberof_group,
        // 'Managed by' data
        mepmanagedentry: newUser.mepmanagedentry,
        // other
        cn: newUser.cn,
        krbcanonicalname: newUser.krbcanonicalname,
        nsaccountlock: newUser.nsaccountlock,
        objectclass: newUser.objectclass,
        ipauniqueid: newUser.ipauniqueid,
        ipantsecurityidentifier: newUser.ipantsecurityidentifier,
        attributelevelrights: newUser.attributelevelrights,
        has_keytab: newUser.has_keytab,
        preserved: newUser.preserved,
        dn: newUser.dn,
        sshpubkeyfp: newUser.sshpubkeyfp,
        krbextradata: newUser.krbextradata,
        krblastadminunlock: newUser.krblastadminunlock,
        krblastfailedauth: newUser.krblastfailedauth,
        krblastpwdchange: newUser.krblastpwdchange,
        krbloginfailedcount: newUser.krbloginfailedcount,
      });
      // Update json file
    },
    removeUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const updatedUserList = state.usersList.filter(
        (user) => user.uid !== userId
      );
      // If not empty, replace userList by new array
      if (updatedUserList) {
        state.usersList = updatedUserList;
        // Update json file
      }
    },
    changeStatus: (state, action: PayloadAction<ChangeStatusData>) => {
      const newStatus = action.payload.newStatus;
      const selectedUsersIds = action.payload.selectedUsers;
      let selectedUsersCount = selectedUsersIds.length;

      // Retrieve users
      for (let i = 0; i < selectedUsersIds.length; i++) {
        for (let j = 0; j < state.usersList.length; j++) {
          if (selectedUsersCount > 0) {
            // Find User by userId
            if (selectedUsersIds[i] === state.usersList[j].uid) {
              // Update the status only
              const updatedUser = {
                // identity
                title: state.usersList[j].title,
                givenname: state.usersList[j].givenname,
                sn: state.usersList[j].sn,
                displayname: state.usersList[j].displayname,
                initials: state.usersList[j].initials,
                gecos: state.usersList[j].gecos,
                userclass: state.usersList[j].userclass,
                // account
                uid: state.usersList[j].uid,
                has_password: state.usersList[j].has_password,
                krbpasswordexpiration: state.usersList[j].krbpasswordexpiration,
                uidnumber: state.usersList[j].uidnumber,
                gidnumber: state.usersList[j].gidnumber,
                krbprincipalname: state.usersList[j].krbprincipalname,
                krbprincipalexpiration:
                  state.usersList[j].krbprincipalexpiration,
                loginshell: state.usersList[j].loginshell,
                homedirectory: state.usersList[j].homedirectory,
                ipasshpubkey: state.usersList[j].ipasshpubkey,
                usercertificate: state.usersList[j].usercertificate,
                ipacertmapdata: state.usersList[j].ipacertmapdata,
                ipauserauthtype: state.usersList[j].ipauserauthtype,
                ipatokenradiusconfiglink:
                  state.usersList[j].ipatokenradiusconfiglink,
                ipatokenradiususername:
                  state.usersList[j].ipatokenradiususername,
                ipaidpconfiglink: state.usersList[j].ipaidpconfiglink,
                ipaidpsub: state.usersList[j].ipaidpsub,
                // pwpolicy
                krbmaxpwdlife: state.usersList[j].krbmaxpwdlife,
                krbminpwdlife: state.usersList[j].krbminpwdlife,
                krbpwdhistorylength: state.usersList[j].krbpwdhistorylength,
                krbpwdmindiffchars: state.usersList[j].krbpwdmindiffchars,
                krbpwdminlength: state.usersList[j].krbpwdminlength,
                krbpwdmaxfailure: state.usersList[j].krbpwdmaxfailure,
                krbpwdfailurecountinterval:
                  state.usersList[j].krbpwdfailurecountinterval,
                krbpwdlockoutduration: state.usersList[j].krbpwdlockoutduration,
                passwordgracelimit: state.usersList[j].passwordgracelimit,
                // krbtpolicy
                krbmaxrenewableage: state.usersList[j].krbmaxrenewableage,
                krbmaxticketlife: state.usersList[j].krbmaxticketlife,
                // contact
                mail: state.usersList[j].mail,
                telephonenumber: state.usersList[j].telephonenumber,
                pager: state.usersList[j].pager,
                mobile: state.usersList[j].mobile,
                facsimiletelephonenumber:
                  state.usersList[j].facsimiletelephonenumber,
                // mailing
                street: state.usersList[j].street,
                l: state.usersList[j].l,
                st: state.usersList[j].st,
                postalcode: state.usersList[j].postalcode,
                // employee
                ou: state.usersList[j].ou,
                manager: state.usersList[j].manager,
                departmentnumber: state.usersList[j].departmentnumber,
                employeenumber: state.usersList[j].employeenumber,
                employeetype: state.usersList[j].employeetype,
                preferredlanguage: state.usersList[j].preferredlanguage,
                // misc
                carlicense: state.usersList[j].carlicense,
                // smb_attributes
                ipantlogonscript: state.usersList[j].ipantlogonscript,
                ipantprofilepath: state.usersList[j].ipantprofilepath,
                ipanthomedirectory: state.usersList[j].ipanthomedirectory,
                ipanthomedirectorydrive:
                  state.usersList[j].ipanthomedirectorydrive,
                // 'Member of' data
                memberof_group: state.usersList[j].memberof_group,
                // other
                cn: state.usersList[j].cn,
                krbcanonicalname: state.usersList[j].krbcanonicalname,
                nsaccountlock: newStatus,
                objectclass: state.usersList[j].objectclass,
                ipauniqueid: state.usersList[j].ipauniqueid,
                mepmanagedentry: state.usersList[j].mepmanagedentry,
                ipantsecurityidentifier:
                  state.usersList[j].ipantsecurityidentifier,
                attributelevelrights: state.usersList[j].attributelevelrights,
                has_keytab: state.usersList[j].has_keytab,
                preserved: state.usersList[j].preserved,
                dn: state.usersList[j].dn,
                sshpubkeyfp: state.usersList[j].sshpubkeyfp,
                krbextradata: state.usersList[j].krbextradata,
                krblastadminunlock: state.usersList[j].krblastadminunlock,
                krblastfailedauth: state.usersList[j].krblastfailedauth,
                krblastpwdchange: state.usersList[j].krblastpwdchange,
                krbloginfailedcount: state.usersList[j].krbloginfailedcount,
              };
              // Replace entry
              state.usersList[j] = updatedUser;
              selectedUsersCount--;
            }
          } else {
            // When all ocurrences in selectedUsers array are found, nothing else to search
            break;
          }
        }
      }
    },
  },
});

export const { updateUsersList, addUser, removeUser, changeStatus } =
  preservedUsersSlice.actions;
export const selectUsers = (state: RootState) =>
  state.preservedUsers.usersList as User[];
export default preservedUsersSlice.reducer;
