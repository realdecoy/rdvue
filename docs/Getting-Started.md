# Getting Started

[RDVue](https://github.com/realdecoy/rdvue) is an opinionated CLI for generating Vue.js projects. We do so by adopting
a development style guide which enforces strong typing with TypeScript, standardized Component, Layout and Page models,
and a data-layer design promoting unified consumption through Stores and Services.


## Usage

```bash
npx rdvue <action>
```

Global installation (this allows you to exclude the <code>npx</code> part of the command):

```bash
npm install rdvue -g
rdvue <action>
```


## Options

```txt
npx rdvue <action>:<feature>

Actions:
  create-project   -  Scaffold a new rdvue project
  add              -  Add a feature to a project
  plugin           -  Inject a utility to extend project functionality
  upgrade          -  Specify the rdvue template version for a project
    
Options:
  --help | -h      -  Show help information

```


## Validate Installation

We can confirm the successful installation of RDvue in three simple steps:

### Step 1: Create a project

```
npx rdvue create-project <project-name>
```

Replace `<project-name>` with the actual name of your project.

Generated folders are named in kebab-case.

### Step 2: Install project dependencies

```
cd <project-name>
npm install
```

### Step 3: Serve project

```
npm run serve
```

The project will be served at [http://localhost:8080/](http://localhost:8080/) by default. This information will also be printed out in your terminal. Visiting the link the app is served on will display a default page which was created on project creation.


## Next Steps

### Generating a Page

```
rdvue add:page <page-name>
```

Each generated Page gets its own dedicated folder. The folder will be given the name of the page. This folder is located at /src/pages/<page\-name> .

### Generating a Component

```
rdvue generate component <component-name>
rdvue g component <component-name>
```