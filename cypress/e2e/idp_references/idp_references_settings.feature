Feature: Identity Providers references - Settings page
  Modify identity providers fields and reset password

  @seed
  Scenario: Seed: Create an Identity Provider reference
    Given IdP "idpKeycloak" exists with client "idpKeycloakClient" and scope "myScopeKeycloak"

  @test
  Scenario: Set 'Client identifier' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpclientid" textbox text "my_client_identifier"
    Then I should see "my_client_identifier" in the "idp-references-tab-settings-textbox-ipaidpclientid" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert
    And I should see "my_client_identifier" in the "idp-references-tab-settings-textbox-ipaidpclientid" textbox

  @test
  Scenario: Set 'Client secret' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpclientsecret" textbox text "my_client_secret"
    Then I should see "my_client_secret" in the "idp-references-tab-settings-textbox-ipaidpclientsecret" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert

  @test
  Scenario: Set 'Scope' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpscope" textbox text "my_scope"
    Then I should see "my_scope" in the "idp-references-tab-settings-textbox-ipaidpscope" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert
    And I should see "my_scope" in the "idp-references-tab-settings-textbox-ipaidpscope" textbox

  @test
  Scenario: Set 'External IdP user identifier attribute' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpsub" textbox text "my_external_idp_uid_attribute"
    Then I should see "my_external_idp_uid_attribute" in the "idp-references-tab-settings-textbox-ipaidpsub" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert
    And I should see "my_external_idp_uid_attribute" in the "idp-references-tab-settings-textbox-ipaidpsub" textbox

  @test
  Scenario: Set 'Authorization URI' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpauthendpoint" textbox text "https://my_authorization_uri.example.test"
    Then I should see "https://my_authorization_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidpauthendpoint" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert
    And I should see "https://my_authorization_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidpauthendpoint" textbox

  @test
  Scenario: Set 'Device authorization URI' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpdevauthendpoint" textbox text "https://my_device_authorization_uri.example.test"
    Then I should see "https://my_device_authorization_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidpdevauthendpoint" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert
    And I should see "https://my_device_authorization_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidpdevauthendpoint" textbox

  @test
  Scenario: Set 'Token URI' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidptokenendpoint" textbox text "https://my_token_uri.example.test"
    Then I should see "https://my_token_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidptokenendpoint" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert
    And I should see "https://my_token_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidptokenendpoint" textbox

  @test
  Scenario: Set 'User info URI' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpuserinfoendpoint" textbox text "https://my_user_info_uri.example.test"
    Then I should see "https://my_user_info_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidpuserinfoendpoint" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert
    And I should see "https://my_user_info_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidpuserinfoendpoint" textbox

  @test
  Scenario: Set 'JWKS URI' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpkeysendpoint" textbox text "https://my_jwks_uri.example.test"
    Then I should see "https://my_jwks_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidpkeysendpoint" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert
    And I should see "https://my_jwks_uri.example.test" in the "idp-references-tab-settings-textbox-ipaidpkeysendpoint" textbox

  @test
  Scenario: Set 'OIDC URL' field
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpissuerurl" textbox text "https://my_oidc_url.example.test"
    Then I should see "https://my_oidc_url.example.test" in the "idp-references-tab-settings-textbox-ipaidpissuerurl" textbox

    When I click on the "idp-references-tab-settings-button-save" button
    Then I should see "success" alert
    And I should see "https://my_oidc_url.example.test" in the "idp-references-tab-settings-textbox-ipaidpissuerurl" textbox

  @cleanup
  Scenario: Cleanup: Remove IdP before revert test
    Given I delete IdP "idpKeycloak"

  @seed
  Scenario: Seed: Recreate IdP with known field values for revert test
    Given IdP "idpKeycloak" exists with client "my_client_identifier" scope "my_scope" and sub "my_external_idp_uid_attribute"

  @test
  Scenario: Check fields are reverted
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I type in the "idp-references-tab-settings-textbox-ipaidpclientid" textbox text "another_client"
    And I type in the "idp-references-tab-settings-textbox-ipaidpscope" textbox text "another_scope"
    And I type in the "idp-references-tab-settings-textbox-ipaidpsub" textbox text "another_external_idp_uid_attribute"

    When I click on the "idp-references-tab-settings-button-revert" button
    Then I should see "revert-success" alert
    And I should see "my_client_identifier" in the "idp-references-tab-settings-textbox-ipaidpclientid" textbox
    And I should see "my_scope" in the "idp-references-tab-settings-textbox-ipaidpscope" textbox
    And I should see "my_external_idp_uid_attribute" in the "idp-references-tab-settings-textbox-ipaidpsub" textbox

  @test
  Scenario: Reset IdP password via kebab menu
    Given I am logged in as admin
    And I am on "identity-provider-references/idpKeycloak" page

    When I click on the "idp-references-tab-settings-kebab" kebab menu
    Then I should see "idp-references-tab-settings-kebab" kebab menu expanded

    When I click on the "idp-references-tab-settings-kebab-reset-password" button
    Then I should see "reset-password-modal" modal

    When I type in the "modal-textbox-new-password" textbox text "myNewPassword"
    And I type in the "modal-textbox-verify-password" textbox text "myNewPassword"

    When I click on the "modal-button-reset-password" button
    Then I should not see "reset-password-modal" modal
    And I should see "success" alert

  @cleanup
  Scenario: Cleanup: Remove the Identity Provider reference
    Given I delete IdP "idpKeycloak"
