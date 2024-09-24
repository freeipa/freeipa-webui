Feature: Configuration settings manipulation
  Modify configuration settings

  Background:
    Given I am logged in as "Administrator"
    Given I am on "configuration" page

  #
  # Search options
  #
  Scenario: Search options - size limit
    When I click on the "ipasearchrecordslimit" number plus button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    When I click on the "ipasearchrecordslimit" number minus button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: Search options - time limit
    When I click on the "ipasearchtimelimit" number plus button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    When I click on the "ipasearchtimelimit" number minus button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  #
  # User options
  #
  Scenario: User options - search fields
    When I type in the textarea "ipausersearchfields" text ",cn"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset back to original value
    When I clear the textarea "ipausersearchfields"
    And I type in the textarea "ipausersearchfields" text "uid,givenname,sn,telephonenumber,ou,title"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - default email domain
    When I type in the field with ID "ipadefaultemaildomain" the text ".net"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset back to original value
    When I clear the field "ipadefaultemaildomain"
    And I type in the field with ID "ipadefaultemaildomain" the text "dom-server.ipa.demo"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - default user groups
    When I click in the "Default users group" selector field
    And I select "editors" option in the "Default users group" selector
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I click in the "Default users group" selector field
    And I select "ipausers" option in the "Default users group" selector
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - home directory base
    When I clear the field "ipahomesrootdir"
    And I type in the field with ID "ipahomesrootdir" the text "/export"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I clear the field "ipahomesrootdir"
    And I type in the field with ID "ipahomesrootdir" the text "/home"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - default shell
    When I clear the field "ipadefaultloginshell"
    And I type in the field with ID "ipadefaultloginshell" the text "/bin/ksh"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I clear the field "ipadefaultloginshell"
    And I type in the field with ID "ipadefaultloginshell" the text "/bin/sh"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - max username length
    When I click on the "ipamaxusernamelength" number plus button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I click on the "ipamaxusernamelength" number minus button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - password expiration notification
    When I click on the "ipapwdexpadvnotify" number plus button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I click on the "ipapwdexpadvnotify" number minus button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - password plugin features
    When I click on "AllowNThash" checkbox
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I click on "AllowNThash" checkbox
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - default user authentication types
    When I click on "Password" checkbox in "Default user authentication types" section
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I click on "Password" checkbox in "Default user authentication types" section
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - migration mode
    When I click on ID "ipamigrationenabled-ipamigrationenabled" checkbox
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I click on ID "ipamigrationenabled-ipamigrationenabled" checkbox
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - enable adding subids to users
    When I click on ID "ipauserdefaultsubordinateid-ipauserdefaultsubordinateid" checkbox
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I click on ID "ipauserdefaultsubordinateid-ipauserdefaultsubordinateid" checkbox
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: User options - default objectclasses
    When I click on "Add objectclass" button in the "Default user objectclasses" section
    And I type in the field with ID "oc" the text "extensibleobject"
    Then in the modal dialog I click on "Add" button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Remove the new objectclass
    When I click on ID "extensibleobject" button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  #
  # Group options
  #
  Scenario: Group options - search fields
    When I type in the textarea "ipagroupsearchfields" text ",cn"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset back to original value
    When I clear the textarea "ipagroupsearchfields"
    And I type in the textarea "ipagroupsearchfields" text "cn,description"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: Group options - default objectclasses
    When I click on "Add objectclass" button in the "Default group objectclasses" section
    And I type in the field with ID "oc" the text "extensibleobject"
    Then in the modal dialog I click on "Add" button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Remove the new objectclass
    When I click on ID "extensibleobject" button
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  #
  # SELinux options
  #
  Scenario: SELinux options - user map order
    When I clear the textarea "ipaselinuxusermaporder"
    And I type in the textarea "ipaselinuxusermaporder" text "guest_u:s0$xguest_u:s0$user_u:s0$staff_u:s0-s0:c0.c1023$sysadm_u:s1-s0:c0.c1023$unconfined_u:s0-s0:c0.c1023"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I clear the textarea "ipaselinuxusermaporder"
    And I type in the textarea "ipaselinuxusermaporder" text "guest_u:s0$xguest_u:s0$user_u:s0$staff_u:s0-s0:c0.c1023$sysadm_u:s0-s0:c0.c1023$unconfined_u:s0-s0:c0.c1023"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  Scenario: SELinux options - default SELinux user
    When I clear the field "ipaselinuxusermapdefault"
    And I type in the field with ID "ipaselinuxusermapdefault" the text "guest_u:s0"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I clear the field "ipaselinuxusermapdefault"
    And I type in the field with ID "ipaselinuxusermapdefault" the text "unconfined_u:s0-s0:c0.c1023"
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert

  #
  # Server options
  #
  Scenario: Server options - default user authentication types
    When I click on "PAD" checkbox
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
    # Reset to original value
    When I click on "PAD" checkbox
    And I click on "Save" button
    And I should see "success" alert with text "Configuration updated"
    Then I close the alert
