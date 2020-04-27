<div align="center">
  <br/>
  <a href="https://www.realdecoy.com/jamaica/" title="REALDECOY">
    <img width=710px src="https://www.realdecoy.com/wp-content/uploads/2019/02/Realdecoy-logo-transparent.png" alt="rd logo">
  </a>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
</div>

# rdvue [![npm version](https://badge.fury.io/js/rdvue.svg)](https://badge.fury.io/js/rdvue)

The [rdvue](https://github.com/realdecoy/rdvue/tree/master) Command Line Interface (CLI)
The project provides a scaffolded approach to building Single Page Applications with VueJS.
The accompanying CLI tool provides an interactive shell interface to aid in customizing the generated template and expand the project with component modules as needed.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Documentation](#documentation)


[![NPM](https://nodei.co/npm/rdvue.png)](https://nodei.co/npm/rdvue/)

## Installation

```bash
npm install rdvue -g
npm install rdvue
```

Test the CLI by running the help command

```bash
rdvue --help
```

### Usage

```
rdvue [command]

Commands:
  rdvue <action> <feature> <feature name> [options]

Actions:
  generate  Creates new feature
  g         Creates new feature

Features:
  project       Generates a new Vue.js Typescript Single Page Application(SPA)
  component     Generates a new component directory with the following main files to build and test: <component-name>.vue, <component-name>.ts, <component-name>.scss, <component-name>.spec.ts
  page          Generates a new page directory with the following main files to build and test: <page-name>.vue, <page-name>.ts, <page-name>.scss, <page-name>.spec.ts
  service       Generates a new service file within the services directory to integrate methods that should interact with external apis: <service-name>.ts
  model         Generates a new model/interface within the entities directory: <interface-name>.ts

Options:
  --help        Show help                                                   [boolean]
  -h            Show help                                                   [boolean]
```

## Contributing

RD VUE CLI is a part of the FP Frontend Practice area at RealDecoy, where contributions are welcomed, You can help us by fixing bugs, reporting bugs or improving documentation.

Please read the [contributing guidelines](docs/CONTRIBUTING.md)

## Documentation

- [CLI Options](docs/README.md)
- [Frequently Asked Questions](docs/FAQ.md)
