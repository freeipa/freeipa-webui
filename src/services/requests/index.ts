import {
  AciAddArgs,
  AciAddOptions,
  AciDelArgs,
  AciDelOptions,
  AciFindArgs,
  AciFindOptions,
  AciModArgs,
  AciModOptions,
  AciRenameArgs,
  AciRenameOptions,
  AciShowArgs,
  AciShowOptions,
} from "./aci";
import {
  AutomemberAddArgs,
  AutomemberAddOptions,
  AutomemberAddConditionArgs,
  AutomemberAddConditionOptions,
  AutomemberDefaultGroupRemoveArgs,
  AutomemberDefaultGroupRemoveOptions,
  AutomemberDefaultGroupSetArgs,
  AutomemberDefaultGroupSetOptions,
  AutomemberDefaultGroupShowArgs,
  AutomemberDefaultGroupShowOptions,
  AutomemberDelArgs,
  AutomemberDelOptions,
  AutomemberFindArgs,
  AutomemberFindOptions,
  AutomemberFindOrphansArgs,
  AutomemberFindOrphansOptions,
  AutomemberModArgs,
  AutomemberModOptions,
  AutomemberRebuildArgs,
  AutomemberRebuildOptions,
  AutomemberRemoveConditionArgs,
  AutomemberRemoveConditionOptions,
  AutomemberShowArgs,
  AutomemberShowOptions,
} from "./automember";
import {
  AutomountkeyAddArgs,
  AutomountkeyAddOptions,
  AutomountkeyDelArgs,
  AutomountkeyDelOptions,
  AutomountkeyFindArgs,
  AutomountkeyFindOptions,
  AutomountkeyModArgs,
  AutomountkeyModOptions,
  AutomountkeyShowArgs,
  AutomountkeyShowOptions,
} from "./automountkey";
import {
  AutomountlocationAddArgs,
  AutomountlocationAddOptions,
  AutomountlocationDelArgs,
  AutomountlocationDelOptions,
  AutomountlocationFindArgs,
  AutomountlocationFindOptions,
  AutomountlocationShowArgs,
  AutomountlocationShowOptions,
  AutomountlocationTofilesArgs,
  AutomountlocationTofilesOptions,
} from "./automountlocation";
import {
  AutomountmapAddArgs,
  AutomountmapAddOptions,
  AutomountmapAddIndirectArgs,
  AutomountmapAddIndirectOptions,
  AutomountmapDelArgs,
  AutomountmapDelOptions,
  AutomountmapFindArgs,
  AutomountmapFindOptions,
  AutomountmapModArgs,
  AutomountmapModOptions,
  AutomountmapShowArgs,
  AutomountmapShowOptions,
} from "./automountmap";
import {
  CaAddArgs,
  CaAddOptions,
  CaDelArgs,
  CaDelOptions,
  CaDisableArgs,
  CaDisableOptions,
  CaEnableArgs,
  CaEnableOptions,
  CaFindArgs,
  CaFindOptions,
  CaIsEnabledArgs,
  CaIsEnabledOptions,
  CaModArgs,
  CaModOptions,
  CaShowArgs,
  CaShowOptions,
} from "./ca";
import {
  CaaclAddArgs,
  CaaclAddOptions,
  CaaclAddCaArgs,
  CaaclAddCaOptions,
  CaaclAddHostArgs,
  CaaclAddHostOptions,
  CaaclAddProfileArgs,
  CaaclAddProfileOptions,
  CaaclAddServiceArgs,
  CaaclAddServiceOptions,
  CaaclAddUserArgs,
  CaaclAddUserOptions,
  CaaclDelArgs,
  CaaclDelOptions,
  CaaclDisableArgs,
  CaaclDisableOptions,
  CaaclEnableArgs,
  CaaclEnableOptions,
  CaaclFindArgs,
  CaaclFindOptions,
  CaaclModArgs,
  CaaclModOptions,
  CaaclRemoveCaArgs,
  CaaclRemoveCaOptions,
  CaaclRemoveHostArgs,
  CaaclRemoveHostOptions,
  CaaclRemoveProfileArgs,
  CaaclRemoveProfileOptions,
  CaaclRemoveServiceArgs,
  CaaclRemoveServiceOptions,
  CaaclRemoveUserArgs,
  CaaclRemoveUserOptions,
  CaaclShowArgs,
  CaaclShowOptions,
} from "./caacl";
import {
  CertFindArgs,
  CertFindOptions,
  CertRemoveHoldArgs,
  CertRemoveHoldOptions,
  CertRequestArgs,
  CertRequestOptions,
  CertRevokeArgs,
  CertRevokeOptions,
  CertShowArgs,
  CertShowOptions,
  CertStatusArgs,
  CertStatusOptions,
} from "./cert";
import { CertmapMatchArgs, CertmapMatchOptions } from "./certmap";
import {
  CertmapconfigModArgs,
  CertmapconfigModOptions,
  CertmapconfigShowArgs,
  CertmapconfigShowOptions,
} from "./certmapconfig";
import {
  CertmapruleAddArgs,
  CertmapruleAddOptions,
  CertmapruleDelArgs,
  CertmapruleDelOptions,
  CertmapruleDisableArgs,
  CertmapruleDisableOptions,
  CertmapruleEnableArgs,
  CertmapruleEnableOptions,
  CertmapruleFindArgs,
  CertmapruleFindOptions,
  CertmapruleModArgs,
  CertmapruleModOptions,
  CertmapruleShowArgs,
  CertmapruleShowOptions,
} from "./certmaprule";
import {
  CertprofileDelArgs,
  CertprofileDelOptions,
  CertprofileFindArgs,
  CertprofileFindOptions,
  CertprofileImportArgs,
  CertprofileImportOptions,
  CertprofileModArgs,
  CertprofileModOptions,
  CertprofileShowArgs,
  CertprofileShowOptions,
} from "./certprofile";
import {
  ClassFindArgs,
  ClassFindOptions,
  ClassShowArgs,
  ClassShowOptions,
} from "./class";
import {
  CommandDefaultsArgs,
  CommandDefaultsOptions,
  CommandFindArgs,
  CommandFindOptions,
  CommandShowArgs,
  CommandShowOptions,
} from "./command";
import {
  ConfigModArgs,
  ConfigModOptions,
  ConfigShowArgs,
  ConfigShowOptions,
} from "./config";
import {
  CosentryAddArgs,
  CosentryAddOptions,
  CosentryDelArgs,
  CosentryDelOptions,
  CosentryFindArgs,
  CosentryFindOptions,
  CosentryModArgs,
  CosentryModOptions,
  CosentryShowArgs,
  CosentryShowOptions,
} from "./cosentry";
import {
  DelegationAddArgs,
  DelegationAddOptions,
  DelegationDelArgs,
  DelegationDelOptions,
  DelegationFindArgs,
  DelegationFindOptions,
  DelegationModArgs,
  DelegationModOptions,
  DelegationShowArgs,
  DelegationShowOptions,
} from "./delegation";
import {
  DnsIsEnabledArgs,
  DnsIsEnabledOptions,
  DnsResolveArgs,
  DnsResolveOptions,
  DnsUpdateSystemRecordsArgs,
  DnsUpdateSystemRecordsOptions,
} from "./dns";
import {
  DnsconfigModArgs,
  DnsconfigModOptions,
  DnsconfigShowArgs,
  DnsconfigShowOptions,
} from "./dnsconfig";
import {
  DnsforwardzoneAddArgs,
  DnsforwardzoneAddOptions,
  DnsforwardzoneAddPermissionArgs,
  DnsforwardzoneAddPermissionOptions,
  DnsforwardzoneDelArgs,
  DnsforwardzoneDelOptions,
  DnsforwardzoneDisableArgs,
  DnsforwardzoneDisableOptions,
  DnsforwardzoneEnableArgs,
  DnsforwardzoneEnableOptions,
  DnsforwardzoneFindArgs,
  DnsforwardzoneFindOptions,
  DnsforwardzoneModArgs,
  DnsforwardzoneModOptions,
  DnsforwardzoneRemovePermissionArgs,
  DnsforwardzoneRemovePermissionOptions,
  DnsforwardzoneShowArgs,
  DnsforwardzoneShowOptions,
} from "./dnsforwardzone";
import {
  DnsrecordAddArgs,
  DnsrecordAddOptions,
  DnsrecordDelArgs,
  DnsrecordDelOptions,
  DnsrecordDelentryArgs,
  DnsrecordDelentryOptions,
  DnsrecordFindArgs,
  DnsrecordFindOptions,
  DnsrecordModArgs,
  DnsrecordModOptions,
  DnsrecordShowArgs,
  DnsrecordShowOptions,
  DnsrecordSplitPartsArgs,
  DnsrecordSplitPartsOptions,
} from "./dnsrecord";
import {
  DnsserverFindArgs,
  DnsserverFindOptions,
  DnsserverModArgs,
  DnsserverModOptions,
  DnsserverShowArgs,
  DnsserverShowOptions,
} from "./dnsserver";
import {
  DnszoneAddArgs,
  DnszoneAddOptions,
  DnszoneAddPermissionArgs,
  DnszoneAddPermissionOptions,
  DnszoneDelArgs,
  DnszoneDelOptions,
  DnszoneDisableArgs,
  DnszoneDisableOptions,
  DnszoneEnableArgs,
  DnszoneEnableOptions,
  DnszoneFindArgs,
  DnszoneFindOptions,
  DnszoneModArgs,
  DnszoneModOptions,
  DnszoneRemovePermissionArgs,
  DnszoneRemovePermissionOptions,
  DnszoneShowArgs,
  DnszoneShowOptions,
} from "./dnszone";
import {
  GroupAddArgs,
  GroupAddOptions,
  GroupAddMemberArgs,
  GroupAddMemberOptions,
  GroupAddMemberManagerArgs,
  GroupAddMemberManagerOptions,
  GroupDelArgs,
  GroupDelOptions,
  GroupDetachArgs,
  GroupDetachOptions,
  GroupFindArgs,
  GroupFindOptions,
  GroupModArgs,
  GroupModOptions,
  GroupRemoveMemberArgs,
  GroupRemoveMemberOptions,
  GroupRemoveMemberManagerArgs,
  GroupRemoveMemberManagerOptions,
  GroupShowArgs,
  GroupShowOptions,
} from "./group";
import {
  HbacruleAddArgs,
  HbacruleAddOptions,
  HbacruleAddHostArgs,
  HbacruleAddHostOptions,
  HbacruleAddServiceArgs,
  HbacruleAddServiceOptions,
  HbacruleAddSourcehostArgs,
  HbacruleAddSourcehostOptions,
  HbacruleAddUserArgs,
  HbacruleAddUserOptions,
  HbacruleDelArgs,
  HbacruleDelOptions,
  HbacruleDisableArgs,
  HbacruleDisableOptions,
  HbacruleEnableArgs,
  HbacruleEnableOptions,
  HbacruleFindArgs,
  HbacruleFindOptions,
  HbacruleModArgs,
  HbacruleModOptions,
  HbacruleRemoveHostArgs,
  HbacruleRemoveHostOptions,
  HbacruleRemoveServiceArgs,
  HbacruleRemoveServiceOptions,
  HbacruleRemoveSourcehostArgs,
  HbacruleRemoveSourcehostOptions,
  HbacruleRemoveUserArgs,
  HbacruleRemoveUserOptions,
  HbacruleShowArgs,
  HbacruleShowOptions,
} from "./hbacrule";
import {
  HbacsvcAddArgs,
  HbacsvcAddOptions,
  HbacsvcDelArgs,
  HbacsvcDelOptions,
  HbacsvcFindArgs,
  HbacsvcFindOptions,
  HbacsvcModArgs,
  HbacsvcModOptions,
  HbacsvcShowArgs,
  HbacsvcShowOptions,
} from "./hbacsvc";
import {
  HbacsvcgroupAddArgs,
  HbacsvcgroupAddOptions,
  HbacsvcgroupAddMemberArgs,
  HbacsvcgroupAddMemberOptions,
  HbacsvcgroupDelArgs,
  HbacsvcgroupDelOptions,
  HbacsvcgroupFindArgs,
  HbacsvcgroupFindOptions,
  HbacsvcgroupModArgs,
  HbacsvcgroupModOptions,
  HbacsvcgroupRemoveMemberArgs,
  HbacsvcgroupRemoveMemberOptions,
  HbacsvcgroupShowArgs,
  HbacsvcgroupShowOptions,
} from "./hbacsvcgroup";
import {
  HostAddArgs,
  HostAddOptions,
  HostAddCertArgs,
  HostAddCertOptions,
  HostAddDelegationArgs,
  HostAddDelegationOptions,
  HostAddManagedbyArgs,
  HostAddManagedbyOptions,
  HostAddPrincipalArgs,
  HostAddPrincipalOptions,
  HostAllowAddDelegationArgs,
  HostAllowAddDelegationOptions,
  HostAllowCreateKeytabArgs,
  HostAllowCreateKeytabOptions,
  HostAllowRetrieveKeytabArgs,
  HostAllowRetrieveKeytabOptions,
  HostDelArgs,
  HostDelOptions,
  HostDisableArgs,
  HostDisableOptions,
  HostDisallowAddDelegationArgs,
  HostDisallowAddDelegationOptions,
  HostDisallowCreateKeytabArgs,
  HostDisallowCreateKeytabOptions,
  HostDisallowRetrieveKeytabArgs,
  HostDisallowRetrieveKeytabOptions,
  HostFindArgs,
  HostFindOptions,
  HostModArgs,
  HostModOptions,
  HostRemoveCertArgs,
  HostRemoveCertOptions,
  HostRemoveDelegationArgs,
  HostRemoveDelegationOptions,
  HostRemoveManagedbyArgs,
  HostRemoveManagedbyOptions,
  HostRemovePrincipalArgs,
  HostRemovePrincipalOptions,
  HostShowArgs,
  HostShowOptions,
} from "./host";
import {
  HostgroupAddArgs,
  HostgroupAddOptions,
  HostgroupAddMemberArgs,
  HostgroupAddMemberOptions,
  HostgroupAddMemberManagerArgs,
  HostgroupAddMemberManagerOptions,
  HostgroupDelArgs,
  HostgroupDelOptions,
  HostgroupFindArgs,
  HostgroupFindOptions,
  HostgroupModArgs,
  HostgroupModOptions,
  HostgroupRemoveMemberArgs,
  HostgroupRemoveMemberOptions,
  HostgroupRemoveMemberManagerArgs,
  HostgroupRemoveMemberManagerOptions,
  HostgroupShowArgs,
  HostgroupShowOptions,
} from "./hostgroup";
import {
  IdoverridegroupAddArgs,
  IdoverridegroupAddOptions,
  IdoverridegroupDelArgs,
  IdoverridegroupDelOptions,
  IdoverridegroupFindArgs,
  IdoverridegroupFindOptions,
  IdoverridegroupModArgs,
  IdoverridegroupModOptions,
  IdoverridegroupShowArgs,
  IdoverridegroupShowOptions,
} from "./idoverridegroup";
import {
  IdoverrideuserAddArgs,
  IdoverrideuserAddOptions,
  IdoverrideuserAddCertArgs,
  IdoverrideuserAddCertOptions,
  IdoverrideuserDelArgs,
  IdoverrideuserDelOptions,
  IdoverrideuserFindArgs,
  IdoverrideuserFindOptions,
  IdoverrideuserModArgs,
  IdoverrideuserModOptions,
  IdoverrideuserRemoveCertArgs,
  IdoverrideuserRemoveCertOptions,
  IdoverrideuserShowArgs,
  IdoverrideuserShowOptions,
} from "./idoverrideuser";
import {
  IdpAddArgs,
  IdpAddOptions,
  IdpDelArgs,
  IdpDelOptions,
  IdpFindArgs,
  IdpFindOptions,
  IdpModArgs,
  IdpModOptions,
  IdpShowArgs,
  IdpShowOptions,
} from "./idp";
import {
  IdrangeAddArgs,
  IdrangeAddOptions,
  IdrangeDelArgs,
  IdrangeDelOptions,
  IdrangeFindArgs,
  IdrangeFindOptions,
  IdrangeModArgs,
  IdrangeModOptions,
  IdrangeShowArgs,
  IdrangeShowOptions,
} from "./idrange";
import {
  IdviewAddArgs,
  IdviewAddOptions,
  IdviewApplyArgs,
  IdviewApplyOptions,
  IdviewDelArgs,
  IdviewDelOptions,
  IdviewFindArgs,
  IdviewFindOptions,
  IdviewModArgs,
  IdviewModOptions,
  IdviewShowArgs,
  IdviewShowOptions,
  IdviewUnapplyArgs,
  IdviewUnapplyOptions,
} from "./idview";
import {
  KrbtpolicyModArgs,
  KrbtpolicyModOptions,
  KrbtpolicyResetArgs,
  KrbtpolicyResetOptions,
  KrbtpolicyShowArgs,
  KrbtpolicyShowOptions,
} from "./krbtpolicy";
import {
  LocationAddArgs,
  LocationAddOptions,
  LocationDelArgs,
  LocationDelOptions,
  LocationFindArgs,
  LocationFindOptions,
  LocationModArgs,
  LocationModOptions,
  LocationShowArgs,
  LocationShowOptions,
} from "./location";
import {
  NetgroupAddArgs,
  NetgroupAddOptions,
  NetgroupAddMemberArgs,
  NetgroupAddMemberOptions,
  NetgroupDelArgs,
  NetgroupDelOptions,
  NetgroupFindArgs,
  NetgroupFindOptions,
  NetgroupModArgs,
  NetgroupModOptions,
  NetgroupRemoveMemberArgs,
  NetgroupRemoveMemberOptions,
  NetgroupShowArgs,
  NetgroupShowOptions,
} from "./netgroup";
import {
  OtpconfigModArgs,
  OtpconfigModOptions,
  OtpconfigShowArgs,
  OtpconfigShowOptions,
} from "./otpconfig";
import {
  OtptokenAddArgs,
  OtptokenAddOptions,
  OtptokenAddManagedbyArgs,
  OtptokenAddManagedbyOptions,
  OtptokenDelArgs,
  OtptokenDelOptions,
  OtptokenFindArgs,
  OtptokenFindOptions,
  OtptokenModArgs,
  OtptokenModOptions,
  OtptokenRemoveManagedbyArgs,
  OtptokenRemoveManagedbyOptions,
  OtptokenShowArgs,
  OtptokenShowOptions,
} from "./otptoken";
import {
  OutputFindArgs,
  OutputFindOptions,
  OutputShowArgs,
  OutputShowOptions,
} from "./output";
import {
  ParamFindArgs,
  ParamFindOptions,
  ParamShowArgs,
  ParamShowOptions,
} from "./param";
import {
  PasskeyconfigModArgs,
  PasskeyconfigModOptions,
  PasskeyconfigShowArgs,
  PasskeyconfigShowOptions,
} from "./passkeyconfig";
import {
  PermissionAddArgs,
  PermissionAddOptions,
  PermissionAddMemberArgs,
  PermissionAddMemberOptions,
  PermissionAddNoaciArgs,
  PermissionAddNoaciOptions,
  PermissionDelArgs,
  PermissionDelOptions,
  PermissionFindArgs,
  PermissionFindOptions,
  PermissionModArgs,
  PermissionModOptions,
  PermissionRemoveMemberArgs,
  PermissionRemoveMemberOptions,
  PermissionShowArgs,
  PermissionShowOptions,
} from "./permission";
import { PkinitStatusArgs, PkinitStatusOptions } from "./pkinit";
import {
  PrivilegeAddArgs,
  PrivilegeAddOptions,
  PrivilegeAddMemberArgs,
  PrivilegeAddMemberOptions,
  PrivilegeAddPermissionArgs,
  PrivilegeAddPermissionOptions,
  PrivilegeDelArgs,
  PrivilegeDelOptions,
  PrivilegeFindArgs,
  PrivilegeFindOptions,
  PrivilegeModArgs,
  PrivilegeModOptions,
  PrivilegeRemoveMemberArgs,
  PrivilegeRemoveMemberOptions,
  PrivilegeRemovePermissionArgs,
  PrivilegeRemovePermissionOptions,
  PrivilegeShowArgs,
  PrivilegeShowOptions,
} from "./privilege";
import {
  PwpolicyAddArgs,
  PwpolicyAddOptions,
  PwpolicyDelArgs,
  PwpolicyDelOptions,
  PwpolicyFindArgs,
  PwpolicyFindOptions,
  PwpolicyModArgs,
  PwpolicyModOptions,
  PwpolicyShowArgs,
  PwpolicyShowOptions,
} from "./pwpolicy";
import {
  RadiusproxyAddArgs,
  RadiusproxyAddOptions,
  RadiusproxyDelArgs,
  RadiusproxyDelOptions,
  RadiusproxyFindArgs,
  RadiusproxyFindOptions,
  RadiusproxyModArgs,
  RadiusproxyModOptions,
  RadiusproxyShowArgs,
  RadiusproxyShowOptions,
} from "./radiusproxy";
import {
  RealmdomainsModArgs,
  RealmdomainsModOptions,
  RealmdomainsShowArgs,
  RealmdomainsShowOptions,
} from "./realmdomains";
import {
  RoleAddArgs,
  RoleAddOptions,
  RoleAddMemberArgs,
  RoleAddMemberOptions,
  RoleAddPrivilegeArgs,
  RoleAddPrivilegeOptions,
  RoleDelArgs,
  RoleDelOptions,
  RoleFindArgs,
  RoleFindOptions,
  RoleModArgs,
  RoleModOptions,
  RoleRemoveMemberArgs,
  RoleRemoveMemberOptions,
  RoleRemovePrivilegeArgs,
  RoleRemovePrivilegeOptions,
  RoleShowArgs,
  RoleShowOptions,
} from "./role";
import {
  SelfserviceAddArgs,
  SelfserviceAddOptions,
  SelfserviceDelArgs,
  SelfserviceDelOptions,
  SelfserviceFindArgs,
  SelfserviceFindOptions,
  SelfserviceModArgs,
  SelfserviceModOptions,
  SelfserviceShowArgs,
  SelfserviceShowOptions,
} from "./selfservice";
import {
  SelinuxusermapAddArgs,
  SelinuxusermapAddOptions,
  SelinuxusermapAddHostArgs,
  SelinuxusermapAddHostOptions,
  SelinuxusermapAddUserArgs,
  SelinuxusermapAddUserOptions,
  SelinuxusermapDelArgs,
  SelinuxusermapDelOptions,
  SelinuxusermapDisableArgs,
  SelinuxusermapDisableOptions,
  SelinuxusermapEnableArgs,
  SelinuxusermapEnableOptions,
  SelinuxusermapFindArgs,
  SelinuxusermapFindOptions,
  SelinuxusermapModArgs,
  SelinuxusermapModOptions,
  SelinuxusermapRemoveHostArgs,
  SelinuxusermapRemoveHostOptions,
  SelinuxusermapRemoveUserArgs,
  SelinuxusermapRemoveUserOptions,
  SelinuxusermapShowArgs,
  SelinuxusermapShowOptions,
} from "./selinuxusermap";
import {
  ServerConncheckArgs,
  ServerConncheckOptions,
  ServerDelArgs,
  ServerDelOptions,
  ServerFindArgs,
  ServerFindOptions,
  ServerModArgs,
  ServerModOptions,
  ServerRoleFindArgs,
  ServerRoleFindOptions,
  ServerRoleShowArgs,
  ServerRoleShowOptions,
  ServerShowArgs,
  ServerShowOptions,
  ServerStateArgs,
  ServerStateOptions,
} from "./server";
import {
  ServiceAddArgs,
  ServiceAddOptions,
  ServiceAddCertArgs,
  ServiceAddCertOptions,
  ServiceAddDelegationArgs,
  ServiceAddDelegationOptions,
  ServiceAddHostArgs,
  ServiceAddHostOptions,
  ServiceAddPrincipalArgs,
  ServiceAddPrincipalOptions,
  ServiceAddSmbArgs,
  ServiceAddSmbOptions,
  ServiceAllowAddDelegationArgs,
  ServiceAllowAddDelegationOptions,
  ServiceAllowCreateKeytabArgs,
  ServiceAllowCreateKeytabOptions,
  ServiceAllowRetrieveKeytabArgs,
  ServiceAllowRetrieveKeytabOptions,
  ServiceDelArgs,
  ServiceDelOptions,
  ServiceDisableArgs,
  ServiceDisableOptions,
  ServiceDisallowAddDelegationArgs,
  ServiceDisallowAddDelegationOptions,
  ServiceDisallowCreateKeytabArgs,
  ServiceDisallowCreateKeytabOptions,
  ServiceDisallowRetrieveKeytabArgs,
  ServiceDisallowRetrieveKeytabOptions,
  ServiceFindArgs,
  ServiceFindOptions,
  ServiceModArgs,
  ServiceModOptions,
  ServiceRemoveCertArgs,
  ServiceRemoveCertOptions,
  ServiceRemoveDelegationArgs,
  ServiceRemoveDelegationOptions,
  ServiceRemoveHostArgs,
  ServiceRemoveHostOptions,
  ServiceRemovePrincipalArgs,
  ServiceRemovePrincipalOptions,
  ServiceShowArgs,
  ServiceShowOptions,
} from "./service";
import {
  ServicedelegationruleAddArgs,
  ServicedelegationruleAddOptions,
  ServicedelegationruleAddMemberArgs,
  ServicedelegationruleAddMemberOptions,
  ServicedelegationruleAddTargetArgs,
  ServicedelegationruleAddTargetOptions,
  ServicedelegationruleDelArgs,
  ServicedelegationruleDelOptions,
  ServicedelegationruleFindArgs,
  ServicedelegationruleFindOptions,
  ServicedelegationruleRemoveMemberArgs,
  ServicedelegationruleRemoveMemberOptions,
  ServicedelegationruleRemoveTargetArgs,
  ServicedelegationruleRemoveTargetOptions,
  ServicedelegationruleShowArgs,
  ServicedelegationruleShowOptions,
} from "./servicedelegationrule";
import {
  ServicedelegationtargetAddArgs,
  ServicedelegationtargetAddOptions,
  ServicedelegationtargetAddMemberArgs,
  ServicedelegationtargetAddMemberOptions,
  ServicedelegationtargetDelArgs,
  ServicedelegationtargetDelOptions,
  ServicedelegationtargetFindArgs,
  ServicedelegationtargetFindOptions,
  ServicedelegationtargetRemoveMemberArgs,
  ServicedelegationtargetRemoveMemberOptions,
  ServicedelegationtargetShowArgs,
  ServicedelegationtargetShowOptions,
} from "./servicedelegationtarget";
import {
  StageuserActivateArgs,
  StageuserActivateOptions,
  StageuserAddArgs,
  StageuserAddOptions,
  StageuserAddCertArgs,
  StageuserAddCertOptions,
  StageuserAddCertmapdataArgs,
  StageuserAddCertmapdataOptions,
  StageuserAddManagerArgs,
  StageuserAddManagerOptions,
  StageuserAddPasskeyArgs,
  StageuserAddPasskeyOptions,
  StageuserAddPrincipalArgs,
  StageuserAddPrincipalOptions,
  StageuserDelArgs,
  StageuserDelOptions,
  StageuserFindArgs,
  StageuserFindOptions,
  StageuserModArgs,
  StageuserModOptions,
  StageuserRemoveCertArgs,
  StageuserRemoveCertOptions,
  StageuserRemoveCertmapdataArgs,
  StageuserRemoveCertmapdataOptions,
  StageuserRemoveManagerArgs,
  StageuserRemoveManagerOptions,
  StageuserRemovePasskeyArgs,
  StageuserRemovePasskeyOptions,
  StageuserRemovePrincipalArgs,
  StageuserRemovePrincipalOptions,
  StageuserShowArgs,
  StageuserShowOptions,
} from "./stageuser";
import {
  SubidAddArgs,
  SubidAddOptions,
  SubidDelArgs,
  SubidDelOptions,
  SubidFindArgs,
  SubidFindOptions,
  SubidGenerateArgs,
  SubidGenerateOptions,
  SubidMatchArgs,
  SubidMatchOptions,
  SubidModArgs,
  SubidModOptions,
  SubidShowArgs,
  SubidShowOptions,
  SubidStatsArgs,
  SubidStatsOptions,
} from "./subid";
import {
  SudocmdAddArgs,
  SudocmdAddOptions,
  SudocmdDelArgs,
  SudocmdDelOptions,
  SudocmdFindArgs,
  SudocmdFindOptions,
  SudocmdModArgs,
  SudocmdModOptions,
  SudocmdShowArgs,
  SudocmdShowOptions,
} from "./sudocmd";
import {
  SudocmdgroupAddArgs,
  SudocmdgroupAddOptions,
  SudocmdgroupAddMemberArgs,
  SudocmdgroupAddMemberOptions,
  SudocmdgroupDelArgs,
  SudocmdgroupDelOptions,
  SudocmdgroupFindArgs,
  SudocmdgroupFindOptions,
  SudocmdgroupModArgs,
  SudocmdgroupModOptions,
  SudocmdgroupRemoveMemberArgs,
  SudocmdgroupRemoveMemberOptions,
  SudocmdgroupShowArgs,
  SudocmdgroupShowOptions,
} from "./sudocmdgroup";
import {
  SudoruleAddArgs,
  SudoruleAddOptions,
  SudoruleAddAllowCommandArgs,
  SudoruleAddAllowCommandOptions,
  SudoruleAddDenyCommandArgs,
  SudoruleAddDenyCommandOptions,
  SudoruleAddHostArgs,
  SudoruleAddHostOptions,
  SudoruleAddOptionArgs,
  SudoruleAddOptionOptions,
  SudoruleAddRunasgroupArgs,
  SudoruleAddRunasgroupOptions,
  SudoruleAddRunasuserArgs,
  SudoruleAddRunasuserOptions,
  SudoruleAddUserArgs,
  SudoruleAddUserOptions,
  SudoruleDelArgs,
  SudoruleDelOptions,
  SudoruleDisableArgs,
  SudoruleDisableOptions,
  SudoruleEnableArgs,
  SudoruleEnableOptions,
  SudoruleFindArgs,
  SudoruleFindOptions,
  SudoruleModArgs,
  SudoruleModOptions,
  SudoruleRemoveAllowCommandArgs,
  SudoruleRemoveAllowCommandOptions,
  SudoruleRemoveDenyCommandArgs,
  SudoruleRemoveDenyCommandOptions,
  SudoruleRemoveHostArgs,
  SudoruleRemoveHostOptions,
  SudoruleRemoveOptionArgs,
  SudoruleRemoveOptionOptions,
  SudoruleRemoveRunasgroupArgs,
  SudoruleRemoveRunasgroupOptions,
  SudoruleRemoveRunasuserArgs,
  SudoruleRemoveRunasuserOptions,
  SudoruleRemoveUserArgs,
  SudoruleRemoveUserOptions,
  SudoruleShowArgs,
  SudoruleShowOptions,
} from "./sudorule";
import {
  SysaccountAddArgs,
  SysaccountAddOptions,
  SysaccountDelArgs,
  SysaccountDelOptions,
  SysaccountDisableArgs,
  SysaccountDisableOptions,
  SysaccountEnableArgs,
  SysaccountEnableOptions,
  SysaccountFindArgs,
  SysaccountFindOptions,
  SysaccountModArgs,
  SysaccountModOptions,
  SysaccountPolicyArgs,
  SysaccountPolicyOptions,
  SysaccountShowArgs,
  SysaccountShowOptions,
} from "./sysaccount";
import {
  TopicFindArgs,
  TopicFindOptions,
  TopicShowArgs,
  TopicShowOptions,
} from "./topic";
import {
  TopologysegmentAddArgs,
  TopologysegmentAddOptions,
  TopologysegmentDelArgs,
  TopologysegmentDelOptions,
  TopologysegmentFindArgs,
  TopologysegmentFindOptions,
  TopologysegmentModArgs,
  TopologysegmentModOptions,
  TopologysegmentReinitializeArgs,
  TopologysegmentReinitializeOptions,
  TopologysegmentShowArgs,
  TopologysegmentShowOptions,
} from "./topologysegment";
import {
  TopologysuffixAddArgs,
  TopologysuffixAddOptions,
  TopologysuffixDelArgs,
  TopologysuffixDelOptions,
  TopologysuffixFindArgs,
  TopologysuffixFindOptions,
  TopologysuffixModArgs,
  TopologysuffixModOptions,
  TopologysuffixShowArgs,
  TopologysuffixShowOptions,
  TopologysuffixVerifyArgs,
  TopologysuffixVerifyOptions,
} from "./topologysuffix";
import {
  TrustAddArgs,
  TrustAddOptions,
  TrustDelArgs,
  TrustDelOptions,
  TrustEnableAgentArgs,
  TrustEnableAgentOptions,
  TrustFetchDomainsArgs,
  TrustFetchDomainsOptions,
  TrustFindArgs,
  TrustFindOptions,
  TrustModArgs,
  TrustModOptions,
  TrustResolveArgs,
  TrustResolveOptions,
  TrustShowArgs,
  TrustShowOptions,
} from "./trust";
import {
  TrustconfigModArgs,
  TrustconfigModOptions,
  TrustconfigShowArgs,
  TrustconfigShowOptions,
} from "./trustconfig";
import {
  TrustdomainAddArgs,
  TrustdomainAddOptions,
  TrustdomainDelArgs,
  TrustdomainDelOptions,
  TrustdomainDisableArgs,
  TrustdomainDisableOptions,
  TrustdomainEnableArgs,
  TrustdomainEnableOptions,
  TrustdomainFindArgs,
  TrustdomainFindOptions,
  TrustdomainModArgs,
  TrustdomainModOptions,
} from "./trustdomain";
import {
  UserAddArgs,
  UserAddOptions,
  UserAddCertArgs,
  UserAddCertOptions,
  UserAddCertmapdataArgs,
  UserAddCertmapdataOptions,
  UserAddManagerArgs,
  UserAddManagerOptions,
  UserAddPasskeyArgs,
  UserAddPasskeyOptions,
  UserAddPrincipalArgs,
  UserAddPrincipalOptions,
  UserDelArgs,
  UserDelOptions,
  UserDisableArgs,
  UserDisableOptions,
  UserEnableArgs,
  UserEnableOptions,
  UserFindArgs,
  UserFindOptions,
  UserModArgs,
  UserModOptions,
  UserRemoveCertArgs,
  UserRemoveCertOptions,
  UserRemoveCertmapdataArgs,
  UserRemoveCertmapdataOptions,
  UserRemoveManagerArgs,
  UserRemoveManagerOptions,
  UserRemovePasskeyArgs,
  UserRemovePasskeyOptions,
  UserRemovePrincipalArgs,
  UserRemovePrincipalOptions,
  UserShowArgs,
  UserShowOptions,
  UserStageArgs,
  UserStageOptions,
  UserStatusArgs,
  UserStatusOptions,
  UserUndelArgs,
  UserUndelOptions,
  UserUnlockArgs,
  UserUnlockOptions,
} from "./user";
import {
  AdtrustIsEnabledArgs,
  AdtrustIsEnabledOptions,
  BatchArgs,
  BatchOptions,
  CompatIsEnabledArgs,
  CompatIsEnabledOptions,
  DomainlevelGetArgs,
  DomainlevelGetOptions,
  DomainlevelSetArgs,
  DomainlevelSetOptions,
  EnvArgs,
  EnvOptions,
  HbactestArgs,
  HbactestOptions,
  I18nMessagesArgs,
  I18nMessagesOptions,
  JoinArgs,
  JoinOptions,
  JsonMetadataArgs,
  JsonMetadataOptions,
  KraIsEnabledArgs,
  KraIsEnabledOptions,
  MigrateDsArgs,
  MigrateDsOptions,
  PasswdArgs,
  PasswdOptions,
  PingArgs,
  PingOptions,
  PluginsArgs,
  PluginsOptions,
  SchemaArgs,
  SchemaOptions,
  SessionLogoutArgs,
  SessionLogoutOptions,
  SidgenWasRunArgs,
  SidgenWasRunOptions,
  WhoamiArgs,
  WhoamiOptions,
} from "./utils";
import {
  VaultAddInternalArgs,
  VaultAddInternalOptions,
  VaultAddMemberArgs,
  VaultAddMemberOptions,
  VaultAddOwnerArgs,
  VaultAddOwnerOptions,
  VaultArchiveInternalArgs,
  VaultArchiveInternalOptions,
  VaultDelArgs,
  VaultDelOptions,
  VaultFindArgs,
  VaultFindOptions,
  VaultModInternalArgs,
  VaultModInternalOptions,
  VaultRemoveMemberArgs,
  VaultRemoveMemberOptions,
  VaultRemoveOwnerArgs,
  VaultRemoveOwnerOptions,
  VaultRetrieveInternalArgs,
  VaultRetrieveInternalOptions,
  VaultShowArgs,
  VaultShowOptions,
} from "./vault";
import { VaultconfigShowArgs, VaultconfigShowOptions } from "./vaultconfig";
import {
  VaultcontainerAddOwnerArgs,
  VaultcontainerAddOwnerOptions,
  VaultcontainerDelArgs,
  VaultcontainerDelOptions,
  VaultcontainerRemoveOwnerArgs,
  VaultcontainerRemoveOwnerOptions,
  VaultcontainerShowArgs,
  VaultcontainerShowOptions,
} from "./vaultcontainer";

