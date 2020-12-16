# CLI Commands
--------------

The Rdvue command line tool (CLI) is the main entry point for getting up and running with the Vue application. Similar documentation is available in the rdvue-cli _README._

### How to use rdvue-cli

All commands will follow the basic structure:

```
npx rdvue [command]
```

### CLI Options

Run the cli option below for a list of commands and options

|     |     |
| --- | --- |
| **Option** | **Description** |
| \--h, --help | Displays the help menu. |

### CLI Commands

Click on each feature name for further details on it.

### _project_

##### Usage

```
$ npx rdvue g project <project name>
```

The CLI will run an interactive shell asking for these options before creating a Project for you:

```
Pick a preset (Use arrow keys)
> Recommend (Buefy, Localization, FontAwesome)
  Vuetify (Vuetify, Localization, FontAwesome)
  Custom
```

#### _The commands below must be run within a valid vue project._

### [_component_](Components.md)

##### Usage

```
$ npx rdvue g component <component name>
```

### _model_

##### Usage

```
$ npx rdvue g component <model name>
```

### [_service_](Services.md)

##### Usage

```
$ npx rdvue g service <service name>
```

### [_page_](Pages.md)

##### Usage

```
$ npx rdvue g page <page name>
```

### [_sm - store module_](Stores.md)

##### Usage

```
$ npx rdvue g sm <sm name>
```

### [_layout_](Layouts.md)

##### Usage

```
$ npx rdvue g sm <sm name>
```