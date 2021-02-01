# Template Schema
------

This document provides an overview of the RDvue’s top-level template.json & the manifest.json of each module.

## _template.json_
The template.json file keeps a record of each abstracted template module. This file directs how the CLI will navigate and parse each subsequent template module. The following is a breakdown of the sections that make up template.json.

The template.json file includes the following properties:

### version
A number representing the current version of the file.

``` json
{
  "version": 1
}
```

### sourceDirectory
Source directory for module files that will be copied into a project. Normally points to the base folder of a module.

``` json
{
  "sourceDirectory": "./",
}
```

### features
The features section holds a list of objects with each representing a single feature. Each object holds two properties, name & private.

The name property holds the name of a feature, this the name that you must use when running a command on any of these features.

The private is a boolean which determines whether or not the files of a feature can be overwritten after been initially added to the project. Also, features whose private property is set to true cannot be added by a user.

```json
  "features": [
      {
        "name": "config",
        "private": true
      },
      {
        "name": "store",
        "private": true
      },
      {
        "name": "component",
        "private": false
      },
      {
        "name": "service",
        "private": false
      },
      {
        "name": "model",
        "private": false
      },
      {
        "name": "page",
        "private": false
      },
      {
        "name": "sm",
        "private": false
      }
  ]
  ```

  ### plugins
  The plugins section holds a list of names of the plugins available in RDvue. After setting up your configuration files for a plugin, simply add the name (the name of the module folder for the configuration files of your plugin) to this list to make it available to the CLI for usage.

  ```json
  "plugins": [
    "auth",
    "localization",
    "storybook"
  ]
  ```

### project
The project section is an object which defines what will be installed at project creation. Currently, there are two properties/keys on this object, features & plugin. 

The features property/key is an array holding the name of all features which will be automatically generated at project creation.  

The plugins property/key is an array holding the name of all plugins which will be automatically generated at project creation.

```json
"project": {
    "features": [
      "config",
      "store"
    ],
    "plugins": [
      "storybook"
    ]
  }
```

### groups 

The groups section is used to group plugins that offer similar functionalities.

For example, imagine if we had the following two UI libraries Buefy & Vuetify, we could create a group called ui-library which holds these two plugins.

Each group is represented as an object. Each object has the following properties:

- name - the name of the group

- isMultipleChoice - boolean indicating if more than one option can be selected from this group

- plugins - a list of the names of the plugins that belong to the group

- question - the question prompted to a user when they run the command to add a plugin from a group

Running rdvue add-group <group_name> would prompt a user with the question that belongs to the requested group along with the list of plugins in that group to choose from.
``` json
"project": {
    "features": [
      "config",
      "store"
    ],
    "plugins": [
      "storybook"
    ]
  }
```

### presets
presets are available for a user to quickly scaffold in plugins when creating a project. The presets section of the template.json contains a list of objects. each representing an individual preset. A preset object contains the following properties:

- name - the name of the preset

- description - description of the preset. Conventionally used to list out the plugins that comes with the preset

- plugins- a list of the plugins which the preset will install

```json
 "presets": [
    {
      "name": "Sample Preset 1",
      "description": "Installs storybook, and localization",
      "plugins": [
        "storybook",
        "localization"
      ]
    }
  ]
```

### customPreset
A user can decide to manually select plugins from different groups that they’d like at project creation instead of choosing a preset. The cutomPreset object describes the groups available to a user. It includes the following:

- name - the name displayed to the user

- groups - a list containing the names of the Feature Groups which the user will be able to choose from

``` json
 "customPreset": {
    "groups": [
      "authentication",
      "locale"
    ],
    "name": "custom"
  }
```

### Example _template.json_ file
Here is a sample of what a complete template.json file would look like.

```json
{
  "version": 1,
  "sourceDirectory": "./",
  "features": [
    {
      "name": "config",
      "private": true
    },
    {
      "name": "store",
      "private": true
    },
    {
      "name": "component",
      "private": false
    },
    {
      "name": "service",
      "private": false
    },
    {
      "name": "model",
      "private": false
    },
    {
      "name": "page",
      "private": false
    },
    {
      "name": "sm",
      "private": false
    }
  ],
  "plugins": [
    "auth",
    "localization",
    "storybook"
  ],
  "project": {
    "features": [
      "config",
      "store"
    ],
    "plugins": [
      "storybook"
    ]
  },
  "groups": [
    {
      "name": "authentication",
      "isMultipleChoice": false,
      "plugins": [
        "auth"
      ],
      "question": "Which Authentication Library would you like to install?"
    },
    {
      "name": "locale",
      "isMultipleChoice": false,
      "plugins": [
        "localization"
      ],
      "question": "Which Localization Library would you like to install?"
    }
  ],
  "presets": [
    {
      "name": "Sample Preset 1",
      "description": "Installs storybook, and localization",
      "plugins": [
        "storybook",
        "localization"
      ]
    }
  ],
  "customPreset": {
    "groups": [
      "authentication",
      "locale"
    ],
    "name": "custom"
  }
}
```


# Template Module
------
Modules are self-contained building blocks of a full Vue project. Each module must contain a manifest.json file.

A module.json file is built with the following section. Not all sections will be needed inside every module.json file created. A module.json is composed of the following sections:

### version
The current version of the file.
 
```
"version": 1
```

### name 
Name of the module (e.g component)
```
  "name": "component"
```

### description
A description of the module. This is also displayed inside the CLI help menu for each Module.

