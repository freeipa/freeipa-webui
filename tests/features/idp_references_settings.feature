Feature: Identity Providers references - Settings page
  Modify identity providers fields and reset password

  Background:
    Given I am logged in as "Administrator"

  Scenario: Prep: Create an Identity Provider reference (Keycloak - No secret)
    Given I am on "identity-provider-references" page
    When I click on "Add" button
    Then I see "Add Identity Provider reference" modal
    * In the modal, I type into the field with ID "identity-provider-reference-name" text "idpKeycloak"
    * In the modal, I type into the field with ID "client-id" text "idpKeycloakClient"
    * in the modal dialog I check "Pre-defined IdP template" radio selector
    * I click in the "Provider type" selector field
    * I select "Keycloak or Red Hat SSO" option in the "Provider type" selector
    * In the modal, I type into the field with ID "org" text "myOrg"
    * In the modal, I type into the field with ID "base-url" text "myOrg.example.test"
    * In the modal, I type into the field with ID "scope" text "myScopeKeycloak"
    * In the modal, I type into the field with ID "ext-idp-uid-attr" text "exampleAttributeKeycloak"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Identity provider successfully added"
    * I close the alert
    Then I should see "idpKeycloak" entry in the data table with ID "identity-provider-references-table"

  Scenario: Set 'Client identifier' field
    Given I am on "identity-provider-references" page
    When I click on "idpKeycloak" entry in the data table
    When I clear the field "ipaidpclientid"
    When I type in the field with ID "ipaidpclientid" the text "my_client_identifier"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Set 'Client secret' field
    When I clear the field "ipaidpclientsecret"
    When I type in the field with ID "ipaidpclientsecret" the text "my_client_secret"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Set 'Scope' field
    When I clear the field "ipaidpscope"
    When I type in the field with ID "ipaidpscope" the text "my_scope"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Set 'External IdP user identifier attribute' field
    When I clear the field "ipaidpsub"
    When I type in the field with ID "ipaidpsub" the text "my_external_idp_uid_attribute"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Set 'Authorization URI' field
    When I type in the field with ID "ipaidpauthendpoint" the text "https://my_authorization_uri.example.test"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Set 'Device authorization URI' field
    When I clear the field "ipaidpdevauthendpoint"
    When I type in the field with ID "ipaidpdevauthendpoint" the text "https://my_device_authorization_uri.example.test"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Set 'Token URI' field
    When I clear the field "ipaidptokenendpoint"
    When I type in the field with ID "ipaidptokenendpoint" the text "https://my_token_uri.example.test"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Set 'User info URI' field
    When I clear the field "ipaidpuserinfoendpoint"
    When I type in the field with ID "ipaidpuserinfoendpoint" the text "https://my_user_info_uri.example.test"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Set 'JWKS URI' field
    When I clear the field "ipaidpkeysendpoint"
    When I type in the field with ID "ipaidpkeysendpoint" the text "https://my_jwks_uri.example.test"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Set 'OIDC URL' field
    When I clear the field "ipaidpissuerurl"
    When I type in the field with ID "ipaidpissuerurl" the text "https://my_oidc_url.example.test"
    Then I click on "Save" button
    * I should see "success" alert with text "Identity Provider 'idpKeycloak' updated"
    * I close the alert

  Scenario: Check fields are reverted
    When I clear the field "ipaidpclientid"
    And I type in the field with ID "ipaidpclientid" the text "another_client"
    When I clear the field "ipaidpscope"
    And I type in the field with ID "ipaidpscope" the text "another_scope"
    When I clear the field "ipaidpsub"
    And I type in the field with ID "ipaidpsub" the text "another_external_idp_uid_attribute"
    Then I click on "Revert" button
    * I should see "success" alert with text "Identity Provider data reverted"
    * I close the alert
    Then I should see input field with ID "ipaidpclientid" and value "my_client_identifier"
    Then I should see input field with ID "ipaidpscope" and value "my_scope"
    Then I should see input field with ID "ipaidpsub" and value "my_external_idp_uid_attribute"

  Scenario: Reset IdP password via kebab menu
    When I click on kebab menu and select "Reset password"
    Then I see "Reset password" modal
    * In the modal, I type into the field with ID "modal-form-reset-password-new-password" text "myNewPassword"
    * In the modal, I type into the field with ID "modal-form-reset-password-verify-password" text "myNewPassword"
    When in the modal dialog I click on "Reset password" button
    * I should see "success" alert with text "Identity Provider password successfully updated"
    * I close the alert

  Scenario: Cleanup: Remove the Identity Provider reference
    Given I click on the breadcrump link "Identity provider references"
    Given I should see "idpKeycloak" entry in the data table
    Then I select entry "idpKeycloak" in the data table
    When I click on "Delete" button
    * I see "Remove Identity Provider references" modal
    * I should see "idpKeycloak" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Identity Providers removed"
    * I close the alert
    Then I should not see "idpKeycloak" entry in the data table
