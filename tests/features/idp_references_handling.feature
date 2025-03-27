Feature: Identity provider references manipulation
  Create and delete identity provider references

  Background:
    Given I am logged in as "Administrator"
    Given I am on "identity-provider-references" page

  Scenario: Add a new 'Keycloak or Red Hat SSO' identity provider reference (with no secret)
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

  Scenario: Add a new 'Keycloak or Red Hat SSO' identity provider reference (with secret)
    When I click on "Add" button
    Then I see "Add Identity Provider reference" modal
    * In the modal, I type into the field with ID "identity-provider-reference-name" text "idpSecretKeycloak"
    * In the modal, I type into the field with ID "client-id" text "idpKeycloakSecretClient"
    * In the modal, I type into the field with ID "secret" text "mySecret"
    * In the modal, I type into the field with ID "verify-secret" text "mySecret"
    * in the modal dialog I check "Pre-defined IdP template" radio selector
    * I click in the "Provider type" selector field
    * I select "Keycloak or Red Hat SSO" option in the "Provider type" selector
    * In the modal, I type into the field with ID "org" text "mySecretOrg"
    * In the modal, I type into the field with ID "base-url" text "mySecretOrg.example.test"
    * In the modal, I type into the field with ID "scope" text "myScopeSecretKeycloak"
    * In the modal, I type into the field with ID "ext-idp-uid-attr" text "exampleAttributeSecretKeycloak"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Identity provider successfully added"
    * I close the alert
    Then I should see "idpSecretKeycloak" entry in the data table with ID "identity-provider-references-table"

  Scenario: Add a new Google identity provider reference
    When I click on "Add" button
    Then I see "Add Identity Provider reference" modal
    * In the modal, I type into the field with ID "identity-provider-reference-name" text "idpGoogle"
    * In the modal, I type into the field with ID "client-id" text "idpGoogleClient"
    * in the modal dialog I check "Pre-defined IdP template" radio selector
    * I click in the "Provider type" selector field
    * I select "Google" option in the "Provider type" selector
    * In the modal, I type into the field with ID "scope" text "myScopeGoogle"
    * In the modal, I type into the field with ID "ext-idp-uid-attr" text "exampleAttributeGoogle"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Identity provider successfully added"
    * I close the alert
    Then I should see "idpGoogle" entry in the data table with ID "identity-provider-references-table"

  Scenario: Add a new Github identity provider reference
    When I click on "Add" button
    Then I see "Add Identity Provider reference" modal
    * In the modal, I type into the field with ID "identity-provider-reference-name" text "idpGithub"
    * In the modal, I type into the field with ID "client-id" text "idpGithubClient"
    * in the modal dialog I check "Pre-defined IdP template" radio selector
    * I click in the "Provider type" selector field
    * I select "Github" option in the "Provider type" selector
    * In the modal, I type into the field with ID "scope" text "myScopeGithub"
    * In the modal, I type into the field with ID "ext-idp-uid-attr" text "exampleAttributeGithub"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Identity provider successfully added"
    * I close the alert
    Then I should see "idpGithub" entry in the data table with ID "identity-provider-references-table"

  Scenario: Add a new 'Microsoft or Azure' identity provider reference
    When I click on "Add" button
    Then I see "Add Identity Provider reference" modal
    * In the modal, I type into the field with ID "identity-provider-reference-name" text "idpMicrosoft"
    * In the modal, I type into the field with ID "client-id" text "idpMicrosoftClient"
    * in the modal dialog I check "Pre-defined IdP template" radio selector
    * I click in the "Provider type" selector field
    * I select "Microsoft or Azure" option in the "Provider type" selector
    * In the modal, I type into the field with ID "org" text "myOrg2"
    * In the modal, I type into the field with ID "scope" text "myScopeMicrosoft"
    * In the modal, I type into the field with ID "ext-idp-uid-attr" text "exampleAttributeMicrosoft"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Identity provider successfully added"
    * I close the alert
    Then I should see "idpMicrosoft" entry in the data table with ID "identity-provider-references-table"

  Scenario: Add a new 'Okta' identity provider reference
    When I click on "Add" button
    Then I see "Add Identity Provider reference" modal
    * In the modal, I type into the field with ID "identity-provider-reference-name" text "idpOkta"
    * In the modal, I type into the field with ID "client-id" text "idpOktaClient"
    * in the modal dialog I check "Pre-defined IdP template" radio selector
    * I click in the "Provider type" selector field
    * I select "Okta" option in the "Provider type" selector
    * In the modal, I type into the field with ID "org" text "myOrg3"
    * In the modal, I type into the field with ID "base-url" text "myOrg3.example.test"
    * In the modal, I type into the field with ID "scope" text "myScopeOkta"
    * In the modal, I type into the field with ID "ext-idp-uid-attr" text "exampleAttributeOkta"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Identity provider successfully added"
    * I close the alert
    Then I should see "idpOkta" entry in the data table with ID "identity-provider-references-table"

  Scenario: Add a new Custom identity provider reference
    Given I am on "identity-provider-references" page
    When I click on "Add" button
    Then I see "Add Identity Provider reference" modal
    * In the modal, I type into the field with ID "identity-provider-reference-name" text "idpCustom"
    * In the modal, I type into the field with ID "client-id" text "idpCustomClient"
    * in the modal dialog I check "Custom IdP definition" radio selector
    * In the modal, I type into the field with ID "auth-uri" text "https://myUri.example.test"
    * In the modal, I type into the field with ID "dev-auth-uri" text "https://myAuthDev.example.test"
    * In the modal, I type into the field with ID "token-uri" text "https://myToken.example.test"
    * In the modal, I type into the field with ID "user-info-uri" text "https://myUserInfo.example.test"
    * In the modal, I type into the field with ID "jwks-uri" text "https://myJwks.example.test"
    * In the modal, I type into the field with ID "scope" text "myCustomScope"
    * In the modal, I type into the field with ID "ext-idp-uid-attr" text "exampleAttributeCustom"
    When in the modal dialog I click on "Add" button
    * I should see "success" alert with text "Identity provider successfully added"
    * I close the alert
    Then I should see "idpCustom" entry in the data table with ID "identity-provider-references-table"

  Scenario: Delete identity provider references
    Given I should see "idpKeycloak" entry in the data table with ID "identity-provider-references-table"
    Given I should see "idpSecretKeycloak" entry in the data table with ID "identity-provider-references-table"
    Given I should see "idpGoogle" entry in the data table with ID "identity-provider-references-table"
    Given I should see "idpGithub" entry in the data table with ID "identity-provider-references-table"
    Given I should see "idpMicrosoft" entry in the data table with ID "identity-provider-references-table"
    Given I should see "idpOkta" entry in the data table with ID "identity-provider-references-table"
    Given I should see "idpCustom" entry in the data table with ID "identity-provider-references-table"
    # idpOkta and idpCustom are removed in the next step
    Then I select entry "idpOkta" in the data table
    Then I select entry "idpCustom" in the data table
    When I click on "Delete" button
    * I see "Remove Identity Provider references" modal
    * I should see "idpOkta" entry in the data table
    * I should see "idpCustom" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Identity Providers removed"
    * I close the alert
    Then I should not see "idpOkta" entry in the data table
    Then I should not see "idpCustom" entry in the data table
    # idpKeycloak, idpSecretKeycloak and idpGoogle are removed in the next step
    Then I select entry "idpKeycloak" in the data table
    * I select entry "idpSecretKeycloak" in the data table
    * I select entry "idpGoogle" in the data table
    When I click on "Delete" button
    * I see "Remove Identity Provider references" modal
    * I should see "idpKeycloak" entry in the data table
    * I should see "idpSecretKeycloak" entry in the data table
    * I should see "idpGoogle" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Identity Providers removed"
    * I close the alert
    Then I should not see "idpKeycloak" entry in the data table
    * I should not see "idpSecretKeycloak" entry in the data table
    * I should not see "idpGoogle" entry in the data table
    # idpGithub and idpMicrosoft are removed in the next step
    Then I select entry "idpGithub" in the data table
    Then I select entry "idpMicrosoft" in the data table
    When I click on "Delete" button
    * I see "Remove Identity Provider references" modal
    * I should see "idpGithub" entry in the data table
    * I should see "idpMicrosoft" entry in the data table
    When in the modal dialog I click on "Delete" button
    * I should see "success" alert with text "Identity Providers removed"
    * I close the alert
    Then I should not see "idpGithub" entry in the data table
    Then I should not see "idpMicrosoft" entry in the data table