```
"description": "Generate a basic components needed for basic authenticaton."
```
### sourceDirectory

Source directory for module files that get copied into a project. Normally points to the base folder of a module.

```
  "sourceDirectory": "./"
```

### installDirectory

the location that the module should be generated in the Vue project.

### files

a list of files that exist in the module that needs to be copied to the install directory. The files in this list can either be either of the following:

- a string (if the file should be copied as-is)

```json
"files": [
    {
      "source": "store/auth.ts",
      "target": "store/auth.ts"
    },
    {
      "source": "services/auth.ts",
      "target": "services/auth.ts"
    },
    {
      "source": "model/user.ts",
      "target": "model/user.ts"
    },
    {
      "source": "pages/register/index.ts",
      "target": "pages/auth/register/index.ts"
    },
    {
      "source": "pages/register/register.ts",
      "target": "pages/auth/register/register.ts"
    },
    {
      "source": "pages/register/register.scss",
      "target": "pages/auth/register/register.scss"
    },
    {
      "source": "pages/register/register.vue",
      "target": "pages/auth/register/register.vue"
    },
    {
      "source": "pages/login/index.ts",
      "target": "pages/auth/login/index.ts"
    },
    {
      "source": "pages/login/login.ts",
      "target": "pages/auth/login/login.ts"
    },
    {
      "source": "pages/login/login.scss",
      "target": "pages/auth/login/login.scss"
    },
    {
      "source": "pages/login/login.vue",
      "target": "pages/auth/login/login.vue"
    },
    {
      "source": "pages/forget-password/index.ts",
      "target": "pages/auth/forget-password/index.ts"
    },
    {
      "source": "pages/forget-password/forget-password.ts",
      "target": "pages/auth/forget-password/forget-password.ts"
    },
    {
      "source": "pages/forget-password/forget-password.scss",
      "target": "pages/auth/forget-password/forget-password.scss"
    },
    {
      "source": "pages/forget-password/forget-password.vue",
      "target": "pages/auth/forget-password/forget-password.vue"
    }
  ]
```

- object with required properties:
    - source and target (for change of name if necessary)  
    - and an optional content list of objects for finding and replacing content within the file - 

    ``` json
    "files": [
      {
        "source": "index.ts",
        "target": "index.ts",
        "content": [
          {
            "matchRegex": "__COMPONENT__KEBAB__",
            "replace": "${componentNameKebab}"
          }
        ]
      },
      {
        "source": "component.scss",
        "target": "${componentNameKebab}.scss",
        "content": [
          {
            "matchRegex": "__COMPONENT__",
            "replace": "${componentNameKebab}"
          }
        ]
      },
      {
        "source": "component.ts",
        "target": "${componentNameKebab}.ts",
        "content": [
          {
            "matchRegex": "__COMPONENT__KEBAB__",
            "replace": "${componentNameKebab}"
          },
          {
            "matchRegex": "__COMPONENT__",
            "replace": "${componentName}"
          }
        ]
      },
      {
        "source": "component.spec.js",
        "target": "${componentNameKebab}.spec.js",
        "content": [
          {
            "matchRegex": "__COMPONENT__KEBAB__",
            "replace": "${componentNameKebab}"
          },
          {
            "matchRegex": "__COMPONENT__",
            "replace": "${componentName}"
          }
        ]
      },
      {
        "source": "component.vue",
        "target": "${componentNameKebab}.vue",
        "content": [
          {
            "matchRegex": "__COMPONENT__",
            "replace": "${componentNameKebab}"
          }
        ]
      }
  ]
```

  _Note: files section can be a combination of both types mentioned above._

### packages
This section is an object that holds the npm packages to be installed with the module. This object contains two properties dependencies and devDependencies. Each holds a list of the name of the dependencies to be installed.

The dependencies section holds dependencies required for the module to work (dev and production) while the devDependencies section holds the dependencies that are only needed during development.

```json
 "packages": {
    "dependencies": ["vue-i18n"],
    "devDependencies": ["vue-cli-plugin-i18n"]
  }
```

_There’s currently no support for specifying package versions._

### routes
You have the ability to inject a route into the application to allow users to preview a module (feature or plugin) after installing it. 

The routes section of the manifest.json allows you to define an array of routes. Here’s an example:

```
  "routes": [
    {
      "path": "'/buefy-sample'",
      "name": "'buefy-sample'",
      "component": "`require('@/pages/buefy-sample/buefy-sample.vue').default`"
    }
  ]
```

- path: relative URL where module component (.vue file) can be viewed

- name: name of the route

- component: the sample component created as a part of your module 

Any number of modules can have a routes section. Therefore, each route definition is programmatically added to an array of route definitions found in .rdvue/routes.js at the root of an RDvue project. The definitions found in this array are then automatically loaded into the router.ts file. Here’s an example:

``` javascript
export default [{
  path: '/buefy-sample',
  name: 'buefy-sample',
  component: require('@/pages/buefy-sample/buefy-sample.vue').default
 },];
```

### vueOptions
Plugin options needed in vue.config for module to work

```
"vueOptions": {
    "transpileDependencies": [
      "'vuetify'"
    ]
  }
```
All vueOptions are automatically added to the exports object in .rdvue/options.js. This module is then loaded in vue.config.js and used as part of its plugin options.
 
```
module.exports = {
  transpileDependencies: 'vuetify',
};
```

### modules

Configuration imports needed for your module to work. These configs are store in the src/config folder.

```
  "modules": {
    "vuetify": "`require('@/config/vuetify').default`"
  } 
```