Feature: Kerberos ticket policy page
  Modify Kerberos ticket policy properties

  Background:
    Given I am logged in as "Administrator"
    Given I am on "kerberos-ticket-policy" page

  # Kerberos ticket policy
  Scenario: Set max renew
    When I clear the field "krbmaxrenewableage"
    And I type in the field with ID "krbmaxrenewableage" the text "606700"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set max life
    When I clear the field "krbmaxticketlife"
    And I type in the field with ID "krbmaxticketlife" the text "87000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  # Authentication indicators
  Scenario: Set RADIUS max renew
    When I clear the field "krbauthindmaxrenewableage_radius"
    And I type in the field with ID "krbauthindmaxrenewableage_radius" the text "250000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set hardened max renew
    When I clear the field "krbauthindmaxrenewableage_hardened"
    And I type in the field with ID "krbauthindmaxrenewableage_hardened" the text "300000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set RADIUS max life
    When I clear the field "krbauthindmaxticketlife_radius"
    And I type in the field with ID "krbauthindmaxticketlife_radius" the text "500000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set hardened max life
    When I clear the field "krbauthindmaxticketlife_hardened"
    And I type in the field with ID "krbauthindmaxticketlife_hardened" the text "600000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set OTP max renew
    When I clear the field "krbauthindmaxrenewableage_otp"
    And I type in the field with ID "krbauthindmaxrenewableage_otp" the text "350000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set IdP max renew
    When I clear the field "krbauthindmaxrenewableage_idp"
    And I type in the field with ID "krbauthindmaxrenewableage_idp" the text "400000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set OTP max life
    When I clear the field "krbauthindmaxticketlife_otp"
    And I type in the field with ID "krbauthindmaxticketlife_otp" the text "450000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set IdP max life
    When I clear the field "krbauthindmaxticketlife_idp"
    And I type in the field with ID "krbauthindmaxticketlife_idp" the text "550000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set PKINIT max renew
    When I clear the field "krbauthindmaxrenewableage_pkinit"
    And I type in the field with ID "krbauthindmaxrenewableage_pkinit" the text "150000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set passkey max renew
    When I clear the field "krbauthindmaxrenewableage_passkey"
    And I type in the field with ID "krbauthindmaxrenewableage_passkey" the text "280000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set PKINIT max life
    When I clear the field "krbauthindmaxticketlife_pkinit"
    And I type in the field with ID "krbauthindmaxticketlife_pkinit" the text "250000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  Scenario: Set passkey max life
    When I clear the field "krbauthindmaxticketlife_passkey"
    And I type in the field with ID "krbauthindmaxticketlife_passkey" the text "300000"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert

  # Cleanup - Clear all values and assign defaults to Max renew and Max life
  Scenario: Cleanup of values
    When I clear the field "krbmaxrenewableage"
    And I type in the field with ID "krbmaxrenewableage" the text "656000"
    And I clear the field "krbmaxticketlife"
    And I type in the field with ID "krbmaxticketlife" the text "86400"
    And I clear the field "krbauthindmaxrenewableage_radius"
    And I clear the field "krbauthindmaxrenewableage_hardened"
    And I clear the field "krbauthindmaxticketlife_radius"
    And I clear the field "krbauthindmaxticketlife_hardened"
    And I clear the field "krbauthindmaxrenewableage_otp"
    And I clear the field "krbauthindmaxrenewableage_idp"
    And I clear the field "krbauthindmaxticketlife_otp"
    And I clear the field "krbauthindmaxticketlife_idp"
    And I clear the field "krbauthindmaxrenewableage_pkinit"
    And I clear the field "krbauthindmaxrenewableage_passkey"
    And I clear the field "krbauthindmaxticketlife_pkinit"
    And I clear the field "krbauthindmaxticketlife_passkey"
    Then I click on "Save" button
    * I should see "success" alert with text "Kerberos ticket policy updated"
    * I close the alert
