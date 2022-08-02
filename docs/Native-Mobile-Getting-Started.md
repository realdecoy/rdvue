# Native Mobile Setup

Developing native mobile applications with RDVue will require a few adjustments to your environment. Follow the installation steps listed in the official [NativeScript Environment Setup](https://docs.nativescript.org/environment-setup.html) guide before proceeding with the RDVue Mobile template.

After setting up your environment, you can create a new native mobile project by running the following command on the CLI:

```shell
npx rdvue create-project <project-name> --mobile
```

Adding the `--mobile` flag to the end of the `create-project` sub-command will tell RDVue to scaffold your project with the [RDVue Mobile Template](https://github.com/realdecoy/rdvue-mobile-template) instead of the standard [RDVue Web Template](https://github.com/realdecoy/rdvue-template).

## Options

```txt
npx rdvue <action> [<feature>|<plugin>|<plugin group>] [<project-name>|<feature-name>]

Actions:
  add           -  Add a Plugin to a project.

Features:       -  Utilities to create repeatable project elements.
  project       -  Scaffold a new RDVue project.
  component     -  Generate a new Component module.
  page          -  Generate a new Page module.
  service       -  Generate a new Service module.layer

Options:
  --help | -h   -  Show help information.
```


## Validate Installation

We can confirm the successful installation of RDvue in three simple steps:

### Step 1: Create a project

```
npx rdvue create-project <project_name> --mobile
```

Replace `<project_name>` with the actual name of your project.

Generated folders are named in kebab-case.

### Step 2: Install project dependencies

```
cd <project_name>
npm install
```

### Step 3: Emulate project

```
[tns|ns] run [android|ios]
```

The project will be launched in your emulator by default. This information will also be printed out in your terminal.
## Next Steps

### Generating a Page

```
rdvue add:page <page_name>
```

Each generated page gets its dedicated folder. The folder will be given the name of the page. This folder is located at /src/pages/<page\_name> .

### Generating a Component

```
rdvue add:component <component_name>
```