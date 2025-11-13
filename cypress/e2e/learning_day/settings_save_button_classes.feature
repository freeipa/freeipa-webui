Feature: Settings page > Save button classes
    Verify that the Save button on all Settings pages has the pf-m-primary and pf-m-small classes when enabled

    @seed
    Scenario: Prep: Create page for each entity to test
        Given User "jdoe" "John" "Doe" exists and is using password "Secret123"
        Given sudo rule "sudo-rule-1" exists

    @test
    Scenario Outline: <page_type> Settings Save button has pf-m-primary and pf-m-small classes
        Given I am logged in as admin
        And I am on "<page_type>/<type_created_entity>" page

        When I modify the "<field_data_cy>" "<field_type>" field to enable the Save button
        Then I should see the "<save_button_data_cy>" button is enabled
        And the "<save_button_data_cy>" button should have the "pf-m-primary" class
        And the "<save_button_data_cy>" button should have the "pf-m-small" class

        # Examples for each entity type.
        # Currently only testing for active-users and sudo-rules, but can be expanded to other entity types.
        Examples:
            | page_type    | type_created_entity | field_data_cy                      | field_type | save_button_data_cy                 |
            | active-users | jdoe                | user-tab-settings-textbox-jobtitle | textbox    | user-tab-settings-button-save       |
            | sudo-rules   | sudo-rule-1         | sudo-rule-textbox-description      | textbox    | sudo-rules-tab-settings-button-save |

    @cleanup
    Scenario: Cleanup: Delete created entities
        Given I delete user "jdoe"
        Given I delete sudo rule "sudo-rule-1"