export type RequestMap = {
  aci_add: { args: AciAddArgs; options: AciAddOptions };
  aci_del: { args: AciDelArgs; options: AciDelOptions };
  aci_find: { args: AciFindArgs; options: AciFindOptions };
  aci_mod: { args: AciModArgs; options: AciModOptions };
  aci_rename: { args: AciRenameArgs; options: AciRenameOptions };
  aci_show: { args: AciShowArgs; options: AciShowOptions };
  adtrust_is_enabled: {
    args: AdtrustIsEnabledArgs;
    options: AdtrustIsEnabledOptions;
  };
  automember_add: { args: AutomemberAddArgs; options: AutomemberAddOptions };
  automember_add_condition: {
    args: AutomemberAddConditionArgs;
    options: AutomemberAddConditionOptions;
  };
  automember_default_group_remove: {
    args: AutomemberDefaultGroupRemoveArgs;
    options: AutomemberDefaultGroupRemoveOptions;
  };
  automember_default_group_set: {
    args: AutomemberDefaultGroupSetArgs;
    options: AutomemberDefaultGroupSetOptions;
  };
  automember_default_group_show: {
    args: AutomemberDefaultGroupShowArgs;
    options: AutomemberDefaultGroupShowOptions;
  };
  automember_del: { args: AutomemberDelArgs; options: AutomemberDelOptions };
  automember_find: { args: AutomemberFindArgs; options: AutomemberFindOptions };
  automember_find_orphans: {
    args: AutomemberFindOrphansArgs;
    options: AutomemberFindOrphansOptions;
  };
  automember_mod: { args: AutomemberModArgs; options: AutomemberModOptions };
  automember_rebuild: {
    args: AutomemberRebuildArgs;
    options: AutomemberRebuildOptions;
  };
  automember_remove_condition: {
    args: AutomemberRemoveConditionArgs;
    options: AutomemberRemoveConditionOptions;
  };
  automember_show: { args: AutomemberShowArgs; options: AutomemberShowOptions };
  automountkey_add: {
    args: AutomountkeyAddArgs;
    options: AutomountkeyAddOptions;
  };
  automountkey_del: {
    args: AutomountkeyDelArgs;
    options: AutomountkeyDelOptions;
  };
  automountkey_find: {
    args: AutomountkeyFindArgs;
    options: AutomountkeyFindOptions;
  };
  automountkey_mod: {
    args: AutomountkeyModArgs;
    options: AutomountkeyModOptions;
  };
  automountkey_show: {
    args: AutomountkeyShowArgs;
    options: AutomountkeyShowOptions;
  };
  automountlocation_add: {
    args: AutomountlocationAddArgs;
    options: AutomountlocationAddOptions;
  };
  automountlocation_del: {
    args: AutomountlocationDelArgs;
    options: AutomountlocationDelOptions;
  };
  automountlocation_find: {
    args: AutomountlocationFindArgs;
    options: AutomountlocationFindOptions;
  };
  automountlocation_show: {
    args: AutomountlocationShowArgs;
    options: AutomountlocationShowOptions;
  };
  automountlocation_tofiles: {
    args: AutomountlocationTofilesArgs;
    options: AutomountlocationTofilesOptions;
  };
  automountmap_add: {
    args: AutomountmapAddArgs;
    options: AutomountmapAddOptions;
  };
  automountmap_add_indirect: {
    args: AutomountmapAddIndirectArgs;
    options: AutomountmapAddIndirectOptions;
  };
  automountmap_del: {
    args: AutomountmapDelArgs;
    options: AutomountmapDelOptions;
  };
  automountmap_find: {
    args: AutomountmapFindArgs;
    options: AutomountmapFindOptions;
  };
  automountmap_mod: {
    args: AutomountmapModArgs;
    options: AutomountmapModOptions;
  };
  automountmap_show: {
    args: AutomountmapShowArgs;
    options: AutomountmapShowOptions;
  };
  batch: { args: BatchArgs; options: BatchOptions };
  ca_add: { args: CaAddArgs; options: CaAddOptions };
  ca_del: { args: CaDelArgs; options: CaDelOptions };
  ca_disable: { args: CaDisableArgs; options: CaDisableOptions };
  ca_enable: { args: CaEnableArgs; options: CaEnableOptions };
  ca_find: { args: CaFindArgs; options: CaFindOptions };
  ca_is_enabled: { args: CaIsEnabledArgs; options: CaIsEnabledOptions };
  ca_mod: { args: CaModArgs; options: CaModOptions };
  ca_show: { args: CaShowArgs; options: CaShowOptions };
  caacl_add: { args: CaaclAddArgs; options: CaaclAddOptions };
  caacl_add_ca: { args: CaaclAddCaArgs; options: CaaclAddCaOptions };
  caacl_add_host: { args: CaaclAddHostArgs; options: CaaclAddHostOptions };
  caacl_add_profile: {
    args: CaaclAddProfileArgs;
    options: CaaclAddProfileOptions;
  };
  caacl_add_service: {
    args: CaaclAddServiceArgs;
    options: CaaclAddServiceOptions;
  };
  caacl_add_user: { args: CaaclAddUserArgs; options: CaaclAddUserOptions };
  caacl_del: { args: CaaclDelArgs; options: CaaclDelOptions };
  caacl_disable: { args: CaaclDisableArgs; options: CaaclDisableOptions };
  caacl_enable: { args: CaaclEnableArgs; options: CaaclEnableOptions };
  caacl_find: { args: CaaclFindArgs; options: CaaclFindOptions };
  caacl_mod: { args: CaaclModArgs; options: CaaclModOptions };
  caacl_remove_ca: { args: CaaclRemoveCaArgs; options: CaaclRemoveCaOptions };
  caacl_remove_host: {
    args: CaaclRemoveHostArgs;
    options: CaaclRemoveHostOptions;
  };
  caacl_remove_profile: {
    args: CaaclRemoveProfileArgs;
    options: CaaclRemoveProfileOptions;
  };
  caacl_remove_service: {
    args: CaaclRemoveServiceArgs;
    options: CaaclRemoveServiceOptions;
  };
  caacl_remove_user: {
    args: CaaclRemoveUserArgs;
    options: CaaclRemoveUserOptions;
  };
  caacl_show: { args: CaaclShowArgs; options: CaaclShowOptions };
  cert_find: { args: CertFindArgs; options: CertFindOptions };
  cert_remove_hold: {
    args: CertRemoveHoldArgs;
    options: CertRemoveHoldOptions;
  };
  cert_request: { args: CertRequestArgs; options: CertRequestOptions };
  cert_revoke: { args: CertRevokeArgs; options: CertRevokeOptions };
  cert_show: { args: CertShowArgs; options: CertShowOptions };
  cert_status: { args: CertStatusArgs; options: CertStatusOptions };
  certmap_match: { args: CertmapMatchArgs; options: CertmapMatchOptions };
  certmapconfig_mod: {
    args: CertmapconfigModArgs;
    options: CertmapconfigModOptions;
  };
  certmapconfig_show: {
    args: CertmapconfigShowArgs;
    options: CertmapconfigShowOptions;
  };
  certmaprule_add: { args: CertmapruleAddArgs; options: CertmapruleAddOptions };
  certmaprule_del: { args: CertmapruleDelArgs; options: CertmapruleDelOptions };
  certmaprule_disable: {
    args: CertmapruleDisableArgs;
    options: CertmapruleDisableOptions;
  };
  certmaprule_enable: {
    args: CertmapruleEnableArgs;
    options: CertmapruleEnableOptions;
  };
  certmaprule_find: {
    args: CertmapruleFindArgs;
    options: CertmapruleFindOptions;
  };
  certmaprule_mod: { args: CertmapruleModArgs; options: CertmapruleModOptions };
  certmaprule_show: {
    args: CertmapruleShowArgs;
    options: CertmapruleShowOptions;
  };
  certprofile_del: { args: CertprofileDelArgs; options: CertprofileDelOptions };
  certprofile_find: {
    args: CertprofileFindArgs;
    options: CertprofileFindOptions;
  };
  certprofile_import: {
    args: CertprofileImportArgs;
    options: CertprofileImportOptions;
  };
  certprofile_mod: { args: CertprofileModArgs; options: CertprofileModOptions };
  certprofile_show: {
    args: CertprofileShowArgs;
    options: CertprofileShowOptions;
  };
  class_find: { args: ClassFindArgs; options: ClassFindOptions };
  class_show: { args: ClassShowArgs; options: ClassShowOptions };
  command_defaults: {
    args: CommandDefaultsArgs;
    options: CommandDefaultsOptions;
  };
  command_find: { args: CommandFindArgs; options: CommandFindOptions };
  command_show: { args: CommandShowArgs; options: CommandShowOptions };
  compat_is_enabled: {
    args: CompatIsEnabledArgs;
    options: CompatIsEnabledOptions;
  };
  config_mod: { args: ConfigModArgs; options: ConfigModOptions };
  config_show: { args: ConfigShowArgs; options: ConfigShowOptions };
  cosentry_add: { args: CosentryAddArgs; options: CosentryAddOptions };
  cosentry_del: { args: CosentryDelArgs; options: CosentryDelOptions };
  cosentry_find: { args: CosentryFindArgs; options: CosentryFindOptions };
  cosentry_mod: { args: CosentryModArgs; options: CosentryModOptions };
  cosentry_show: { args: CosentryShowArgs; options: CosentryShowOptions };
  delegation_add: { args: DelegationAddArgs; options: DelegationAddOptions };
  delegation_del: { args: DelegationDelArgs; options: DelegationDelOptions };
  delegation_find: { args: DelegationFindArgs; options: DelegationFindOptions };
  delegation_mod: { args: DelegationModArgs; options: DelegationModOptions };
  delegation_show: { args: DelegationShowArgs; options: DelegationShowOptions };
  dns_is_enabled: { args: DnsIsEnabledArgs; options: DnsIsEnabledOptions };
  dns_resolve: { args: DnsResolveArgs; options: DnsResolveOptions };
  dns_update_system_records: {
    args: DnsUpdateSystemRecordsArgs;
    options: DnsUpdateSystemRecordsOptions;
  };
  dnsconfig_mod: { args: DnsconfigModArgs; options: DnsconfigModOptions };
  dnsconfig_show: { args: DnsconfigShowArgs; options: DnsconfigShowOptions };
  dnsforwardzone_add: {
    args: DnsforwardzoneAddArgs;
    options: DnsforwardzoneAddOptions;
  };
  dnsforwardzone_add_permission: {
    args: DnsforwardzoneAddPermissionArgs;
    options: DnsforwardzoneAddPermissionOptions;
  };
  dnsforwardzone_del: {
    args: DnsforwardzoneDelArgs;
    options: DnsforwardzoneDelOptions;
  };
  dnsforwardzone_disable: {
    args: DnsforwardzoneDisableArgs;
    options: DnsforwardzoneDisableOptions;
  };
  dnsforwardzone_enable: {
    args: DnsforwardzoneEnableArgs;
    options: DnsforwardzoneEnableOptions;
  };
  dnsforwardzone_find: {
    args: DnsforwardzoneFindArgs;
    options: DnsforwardzoneFindOptions;
  };
  dnsforwardzone_mod: {
    args: DnsforwardzoneModArgs;
    options: DnsforwardzoneModOptions;
  };
  dnsforwardzone_remove_permission: {
    args: DnsforwardzoneRemovePermissionArgs;
    options: DnsforwardzoneRemovePermissionOptions;
  };
  dnsforwardzone_show: {
    args: DnsforwardzoneShowArgs;
    options: DnsforwardzoneShowOptions;
  };
  dnsrecord_add: { args: DnsrecordAddArgs; options: DnsrecordAddOptions };
  dnsrecord_del: { args: DnsrecordDelArgs; options: DnsrecordDelOptions };
  dnsrecord_delentry: {
    args: DnsrecordDelentryArgs;
    options: DnsrecordDelentryOptions;
  };
  dnsrecord_find: { args: DnsrecordFindArgs; options: DnsrecordFindOptions };
  dnsrecord_mod: { args: DnsrecordModArgs; options: DnsrecordModOptions };
  dnsrecord_show: { args: DnsrecordShowArgs; options: DnsrecordShowOptions };
  dnsrecord_split_parts: {
    args: DnsrecordSplitPartsArgs;
    options: DnsrecordSplitPartsOptions;
  };
  dnsserver_find: { args: DnsserverFindArgs; options: DnsserverFindOptions };
  dnsserver_mod: { args: DnsserverModArgs; options: DnsserverModOptions };
  dnsserver_show: { args: DnsserverShowArgs; options: DnsserverShowOptions };
  dnszone_add: { args: DnszoneAddArgs; options: DnszoneAddOptions };
  dnszone_add_permission: {
    args: DnszoneAddPermissionArgs;
    options: DnszoneAddPermissionOptions;
  };
  dnszone_del: { args: DnszoneDelArgs; options: DnszoneDelOptions };
  dnszone_disable: { args: DnszoneDisableArgs; options: DnszoneDisableOptions };
  dnszone_enable: { args: DnszoneEnableArgs; options: DnszoneEnableOptions };
  dnszone_find: { args: DnszoneFindArgs; options: DnszoneFindOptions };
  dnszone_mod: { args: DnszoneModArgs; options: DnszoneModOptions };
  dnszone_remove_permission: {
    args: DnszoneRemovePermissionArgs;
    options: DnszoneRemovePermissionOptions;
  };
  dnszone_show: { args: DnszoneShowArgs; options: DnszoneShowOptions };
  domainlevel_get: { args: DomainlevelGetArgs; options: DomainlevelGetOptions };
  domainlevel_set: { args: DomainlevelSetArgs; options: DomainlevelSetOptions };
  env: { args: EnvArgs; options: EnvOptions };
  group_add: { args: GroupAddArgs; options: GroupAddOptions };
  group_add_member: {
    args: GroupAddMemberArgs;
    options: GroupAddMemberOptions;
  };
  group_add_member_manager: {
    args: GroupAddMemberManagerArgs;
    options: GroupAddMemberManagerOptions;
  };
  group_del: { args: GroupDelArgs; options: GroupDelOptions };
  group_detach: { args: GroupDetachArgs; options: GroupDetachOptions };
  group_find: { args: GroupFindArgs; options: GroupFindOptions };
  group_mod: { args: GroupModArgs; options: GroupModOptions };
  group_remove_member: {
    args: GroupRemoveMemberArgs;
    options: GroupRemoveMemberOptions;
  };
  group_remove_member_manager: {
    args: GroupRemoveMemberManagerArgs;
    options: GroupRemoveMemberManagerOptions;
  };
  group_show: { args: GroupShowArgs; options: GroupShowOptions };
  hbacrule_add: { args: HbacruleAddArgs; options: HbacruleAddOptions };
  hbacrule_add_host: {
    args: HbacruleAddHostArgs;
    options: HbacruleAddHostOptions;
  };
  hbacrule_add_service: {
    args: HbacruleAddServiceArgs;
    options: HbacruleAddServiceOptions;
  };
  hbacrule_add_sourcehost: {
    args: HbacruleAddSourcehostArgs;
    options: HbacruleAddSourcehostOptions;
  };
  hbacrule_add_user: {
    args: HbacruleAddUserArgs;
    options: HbacruleAddUserOptions;
  };
  hbacrule_del: { args: HbacruleDelArgs; options: HbacruleDelOptions };
  hbacrule_disable: {
    args: HbacruleDisableArgs;
    options: HbacruleDisableOptions;
  };
  hbacrule_enable: { args: HbacruleEnableArgs; options: HbacruleEnableOptions };
  hbacrule_find: { args: HbacruleFindArgs; options: HbacruleFindOptions };
  hbacrule_mod: { args: HbacruleModArgs; options: HbacruleModOptions };
  hbacrule_remove_host: {
    args: HbacruleRemoveHostArgs;
    options: HbacruleRemoveHostOptions;
  };
  hbacrule_remove_service: {
    args: HbacruleRemoveServiceArgs;
    options: HbacruleRemoveServiceOptions;
  };
  hbacrule_remove_sourcehost: {
    args: HbacruleRemoveSourcehostArgs;
    options: HbacruleRemoveSourcehostOptions;
  };
  hbacrule_remove_user: {
    args: HbacruleRemoveUserArgs;
    options: HbacruleRemoveUserOptions;
  };
  hbacrule_show: { args: HbacruleShowArgs; options: HbacruleShowOptions };
  hbacsvc_add: { args: HbacsvcAddArgs; options: HbacsvcAddOptions };
  hbacsvc_del: { args: HbacsvcDelArgs; options: HbacsvcDelOptions };
  hbacsvc_find: { args: HbacsvcFindArgs; options: HbacsvcFindOptions };
  hbacsvc_mod: { args: HbacsvcModArgs; options: HbacsvcModOptions };
  hbacsvc_show: { args: HbacsvcShowArgs; options: HbacsvcShowOptions };
  hbacsvcgroup_add: {
    args: HbacsvcgroupAddArgs;
    options: HbacsvcgroupAddOptions;
  };
  hbacsvcgroup_add_member: {
    args: HbacsvcgroupAddMemberArgs;
    options: HbacsvcgroupAddMemberOptions;
  };
  hbacsvcgroup_del: {
    args: HbacsvcgroupDelArgs;
    options: HbacsvcgroupDelOptions;
  };
  hbacsvcgroup_find: {
    args: HbacsvcgroupFindArgs;
    options: HbacsvcgroupFindOptions;
  };
  hbacsvcgroup_mod: {
    args: HbacsvcgroupModArgs;
    options: HbacsvcgroupModOptions;
  };
  hbacsvcgroup_remove_member: {
    args: HbacsvcgroupRemoveMemberArgs;
    options: HbacsvcgroupRemoveMemberOptions;
  };
  hbacsvcgroup_show: {
    args: HbacsvcgroupShowArgs;
    options: HbacsvcgroupShowOptions;
  };
  hbactest: { args: HbactestArgs; options: HbactestOptions };
  host_add: { args: HostAddArgs; options: HostAddOptions };
  host_add_cert: { args: HostAddCertArgs; options: HostAddCertOptions };
  host_add_delegation: {
    args: HostAddDelegationArgs;
    options: HostAddDelegationOptions;
  };
  host_add_managedby: {
    args: HostAddManagedbyArgs;
    options: HostAddManagedbyOptions;
  };
  host_add_principal: {
    args: HostAddPrincipalArgs;
    options: HostAddPrincipalOptions;
  };
  host_allow_add_delegation: {
    args: HostAllowAddDelegationArgs;
    options: HostAllowAddDelegationOptions;
  };
  host_allow_create_keytab: {
    args: HostAllowCreateKeytabArgs;
    options: HostAllowCreateKeytabOptions;
  };
  host_allow_retrieve_keytab: {
    args: HostAllowRetrieveKeytabArgs;
    options: HostAllowRetrieveKeytabOptions;
  };
  host_del: { args: HostDelArgs; options: HostDelOptions };
  host_disable: { args: HostDisableArgs; options: HostDisableOptions };
  host_disallow_add_delegation: {
    args: HostDisallowAddDelegationArgs;
    options: HostDisallowAddDelegationOptions;
  };
  host_disallow_create_keytab: {
    args: HostDisallowCreateKeytabArgs;
    options: HostDisallowCreateKeytabOptions;
  };
  host_disallow_retrieve_keytab: {
    args: HostDisallowRetrieveKeytabArgs;
    options: HostDisallowRetrieveKeytabOptions;
  };
  host_find: { args: HostFindArgs; options: HostFindOptions };
  host_mod: { args: HostModArgs; options: HostModOptions };
  host_remove_cert: {
    args: HostRemoveCertArgs;
    options: HostRemoveCertOptions;
  };
  host_remove_delegation: {
    args: HostRemoveDelegationArgs;
    options: HostRemoveDelegationOptions;
  };
  host_remove_managedby: {
    args: HostRemoveManagedbyArgs;
    options: HostRemoveManagedbyOptions;
  };
  host_remove_principal: {
    args: HostRemovePrincipalArgs;
    options: HostRemovePrincipalOptions;
  };
  host_show: { args: HostShowArgs; options: HostShowOptions };
  hostgroup_add: { args: HostgroupAddArgs; options: HostgroupAddOptions };
  hostgroup_add_member: {
    args: HostgroupAddMemberArgs;
    options: HostgroupAddMemberOptions;
  };
  hostgroup_add_member_manager: {
    args: HostgroupAddMemberManagerArgs;
    options: HostgroupAddMemberManagerOptions;
  };
  hostgroup_del: { args: HostgroupDelArgs; options: HostgroupDelOptions };
  hostgroup_find: { args: HostgroupFindArgs; options: HostgroupFindOptions };
  hostgroup_mod: { args: HostgroupModArgs; options: HostgroupModOptions };
  hostgroup_remove_member: {
    args: HostgroupRemoveMemberArgs;
    options: HostgroupRemoveMemberOptions;
  };
  hostgroup_remove_member_manager: {
    args: HostgroupRemoveMemberManagerArgs;
    options: HostgroupRemoveMemberManagerOptions;
  };
  hostgroup_show: { args: HostgroupShowArgs; options: HostgroupShowOptions };
  i18n_messages: { args: I18nMessagesArgs; options: I18nMessagesOptions };
  idoverridegroup_add: {
    args: IdoverridegroupAddArgs;
    options: IdoverridegroupAddOptions;
  };
  idoverridegroup_del: {
    args: IdoverridegroupDelArgs;
    options: IdoverridegroupDelOptions;
  };
  idoverridegroup_find: {
    args: IdoverridegroupFindArgs;
    options: IdoverridegroupFindOptions;
  };
  idoverridegroup_mod: {
    args: IdoverridegroupModArgs;
    options: IdoverridegroupModOptions;
  };
  idoverridegroup_show: {
    args: IdoverridegroupShowArgs;
    options: IdoverridegroupShowOptions;
  };
  idoverrideuser_add: {
    args: IdoverrideuserAddArgs;
    options: IdoverrideuserAddOptions;
  };
  idoverrideuser_add_cert: {
    args: IdoverrideuserAddCertArgs;
    options: IdoverrideuserAddCertOptions;
  };
  idoverrideuser_del: {
    args: IdoverrideuserDelArgs;
    options: IdoverrideuserDelOptions;
  };
  idoverrideuser_find: {
    args: IdoverrideuserFindArgs;
    options: IdoverrideuserFindOptions;
  };
  idoverrideuser_mod: {
    args: IdoverrideuserModArgs;
    options: IdoverrideuserModOptions;
  };
  idoverrideuser_remove_cert: {
    args: IdoverrideuserRemoveCertArgs;
    options: IdoverrideuserRemoveCertOptions;
  };
  idoverrideuser_show: {
    args: IdoverrideuserShowArgs;
    options: IdoverrideuserShowOptions;
  };
  idp_add: { args: IdpAddArgs; options: IdpAddOptions };
  idp_del: { args: IdpDelArgs; options: IdpDelOptions };
  idp_find: { args: IdpFindArgs; options: IdpFindOptions };
  idp_mod: { args: IdpModArgs; options: IdpModOptions };
  idp_show: { args: IdpShowArgs; options: IdpShowOptions };
  idrange_add: { args: IdrangeAddArgs; options: IdrangeAddOptions };
  idrange_del: { args: IdrangeDelArgs; options: IdrangeDelOptions };
  idrange_find: { args: IdrangeFindArgs; options: IdrangeFindOptions };
  idrange_mod: { args: IdrangeModArgs; options: IdrangeModOptions };
  idrange_show: { args: IdrangeShowArgs; options: IdrangeShowOptions };
  idview_add: { args: IdviewAddArgs; options: IdviewAddOptions };
  idview_apply: { args: IdviewApplyArgs; options: IdviewApplyOptions };
  idview_del: { args: IdviewDelArgs; options: IdviewDelOptions };
  idview_find: { args: IdviewFindArgs; options: IdviewFindOptions };
  idview_mod: { args: IdviewModArgs; options: IdviewModOptions };
  idview_show: { args: IdviewShowArgs; options: IdviewShowOptions };
  idview_unapply: { args: IdviewUnapplyArgs; options: IdviewUnapplyOptions };
  join: { args: JoinArgs; options: JoinOptions };
  json_metadata: { args: JsonMetadataArgs; options: JsonMetadataOptions };
  kra_is_enabled: { args: KraIsEnabledArgs; options: KraIsEnabledOptions };
  krbtpolicy_mod: { args: KrbtpolicyModArgs; options: KrbtpolicyModOptions };
  krbtpolicy_reset: {
    args: KrbtpolicyResetArgs;
    options: KrbtpolicyResetOptions;
  };
  krbtpolicy_show: { args: KrbtpolicyShowArgs; options: KrbtpolicyShowOptions };
  location_add: { args: LocationAddArgs; options: LocationAddOptions };
  location_del: { args: LocationDelArgs; options: LocationDelOptions };
  location_find: { args: LocationFindArgs; options: LocationFindOptions };
  location_mod: { args: LocationModArgs; options: LocationModOptions };
  location_show: { args: LocationShowArgs; options: LocationShowOptions };
  migrate_ds: { args: MigrateDsArgs; options: MigrateDsOptions };
  netgroup_add: { args: NetgroupAddArgs; options: NetgroupAddOptions };
  netgroup_add_member: {
    args: NetgroupAddMemberArgs;
    options: NetgroupAddMemberOptions;
  };
  netgroup_del: { args: NetgroupDelArgs; options: NetgroupDelOptions };
  netgroup_find: { args: NetgroupFindArgs; options: NetgroupFindOptions };
  netgroup_mod: { args: NetgroupModArgs; options: NetgroupModOptions };
  netgroup_remove_member: {
    args: NetgroupRemoveMemberArgs;
    options: NetgroupRemoveMemberOptions;
  };
  netgroup_show: { args: NetgroupShowArgs; options: NetgroupShowOptions };
  otpconfig_mod: { args: OtpconfigModArgs; options: OtpconfigModOptions };
  otpconfig_show: { args: OtpconfigShowArgs; options: OtpconfigShowOptions };
  otptoken_add: { args: OtptokenAddArgs; options: OtptokenAddOptions };
  otptoken_add_managedby: {
    args: OtptokenAddManagedbyArgs;
    options: OtptokenAddManagedbyOptions;
  };
  otptoken_del: { args: OtptokenDelArgs; options: OtptokenDelOptions };
  otptoken_find: { args: OtptokenFindArgs; options: OtptokenFindOptions };
  otptoken_mod: { args: OtptokenModArgs; options: OtptokenModOptions };
  otptoken_remove_managedby: {
    args: OtptokenRemoveManagedbyArgs;
    options: OtptokenRemoveManagedbyOptions;
  };
  otptoken_show: { args: OtptokenShowArgs; options: OtptokenShowOptions };
  output_find: { args: OutputFindArgs; options: OutputFindOptions };
  output_show: { args: OutputShowArgs; options: OutputShowOptions };
  param_find: { args: ParamFindArgs; options: ParamFindOptions };
  param_show: { args: ParamShowArgs; options: ParamShowOptions };
  passkeyconfig_mod: {
    args: PasskeyconfigModArgs;
    options: PasskeyconfigModOptions;
  };
  passkeyconfig_show: {
    args: PasskeyconfigShowArgs;
    options: PasskeyconfigShowOptions;
  };
  passwd: { args: PasswdArgs; options: PasswdOptions };
  permission_add: { args: PermissionAddArgs; options: PermissionAddOptions };
  permission_add_member: {
    args: PermissionAddMemberArgs;
    options: PermissionAddMemberOptions;
  };
  permission_add_noaci: {
    args: PermissionAddNoaciArgs;
    options: PermissionAddNoaciOptions;
  };
  permission_del: { args: PermissionDelArgs; options: PermissionDelOptions };
  permission_find: { args: PermissionFindArgs; options: PermissionFindOptions };
  permission_mod: { args: PermissionModArgs; options: PermissionModOptions };
  permission_remove_member: {
    args: PermissionRemoveMemberArgs;
    options: PermissionRemoveMemberOptions;
  };
  permission_show: { args: PermissionShowArgs; options: PermissionShowOptions };
  ping: { args: PingArgs; options: PingOptions };
  pkinit_status: { args: PkinitStatusArgs; options: PkinitStatusOptions };
  plugins: { args: PluginsArgs; options: PluginsOptions };
  privilege_add: { args: PrivilegeAddArgs; options: PrivilegeAddOptions };
  privilege_add_member: {
    args: PrivilegeAddMemberArgs;
    options: PrivilegeAddMemberOptions;
  };
  privilege_add_permission: {
    args: PrivilegeAddPermissionArgs;
    options: PrivilegeAddPermissionOptions;
  };
  privilege_del: { args: PrivilegeDelArgs; options: PrivilegeDelOptions };
  privilege_find: { args: PrivilegeFindArgs; options: PrivilegeFindOptions };
  privilege_mod: { args: PrivilegeModArgs; options: PrivilegeModOptions };
  privilege_remove_member: {
    args: PrivilegeRemoveMemberArgs;
    options: PrivilegeRemoveMemberOptions;
  };
  privilege_remove_permission: {
    args: PrivilegeRemovePermissionArgs;
    options: PrivilegeRemovePermissionOptions;
  };
  privilege_show: { args: PrivilegeShowArgs; options: PrivilegeShowOptions };
  pwpolicy_add: { args: PwpolicyAddArgs; options: PwpolicyAddOptions };
  pwpolicy_del: { args: PwpolicyDelArgs; options: PwpolicyDelOptions };
  pwpolicy_find: { args: PwpolicyFindArgs; options: PwpolicyFindOptions };
  pwpolicy_mod: { args: PwpolicyModArgs; options: PwpolicyModOptions };
  pwpolicy_show: { args: PwpolicyShowArgs; options: PwpolicyShowOptions };
  radiusproxy_add: { args: RadiusproxyAddArgs; options: RadiusproxyAddOptions };
  radiusproxy_del: { args: RadiusproxyDelArgs; options: RadiusproxyDelOptions };
  radiusproxy_find: {
    args: RadiusproxyFindArgs;
    options: RadiusproxyFindOptions;
  };
  radiusproxy_mod: { args: RadiusproxyModArgs; options: RadiusproxyModOptions };
  radiusproxy_show: {
    args: RadiusproxyShowArgs;
    options: RadiusproxyShowOptions;
  };
  realmdomains_mod: {
    args: RealmdomainsModArgs;
    options: RealmdomainsModOptions;
  };
  realmdomains_show: {
    args: RealmdomainsShowArgs;
    options: RealmdomainsShowOptions;
  };
  role_add: { args: RoleAddArgs; options: RoleAddOptions };
  role_add_member: { args: RoleAddMemberArgs; options: RoleAddMemberOptions };
  role_add_privilege: {
    args: RoleAddPrivilegeArgs;
    options: RoleAddPrivilegeOptions;
  };
  role_del: { args: RoleDelArgs; options: RoleDelOptions };
  role_find: { args: RoleFindArgs; options: RoleFindOptions };
  role_mod: { args: RoleModArgs; options: RoleModOptions };
  role_remove_member: {
    args: RoleRemoveMemberArgs;
    options: RoleRemoveMemberOptions;
  };
  role_remove_privilege: {
    args: RoleRemovePrivilegeArgs;
    options: RoleRemovePrivilegeOptions;
  };
  role_show: { args: RoleShowArgs; options: RoleShowOptions };
  schema: { args: SchemaArgs; options: SchemaOptions };
  selfservice_add: { args: SelfserviceAddArgs; options: SelfserviceAddOptions };
  selfservice_del: { args: SelfserviceDelArgs; options: SelfserviceDelOptions };
  selfservice_find: {
    args: SelfserviceFindArgs;
    options: SelfserviceFindOptions;
  };
  selfservice_mod: { args: SelfserviceModArgs; options: SelfserviceModOptions };
  selfservice_show: {
    args: SelfserviceShowArgs;
    options: SelfserviceShowOptions;
  };
  selinuxusermap_add: {
    args: SelinuxusermapAddArgs;
    options: SelinuxusermapAddOptions;
  };
  selinuxusermap_add_host: {
    args: SelinuxusermapAddHostArgs;
    options: SelinuxusermapAddHostOptions;
  };
  selinuxusermap_add_user: {
    args: SelinuxusermapAddUserArgs;
    options: SelinuxusermapAddUserOptions;
  };
  selinuxusermap_del: {
    args: SelinuxusermapDelArgs;
    options: SelinuxusermapDelOptions;
  };
  selinuxusermap_disable: {
    args: SelinuxusermapDisableArgs;
    options: SelinuxusermapDisableOptions;
  };
  selinuxusermap_enable: {
    args: SelinuxusermapEnableArgs;
    options: SelinuxusermapEnableOptions;
  };
  selinuxusermap_find: {
    args: SelinuxusermapFindArgs;
    options: SelinuxusermapFindOptions;
  };
  selinuxusermap_mod: {
    args: SelinuxusermapModArgs;
    options: SelinuxusermapModOptions;
  };
  selinuxusermap_remove_host: {
    args: SelinuxusermapRemoveHostArgs;
    options: SelinuxusermapRemoveHostOptions;
  };
  selinuxusermap_remove_user: {
    args: SelinuxusermapRemoveUserArgs;
    options: SelinuxusermapRemoveUserOptions;
  };
  selinuxusermap_show: {
    args: SelinuxusermapShowArgs;
    options: SelinuxusermapShowOptions;
  };
  server_conncheck: {
    args: ServerConncheckArgs;
    options: ServerConncheckOptions;
  };
  server_del: { args: ServerDelArgs; options: ServerDelOptions };
  server_find: { args: ServerFindArgs; options: ServerFindOptions };
  server_mod: { args: ServerModArgs; options: ServerModOptions };
  server_role_find: {
    args: ServerRoleFindArgs;
    options: ServerRoleFindOptions;
  };
  server_role_show: {
    args: ServerRoleShowArgs;
    options: ServerRoleShowOptions;
  };
  server_show: { args: ServerShowArgs; options: ServerShowOptions };
  server_state: { args: ServerStateArgs; options: ServerStateOptions };
  service_add: { args: ServiceAddArgs; options: ServiceAddOptions };
  service_add_cert: {
    args: ServiceAddCertArgs;
    options: ServiceAddCertOptions;
  };
  service_add_delegation: {
    args: ServiceAddDelegationArgs;
    options: ServiceAddDelegationOptions;
  };
  service_add_host: {
    args: ServiceAddHostArgs;
    options: ServiceAddHostOptions;
  };
  service_add_principal: {
    args: ServiceAddPrincipalArgs;
    options: ServiceAddPrincipalOptions;
  };
  service_add_smb: { args: ServiceAddSmbArgs; options: ServiceAddSmbOptions };
  service_allow_add_delegation: {
    args: ServiceAllowAddDelegationArgs;
    options: ServiceAllowAddDelegationOptions;
  };
  service_allow_create_keytab: {
    args: ServiceAllowCreateKeytabArgs;
    options: ServiceAllowCreateKeytabOptions;
  };
  service_allow_retrieve_keytab: {
    args: ServiceAllowRetrieveKeytabArgs;
    options: ServiceAllowRetrieveKeytabOptions;
  };
  service_del: { args: ServiceDelArgs; options: ServiceDelOptions };
  service_disable: { args: ServiceDisableArgs; options: ServiceDisableOptions };
  service_disallow_add_delegation: {
    args: ServiceDisallowAddDelegationArgs;
    options: ServiceDisallowAddDelegationOptions;
  };
  service_disallow_create_keytab: {
    args: ServiceDisallowCreateKeytabArgs;
    options: ServiceDisallowCreateKeytabOptions;
  };
  service_disallow_retrieve_keytab: {
    args: ServiceDisallowRetrieveKeytabArgs;
    options: ServiceDisallowRetrieveKeytabOptions;
  };
  service_find: { args: ServiceFindArgs; options: ServiceFindOptions };
  service_mod: { args: ServiceModArgs; options: ServiceModOptions };
  service_remove_cert: {
    args: ServiceRemoveCertArgs;
    options: ServiceRemoveCertOptions;
  };
  service_remove_delegation: {
    args: ServiceRemoveDelegationArgs;
    options: ServiceRemoveDelegationOptions;
  };
  service_remove_host: {
    args: ServiceRemoveHostArgs;
    options: ServiceRemoveHostOptions;
  };
  service_remove_principal: {
    args: ServiceRemovePrincipalArgs;
    options: ServiceRemovePrincipalOptions;
  };
  service_show: { args: ServiceShowArgs; options: ServiceShowOptions };
  servicedelegationrule_add: {
    args: ServicedelegationruleAddArgs;
    options: ServicedelegationruleAddOptions;
  };
  servicedelegationrule_add_member: {
    args: ServicedelegationruleAddMemberArgs;
    options: ServicedelegationruleAddMemberOptions;
  };
  servicedelegationrule_add_target: {
    args: ServicedelegationruleAddTargetArgs;
    options: ServicedelegationruleAddTargetOptions;
  };
  servicedelegationrule_del: {
    args: ServicedelegationruleDelArgs;
    options: ServicedelegationruleDelOptions;
  };
  servicedelegationrule_find: {
    args: ServicedelegationruleFindArgs;
    options: ServicedelegationruleFindOptions;
  };
  servicedelegationrule_remove_member: {
    args: ServicedelegationruleRemoveMemberArgs;
    options: ServicedelegationruleRemoveMemberOptions;
  };
  servicedelegationrule_remove_target: {
    args: ServicedelegationruleRemoveTargetArgs;
    options: ServicedelegationruleRemoveTargetOptions;
  };
  servicedelegationrule_show: {
    args: ServicedelegationruleShowArgs;
    options: ServicedelegationruleShowOptions;
  };
  servicedelegationtarget_add: {
    args: ServicedelegationtargetAddArgs;
    options: ServicedelegationtargetAddOptions;
  };
  servicedelegationtarget_add_member: {
    args: ServicedelegationtargetAddMemberArgs;
    options: ServicedelegationtargetAddMemberOptions;
  };
  servicedelegationtarget_del: {
    args: ServicedelegationtargetDelArgs;
    options: ServicedelegationtargetDelOptions;
  };
  servicedelegationtarget_find: {
    args: ServicedelegationtargetFindArgs;
    options: ServicedelegationtargetFindOptions;
  };
  servicedelegationtarget_remove_member: {
    args: ServicedelegationtargetRemoveMemberArgs;
    options: ServicedelegationtargetRemoveMemberOptions;
  };
  servicedelegationtarget_show: {
    args: ServicedelegationtargetShowArgs;
    options: ServicedelegationtargetShowOptions;
  };
  session_logout: { args: SessionLogoutArgs; options: SessionLogoutOptions };
  sidgen_was_run: { args: SidgenWasRunArgs; options: SidgenWasRunOptions };
  stageuser_activate: {
    args: StageuserActivateArgs;
    options: StageuserActivateOptions;
  };
  stageuser_add: { args: StageuserAddArgs; options: StageuserAddOptions };
  stageuser_add_cert: {
    args: StageuserAddCertArgs;
    options: StageuserAddCertOptions;
  };
  stageuser_add_certmapdata: {
    args: StageuserAddCertmapdataArgs;
    options: StageuserAddCertmapdataOptions;
  };
  stageuser_add_manager: {
    args: StageuserAddManagerArgs;
    options: StageuserAddManagerOptions;
  };
  stageuser_add_passkey: {
    args: StageuserAddPasskeyArgs;
    options: StageuserAddPasskeyOptions;
  };
  stageuser_add_principal: {
    args: StageuserAddPrincipalArgs;
    options: StageuserAddPrincipalOptions;
  };
  stageuser_del: { args: StageuserDelArgs; options: StageuserDelOptions };
  stageuser_find: { args: StageuserFindArgs; options: StageuserFindOptions };
  stageuser_mod: { args: StageuserModArgs; options: StageuserModOptions };
  stageuser_remove_cert: {
    args: StageuserRemoveCertArgs;
    options: StageuserRemoveCertOptions;
  };
  stageuser_remove_certmapdata: {
    args: StageuserRemoveCertmapdataArgs;
    options: StageuserRemoveCertmapdataOptions;
  };
  stageuser_remove_manager: {
    args: StageuserRemoveManagerArgs;
    options: StageuserRemoveManagerOptions;
  };
  stageuser_remove_passkey: {
    args: StageuserRemovePasskeyArgs;
    options: StageuserRemovePasskeyOptions;
  };
  stageuser_remove_principal: {
    args: StageuserRemovePrincipalArgs;
    options: StageuserRemovePrincipalOptions;
  };
  stageuser_show: { args: StageuserShowArgs; options: StageuserShowOptions };
  subid_add: { args: SubidAddArgs; options: SubidAddOptions };
  subid_del: { args: SubidDelArgs; options: SubidDelOptions };
  subid_find: { args: SubidFindArgs; options: SubidFindOptions };
  subid_generate: { args: SubidGenerateArgs; options: SubidGenerateOptions };
  subid_match: { args: SubidMatchArgs; options: SubidMatchOptions };
  subid_mod: { args: SubidModArgs; options: SubidModOptions };
  subid_show: { args: SubidShowArgs; options: SubidShowOptions };
  subid_stats: { args: SubidStatsArgs; options: SubidStatsOptions };
  sudocmd_add: { args: SudocmdAddArgs; options: SudocmdAddOptions };
  sudocmd_del: { args: SudocmdDelArgs; options: SudocmdDelOptions };
  sudocmd_find: { args: SudocmdFindArgs; options: SudocmdFindOptions };
  sudocmd_mod: { args: SudocmdModArgs; options: SudocmdModOptions };
  sudocmd_show: { args: SudocmdShowArgs; options: SudocmdShowOptions };
  sudocmdgroup_add: {
    args: SudocmdgroupAddArgs;
    options: SudocmdgroupAddOptions;
  };
  sudocmdgroup_add_member: {
    args: SudocmdgroupAddMemberArgs;
    options: SudocmdgroupAddMemberOptions;
  };
  sudocmdgroup_del: {
    args: SudocmdgroupDelArgs;
    options: SudocmdgroupDelOptions;
  };
  sudocmdgroup_find: {
    args: SudocmdgroupFindArgs;
    options: SudocmdgroupFindOptions;
  };
  sudocmdgroup_mod: {
    args: SudocmdgroupModArgs;
    options: SudocmdgroupModOptions;
  };
  sudocmdgroup_remove_member: {
    args: SudocmdgroupRemoveMemberArgs;
    options: SudocmdgroupRemoveMemberOptions;
  };
  sudocmdgroup_show: {
    args: SudocmdgroupShowArgs;
    options: SudocmdgroupShowOptions;
  };
  sudorule_add: { args: SudoruleAddArgs; options: SudoruleAddOptions };
  sudorule_add_allow_command: {
    args: SudoruleAddAllowCommandArgs;
    options: SudoruleAddAllowCommandOptions;
  };
  sudorule_add_deny_command: {
    args: SudoruleAddDenyCommandArgs;
    options: SudoruleAddDenyCommandOptions;
  };
  sudorule_add_host: {
    args: SudoruleAddHostArgs;
    options: SudoruleAddHostOptions;
  };
  sudorule_add_option: {
    args: SudoruleAddOptionArgs;
    options: SudoruleAddOptionOptions;
  };
  sudorule_add_runasgroup: {
    args: SudoruleAddRunasgroupArgs;
    options: SudoruleAddRunasgroupOptions;
  };
  sudorule_add_runasuser: {
    args: SudoruleAddRunasuserArgs;
    options: SudoruleAddRunasuserOptions;
  };
  sudorule_add_user: {
    args: SudoruleAddUserArgs;
    options: SudoruleAddUserOptions;
  };
  sudorule_del: { args: SudoruleDelArgs; options: SudoruleDelOptions };
  sudorule_disable: {
    args: SudoruleDisableArgs;
    options: SudoruleDisableOptions;
  };
  sudorule_enable: { args: SudoruleEnableArgs; options: SudoruleEnableOptions };
  sudorule_find: { args: SudoruleFindArgs; options: SudoruleFindOptions };
  sudorule_mod: { args: SudoruleModArgs; options: SudoruleModOptions };
  sudorule_remove_allow_command: {
    args: SudoruleRemoveAllowCommandArgs;
    options: SudoruleRemoveAllowCommandOptions;
  };
  sudorule_remove_deny_command: {
    args: SudoruleRemoveDenyCommandArgs;
    options: SudoruleRemoveDenyCommandOptions;
  };
  sudorule_remove_host: {
    args: SudoruleRemoveHostArgs;
    options: SudoruleRemoveHostOptions;
  };
  sudorule_remove_option: {
    args: SudoruleRemoveOptionArgs;
    options: SudoruleRemoveOptionOptions;
  };
  sudorule_remove_runasgroup: {
    args: SudoruleRemoveRunasgroupArgs;
    options: SudoruleRemoveRunasgroupOptions;
  };
  sudorule_remove_runasuser: {
    args: SudoruleRemoveRunasuserArgs;
    options: SudoruleRemoveRunasuserOptions;
  };
  sudorule_remove_user: {
    args: SudoruleRemoveUserArgs;
    options: SudoruleRemoveUserOptions;
  };
  sudorule_show: { args: SudoruleShowArgs; options: SudoruleShowOptions };
  sysaccount_add: { args: SysaccountAddArgs; options: SysaccountAddOptions };
  sysaccount_del: { args: SysaccountDelArgs; options: SysaccountDelOptions };
  sysaccount_disable: {
    args: SysaccountDisableArgs;
    options: SysaccountDisableOptions;
  };
  sysaccount_enable: {
    args: SysaccountEnableArgs;
    options: SysaccountEnableOptions;
  };
  sysaccount_find: { args: SysaccountFindArgs; options: SysaccountFindOptions };
  sysaccount_mod: { args: SysaccountModArgs; options: SysaccountModOptions };
  sysaccount_policy: {
    args: SysaccountPolicyArgs;
    options: SysaccountPolicyOptions;
  };
  sysaccount_show: { args: SysaccountShowArgs; options: SysaccountShowOptions };
  topic_find: { args: TopicFindArgs; options: TopicFindOptions };
  topic_show: { args: TopicShowArgs; options: TopicShowOptions };
  topologysegment_add: {
    args: TopologysegmentAddArgs;
    options: TopologysegmentAddOptions;
  };
  topologysegment_del: {
    args: TopologysegmentDelArgs;
    options: TopologysegmentDelOptions;
  };
  topologysegment_find: {
    args: TopologysegmentFindArgs;
    options: TopologysegmentFindOptions;
  };
  topologysegment_mod: {
    args: TopologysegmentModArgs;
    options: TopologysegmentModOptions;
  };
  topologysegment_reinitialize: {
    args: TopologysegmentReinitializeArgs;
    options: TopologysegmentReinitializeOptions;
  };
  topologysegment_show: {
    args: TopologysegmentShowArgs;
    options: TopologysegmentShowOptions;
  };
  topologysuffix_add: {
    args: TopologysuffixAddArgs;
    options: TopologysuffixAddOptions;
  };
  topologysuffix_del: {
    args: TopologysuffixDelArgs;
    options: TopologysuffixDelOptions;
  };
  topologysuffix_find: {
    args: TopologysuffixFindArgs;
    options: TopologysuffixFindOptions;
  };
  topologysuffix_mod: {
    args: TopologysuffixModArgs;
    options: TopologysuffixModOptions;
  };
  topologysuffix_show: {
    args: TopologysuffixShowArgs;
    options: TopologysuffixShowOptions;
  };
  topologysuffix_verify: {
    args: TopologysuffixVerifyArgs;
    options: TopologysuffixVerifyOptions;
  };
  trust_add: { args: TrustAddArgs; options: TrustAddOptions };
  trust_del: { args: TrustDelArgs; options: TrustDelOptions };
  trust_enable_agent: {
    args: TrustEnableAgentArgs;
    options: TrustEnableAgentOptions;
  };
  trust_fetch_domains: {
    args: TrustFetchDomainsArgs;
    options: TrustFetchDomainsOptions;
  };
  trust_find: { args: TrustFindArgs; options: TrustFindOptions };
  trust_mod: { args: TrustModArgs; options: TrustModOptions };
  trust_resolve: { args: TrustResolveArgs; options: TrustResolveOptions };
  trust_show: { args: TrustShowArgs; options: TrustShowOptions };
  trustconfig_mod: { args: TrustconfigModArgs; options: TrustconfigModOptions };
  trustconfig_show: {
    args: TrustconfigShowArgs;
    options: TrustconfigShowOptions;
  };
  trustdomain_add: { args: TrustdomainAddArgs; options: TrustdomainAddOptions };
  trustdomain_del: { args: TrustdomainDelArgs; options: TrustdomainDelOptions };
  trustdomain_disable: {
    args: TrustdomainDisableArgs;
    options: TrustdomainDisableOptions;
  };
  trustdomain_enable: {
    args: TrustdomainEnableArgs;
    options: TrustdomainEnableOptions;
  };
  trustdomain_find: {
    args: TrustdomainFindArgs;
    options: TrustdomainFindOptions;
  };
  trustdomain_mod: { args: TrustdomainModArgs; options: TrustdomainModOptions };
  user_add: { args: UserAddArgs; options: UserAddOptions };
  user_add_cert: { args: UserAddCertArgs; options: UserAddCertOptions };
  user_add_certmapdata: {
    args: UserAddCertmapdataArgs;
    options: UserAddCertmapdataOptions;
  };
  user_add_manager: {
    args: UserAddManagerArgs;
    options: UserAddManagerOptions;
  };
  user_add_passkey: {
    args: UserAddPasskeyArgs;
    options: UserAddPasskeyOptions;
  };
  user_add_principal: {
    args: UserAddPrincipalArgs;
    options: UserAddPrincipalOptions;
  };
  user_del: { args: UserDelArgs; options: UserDelOptions };
  user_disable: { args: UserDisableArgs; options: UserDisableOptions };
  user_enable: { args: UserEnableArgs; options: UserEnableOptions };
  user_find: { args: UserFindArgs; options: UserFindOptions };
  user_mod: { args: UserModArgs; options: UserModOptions };
  user_remove_cert: {
    args: UserRemoveCertArgs;
    options: UserRemoveCertOptions;
  };
  user_remove_certmapdata: {
    args: UserRemoveCertmapdataArgs;
    options: UserRemoveCertmapdataOptions;
  };
  user_remove_manager: {
    args: UserRemoveManagerArgs;
    options: UserRemoveManagerOptions;
  };
  user_remove_passkey: {
    args: UserRemovePasskeyArgs;
    options: UserRemovePasskeyOptions;
  };
  user_remove_principal: {
    args: UserRemovePrincipalArgs;
    options: UserRemovePrincipalOptions;
  };
  user_show: { args: UserShowArgs; options: UserShowOptions };
  user_stage: { args: UserStageArgs; options: UserStageOptions };
  user_status: { args: UserStatusArgs; options: UserStatusOptions };
  user_undel: { args: UserUndelArgs; options: UserUndelOptions };
  user_unlock: { args: UserUnlockArgs; options: UserUnlockOptions };
  vault_add_internal: {
    args: VaultAddInternalArgs;
    options: VaultAddInternalOptions;
  };
  vault_add_member: {
    args: VaultAddMemberArgs;
    options: VaultAddMemberOptions;
  };
  vault_add_owner: { args: VaultAddOwnerArgs; options: VaultAddOwnerOptions };
  vault_archive_internal: {
    args: VaultArchiveInternalArgs;
    options: VaultArchiveInternalOptions;
  };
  vault_del: { args: VaultDelArgs; options: VaultDelOptions };
  vault_find: { args: VaultFindArgs; options: VaultFindOptions };
  vault_mod_internal: {
    args: VaultModInternalArgs;
    options: VaultModInternalOptions;
  };
  vault_remove_member: {
    args: VaultRemoveMemberArgs;
    options: VaultRemoveMemberOptions;
  };
  vault_remove_owner: {
    args: VaultRemoveOwnerArgs;
    options: VaultRemoveOwnerOptions;
  };
  vault_retrieve_internal: {
    args: VaultRetrieveInternalArgs;
    options: VaultRetrieveInternalOptions;
  };
  vault_show: { args: VaultShowArgs; options: VaultShowOptions };
  vaultconfig_show: {
    args: VaultconfigShowArgs;
    options: VaultconfigShowOptions;
  };
  vaultcontainer_add_owner: {
    args: VaultcontainerAddOwnerArgs;
    options: VaultcontainerAddOwnerOptions;
  };
  vaultcontainer_del: {
    args: VaultcontainerDelArgs;
    options: VaultcontainerDelOptions;
  };
  vaultcontainer_remove_owner: {
    args: VaultcontainerRemoveOwnerArgs;
    options: VaultcontainerRemoveOwnerOptions;
  };
  vaultcontainer_show: {
    args: VaultcontainerShowArgs;
    options: VaultcontainerShowOptions;
  };
  whoami: { args: WhoamiArgs; options: WhoamiOptions };
};
