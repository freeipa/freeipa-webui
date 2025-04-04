# FreeIPA WebUI Plugins

This directory contains plugins for the FreeIPA WebUI. Plugins allow extending the functionality of the WebUI without modifying the core codebase.

## Available Plugins

### Hello World Plugin

A simple example plugin that adds a greeting to the dashboard.

### User Status Plugin

Adds the ability to view and edit a user's status in the FreeIPA WebUI.

- **Features**:

  - Displays user status in the user details page under the "Miscellaneous" section
  - Allows editing user status through the user edit form
  - Supports three status values: Active, Inactive, and Disabled

- **How to View**:

  1. Navigate to **Identity > Users > Active Users**
  2. Select a user from the list to view their details
  3. Scroll to the bottom of the page to find the "Miscellaneous" section
  4. The User Status widget will display the current status of the user

- **How to Edit**:
  1. Navigate to **Identity > Users > Active Users**
  2. Select a user from the list to view their details
  3. Click the **Edit** button at the top of the page
  4. Scroll down to find the "User Status" field in the form
  5. Select the desired status using the radio buttons
  6. Click **Save** to apply the changes

## Plugin Development

### Extension Points

FreeIPA WebUI provides several extension points where plugins can add content:

- `dashboardContent`: Add content to the main dashboard
- `userDetailsContent`: Add content to the user details page
- `userEditForm`: Add fields to the user edit form
- `navigationItems`: Add items to the main navigation

See example implementations in the `hello-world` and `user-status` directories.

### Plugin Structure

A typical plugin has the following structure:

```
src/plugins/my-plugin/
├── README.md                # Documentation for the plugin
├── index.ts                 # Plugin definition and registration
├── api/                     # API services for the plugin
└── components/              # UI components for the plugin
```

### Plugin Registration

Plugins must be registered in `src/plugins/index.ts` to be loaded by the application.
