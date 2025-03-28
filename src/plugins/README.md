# FreeIPA Modern WebUI: Plugin Developer Guide

This guide explains how to create and implement plugins for the FreeIPA Modern WebUI. The plugin system allows extending the WebUI functionality without modifying the core application.

## Table of Contents

1. [Plugin System Overview](#plugin-system-overview)
2. [Plugin Structure](#plugin-structure)
3. [Step-by-Step Guide](#step-by-step-guide)
4. [Extension Points](#extension-points)
5. [Real-World Examples](#real-world-examples)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Plugin System Overview

The FreeIPA Modern WebUI implements a plugin architecture that allows developers to:

- Add new content to various parts of the UI
- Customize existing functionality
- Add new features without modifying core code

Plugins are registered at application startup and can provide extensions to predefined extension points. Each plugin consists of React components, metadata, and optional lifecycle hooks.

## Plugin Structure

A plugin consists of the following key elements:

### Plugin Module

Each plugin must export a `PluginModule` object with these properties:

- **id**: Unique identifier for the plugin
- **name**: Display name of the plugin
- **version**: Plugin version
- **description**: Brief description of what the plugin does
- **author** (optional): Plugin author information
- **extensions**: Array of extension components
- **initialize** (optional): Function called when the plugin is registered
- **cleanup** (optional): Function called when the application is unloaded

### Extension Component

Each extension connects a React component to a specific extension point:

- **extensionPointId**: Reference to the extension point
- **component**: React component to render
- **priority** (optional): Determines rendering order
- **metadata** (optional): Additional configuration data

## Step-by-Step Guide

### 1. Create Plugin Directory

Create a new directory for your plugin in the `src/plugins` folder:

```
src/plugins/my-custom-plugin/
```

### 2. Create Plugin Components

Create your React components in a `components` subdirectory:

```
src/plugins/my-custom-plugin/components/MyCustomComponent.tsx
```

```typescript
// Example component
import { useEffect, useState } from "react";

interface MyComponentProps {
  // Define props based on extension point requirements
  someProperty?: string;
}

const MyCustomComponent = (props: MyComponentProps) => {
  const { someProperty } = props;

  // Your component implementation
  return (
    <div className="my-custom-component">
      <h3>My Custom Plugin</h3>
      <p>This is a custom extension component.</p>
      {someProperty && <p>Property: {someProperty}</p>}
    </div>
  );
};

export default MyCustomComponent;
```

### 3. Define Plugin Module

Create an `index.ts` file in your plugin directory:

```
src/plugins/my-custom-plugin/index.ts
```

```typescript
import { PluginModule } from "src/core/plugins/types";
import { dashboardContent } from "src/core/plugins/types";
import MyCustomComponent from "./components/MyCustomComponent";

// Define your plugin
const myCustomPlugin: PluginModule = {
  id: "my-custom-plugin",
  name: "My Custom Plugin",
  version: "1.0.0",
  description: "A custom plugin for FreeIPA WebUI",
  author: "Your Name",

  // Define extensions
  extensions: [
    {
      extensionPointId: dashboardContent,
      component: () => <MyCustomComponent />,
      priority: 100,
    },
  ],

  // Optional lifecycle hooks
  initialize: () => {
    console.info("My Custom Plugin initialized");
    // Perform setup tasks
  },

  cleanup: () => {
    console.info("My Custom Plugin cleanup");
    // Perform cleanup tasks
  },
};

export default myCustomPlugin;
```

### 4. Register Your Plugin

Update the main plugins index file at `src/plugins/index.ts`:

```typescript
import { pluginRegistry } from "src/core/plugins";

// Import all plugins
import helloWorldPlugin from "./hello-world";
import { userStatusPlugin } from "./user-status";
import { hostGroupDNColumnPlugin } from "./hostgroup-dn-column";
import myCustomPlugin from "./my-custom-plugin"; // Add your plugin import

/**
 * Register all plugins with the plugin registry
 */
export function registerAllPlugins(): void {
  // Add all plugins to be registered here
  const plugins = [
    helloWorldPlugin,
    userStatusPlugin,
    hostGroupDNColumnPlugin,
    myCustomPlugin, // Add your plugin to the array
  ];

  // Register each plugin
  plugins.forEach((plugin) => {
    try {
      pluginRegistry.registerPlugin(plugin);
    } catch (error) {
      console.error(`Failed to register plugin ${plugin.id}:`, error);
    }
  });

  console.info("Plugin registration complete");
}
```

## Extension Points

The application defines several extension points where plugins can add content:

### Available Extension Points

- **dashboardContent**: Add content to the main dashboard
- **userEditForm**: Add fields to the user edit form
- **hostGroupsTableColumns**: Add columns to the Host Groups table
- **loginCustomization**: Customize the login page appearance

To use an extension point, reference it in your plugin's extensions array:

```typescript
import { dashboardContent } from "src/core/plugins/types";

extensions: [
  {
    extensionPointId: dashboardContent,
    component: () => <MyComponent />,
  },
],
```

### Creating Custom Extension Points

You are not limited to the predefined extension points. You can create your own extension points to make your application even more extensible.

#### 1. Define a Custom Extension Point

Add your extension point in a file where it makes sense for your feature:

```typescript
// src/features/my-feature/extensionPoints.ts
import { ExtensionPoint } from "src/core/plugins/types";

export const myFeatureSettings: ExtensionPoint = {
  id: "myFeatureSettings",
  displayName: "My Feature Settings",
  description: "Add custom settings to My Feature",
};
```

#### 2. Add it to the types

To have proper TypeScript support, add your extension point to the `ExtensionPointId` type in your local project:

```typescript
// src/core/plugins/custom-types.ts
import {
  ExtensionPointId as CoreExtensionPointId,
  dashboardContent,
  userEditForm,
} from "src/core/plugins/types";
import { myFeatureSettings } from "src/features/my-feature/extensionPoints";

// Extend the core extension point type
export type ExtensionPointId = CoreExtensionPointId | typeof myFeatureSettings;
```

#### 3. Create an Extension Slot

Add an extension slot in your component where you want the extensions to render:

```typescript
// src/features/my-feature/MyFeature.tsx
import { ExtensionSlot } from "src/core/plugins/ExtensionSlot";
import { myFeatureSettings } from "./extensionPoints";

const MyFeature = () => {
  return (
    <div className="my-feature">
      <h2>My Feature</h2>

      {/* This will render any extension targeting myFeatureSettings */}
      <div className="my-feature-settings">
        <h3>Settings</h3>
        <ExtensionSlot extensionPointId={myFeatureSettings} />
      </div>
    </div>
  );
};
```

#### 4. Create Extensions for Your Custom Extension Point

Other plugins can now target your extension point:

```typescript
// src/plugins/feature-settings/index.ts
import { PluginModule } from "src/core/plugins/types";
import { myFeatureSettings } from "src/features/my-feature/extensionPoints";
import FeatureSettingsComponent from "./components/FeatureSettingsComponent";

const featureSettingsPlugin: PluginModule = {
  id: "feature-settings",
  name: "Feature Settings Plugin",
  version: "1.0.0",
  description: "Adds custom settings to My Feature",

  extensions: [
    {
      extensionPointId: myFeatureSettings,
      component: () => <FeatureSettingsComponent />,
      priority: 100,
    },
  ],
};

export default featureSettingsPlugin;
```

Creating custom extension points allows different parts of your application to be extended independently, promoting a more modular architecture.

## Real-World Examples

Here are some examples from the existing plugins to help you understand how to implement various features:

### User Status Plugin

The User Status plugin adds a status field to the user edit form:

```typescript
// Simplified example
const userStatusPlugin: PluginModule = {
  id: "user-status",
  name: "User Status Plugin",
  version: "1.0.0",
  description: "Adds user status field to user forms",

  extensions: [
    {
      extensionPointId: userEditForm,
      component: (props) => <UserStatusField {...props} />,
    },
  ],
};
```

### Login Customizer Plugin

Customizes the login page with a logo and text:

```typescript
// Simplified example
const loginCustomizerPlugin: PluginModule = {
  id: "login-customizer",
  name: "Login Customizer",
  version: "1.0.0",
  description: "Customizes the login page appearance",

  extensions: [
    {
      extensionPointId: loginCustomization,
      component: (props) => <LoginCustomizerComponent {...props} />,
    },
  ],
};
```

## Best Practices

1. **Use TypeScript**: Define proper interfaces for your components and props
2. **Follow Naming Conventions**:

   - Plugin directories: kebab-case (e.g., `my-custom-plugin`)
   - Component files: PascalCase (e.g., `MyComponent.tsx`)
   - Plugin ID: kebab-case (e.g., `"my-custom-plugin"`)

3. **Error Handling**:

   - Always handle potential errors in your components
   - Use try/catch blocks in lifecycle hooks

4. **Clean Up Resources**:

   - Implement the cleanup method to remove event listeners, subscriptions, etc.
   - Use useEffect cleanup functions in components

5. **Performance**:

   - Keep components small and focused
   - Use memoization when appropriate
   - Avoid unnecessary renders

6. **Code Organization**:

   - Keep related files in appropriate directories
   - Use index.ts files for exporting

7. **Consistency**:
   - Follow existing patterns in the codebase
   - Use PatternFly components for UI consistency

## Troubleshooting

### Common Issues

1. **Plugin not loading**:

   - Check the browser console for errors
   - Verify that your plugin is properly registered in `src/plugins/index.ts`
   - Ensure your plugin ID is unique

2. **Component not rendering**:

   - Confirm the extension point ID is correct
   - Check that your component is properly exported
   - Verify props are being handled correctly

3. **TypeScript errors**:

   - Ensure you're using proper types from `src/core/plugins/types.ts`
   - Use `unknown` instead of `any` for better type safety

4. **React warnings**:
   - Use the React DevTools to identify issues
   - Check component key props in lists
   - Ensure proper dependency arrays in useEffect hooks

### Debugging Tips

- Use `console.info` in lifecycle hooks to verify registration
- Add temporary UI indicators to confirm extension points are working
- Check the Redux store for plugin-related state changes
- Test components in isolation before integrating them as plugins

---

This guide covers the basics of creating and implementing plugins for the FreeIPA Modern WebUI. For more advanced scenarios or specific questions, refer to the core plugin implementation files or existing plugin examples.
