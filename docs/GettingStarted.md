<div align="left">
  <br/>
  <a href="https://www.realdecoy.com/jamaica/" title="REALDECOY">
    <img width=400px src="https://www.realdecoy.com/wp-content/uploads/2019/02/Realdecoy-logo-transparent.png" alt="rd logo">
  </a>
  <br/>
</div>

# Getting Started - RDVue [![npm version](https://badge.fury.io/js/rdvue.svg)](https://badge.fury.io/js/rdvue)
------------------------
This section will get you started on how to prepare your environment, install RDvue, create a project and how to run in development mode.

The RDvue tool is predominantly written in node and TypeScript

Dependencies
============

First we need to cover the basic system requirements needed for running RDvue. The Rdvue CLI has a few requirements which includes:

|     |     |     |
| --- | --- | --- |
| **Package** | **Version** | **Source** |
| Node | **To be confirmed with team** | [https://nodejs.org/en/download/](https://nodejs.org/en/download/) |
| Npm | **To be confirmed with team** | [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm) |
| Bash | \-  | [https://www.gnu.org/software/bash/](https://www.gnu.org/software/bash/) |

!> Important: For a smooth experience with running the commands throughout this documentation, configure your IDE to use bash as it’s default shell when working within an RDVue project.

Installation
------------

After installing the dependencies mentioned above you are now ready to install RDvue. Run the <mark>following npm command</mark>

```
npm install rdvue -g
```

Validate Installation
---------------------

We can confirm the successful installation of RDvue in three simple steps:

### Step 1: Create a project

```
rdvue generate project <project_name>
```

Replace `<project_name>` with the actual name of your project.

?>Generated folders are named in kebab-case.

### Step 2: Install project dependencies

```
cd <project_name>
npm install
```

### Step 3: Serve project

```
npm run serve
```

The project will be served at [http://localhost:8080/](http://localhost:8080/) by default. This information will also be printed out in your terminal. Visiting the link the app is served on will display a default page which was created on project creation.

[Continue - Folder Structure](notableFiles.md)