Feature: Host manipulation
  Create, and delete hosts

  Background:
    Given I am logged in as "Administrator"
    Given I am on "hosts" page

  Scenario: Add a new host
    When I click on "Add" button
    * I type in the field "Host name" text "myfirstserver"
    * I click on "Force" checkbox in modal
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host added"
    Then I should see partial "myfirstserver" entry in the data table

  Scenario: Add a new host with all fields set
    When I click on "Add" button
    * I type in the field "Host name" text "addfullhost"
    * I type in the field "Description" text "my description"
    * I type in the field "Class" text "test class"
    * I click on "Force" checkbox in modal
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host added"
    Then I should see partial "addfullhost" entry in the data table
    * entry "addfullhost" should have attribute "Description" set to "my description"

  Scenario: Add a new host with all checkboxes set
    When I click on "Add" button
    * I type in the field "Host name" text "addChkBoxhost"
    * I type in the field "IP address" text "1.1.1.2"
    * I click on "Force" checkbox in modal
    * I click on "Generate OTP" checkbox in modal
    * I click on "Suppress processing" checkbox in modal
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host added"
    Then I should see partial "addchkboxhost" entry in the data table

  Scenario: Add a new host with 'Force' unchecked is expected to fail
    When I click on "Add" button
    * I type in the field "Host name" text "forcehost"
    When in the modal dialog I click on "Add" button
    * I see a modal with title text "IPA error 4019: DNSNotARecordError"
    * I click on the "Cancel" button located in the footer modal dialog
    * I click on the "Cancel" button located in the footer modal dialog

  Scenario: Add one host after another
    When I click on "Add" button
    * I type in the field "Host name" text "myserver2"
    * I click on "Force" checkbox in modal
    * in the modal dialog I click on "Add and add another" button
    * I should see "success" alert with text "New host added"
    * I type in the field "Host name" text "myserver3"
    * I click on "Force" checkbox in modal
    * in the modal dialog I click on "Add" button
    * I should see "success" alert with text "New host added"
    Then I should see partial "myfirstserver" entry in the data table
    Then I should see partial "myserver2" entry in the data table
    Then I should see partial "myserver3" entry in the data table

  Scenario: Rebuild auto membership
    When I click on kebab menu and select "Rebuild auto membership"
    * I see "Confirmation" modal
    When in the modal dialog I click on "OK" button
    * I should see "success" alert with text "Success alert:Automember rebuild membership task completed"

  Scenario: Rebuild specific auto memberships
    Then I select partial entry "myfirstserver" in the data table
    Then I select partial entry "addfullhost" in the data table
    When I click on kebab menu and select "Rebuild auto membership"
    * I see "Confirmation" modal
    When in the modal dialog I click on "OK" button
    * I should see "success" alert with text "Success alert:Automember rebuild membership task completed"

  Scenario: Delete a host
    Given I should see partial "myfirstserver" entry in the data table
    Given I should see partial "addfullhost" entry in the data table
    Then I select partial entry "myfirstserver" in the data table
    Then I select partial entry "addfullhost" in the data table
    When I click on "Delete" button
    * I see "Remove hosts" modal
    * I should see partial "myfirstserver" entry in the data table
    * I should see partial "addfullhost" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Hosts removed"
    Then I should not see "myfirstserver" entry in the data table
    Then I should not see "addfullhost" entry in the data table

  Scenario: Delete many hosts
    Given I should see partial "myserver2" entry in the data table
    Given I should see partial "myserver3" entry in the data table
    Given I should see partial "addchkboxhost" entry in the data table
    Then I select partial entry "myserver2" in the data table
    Then I select partial entry "myserver3" in the data table
    Then I select partial entry "addchkboxhost" in the data table
    When I click on "Delete" button
    * I see "Remove hosts" modal
    * I should see partial "myserver2" entry in the data table
    * I should see partial "myserver3" entry in the data table
    * I should see partial "addchkboxhost" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Hosts removed"
    Then I should not see "myserver2" entry in the data table
    Then I should not see "myserver3" entry in the data table
    Then I should not see "addchkboxhost" entry in the data table

  Scenario: Cancel creation of a host
    When I click on "Add" button
    * I type in the field "Host name" text "cancelhost"
    * in the modal dialog I click on "Cancel" button
    Then I should not see "cancelhost" entry in the data table

