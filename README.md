# rdvue cli [![npm version](https://badge.fury.io/js/rd-vue.svg)](https://badge.fury.io/js/rd-vue)

The [rdvue](https://github.com/realdecoyit/rd-vue/tree/master) Command Line Interface (CLI)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Documentation](#documentation)

## Installation

```bash
npm install rdvue -g
npm install rdvue
```

And then you should be able to run the CLI with

```bash
rdvue --help
```

### Usage

```
RDVUE CLI [Node: 12.13. 1, CLI: 0.0.6]

rdvue [command]

Commands:
  rdvue <action> <feature> <feature name> [options]


rdvue [actions]

Actions:
  generate  g    Creates new feature


rdvue [features]

Features:
  project       Generates a new Vue.js Typescript Single Page Application(SPA)
  component     Generates shell for a basic component with all its base boilerplate code
  page          Generates shell for a basic page with all its base boilerplate code
  service       Generates shell for a basic service with all its base boilerplate code
  model         Generates shell for a basic model/interface


Options:
  --help        Show help                                                   [boolean]
```

## Contributing

RD VUE CLI is a part of the FP Frontend Practice area, where contributions are welcomed, You can help us by fixing bugs, reporting bugs or improving documentation.

Please read the [contributing guidelines](CONTRIBUTING.md).

## Documentation

- [CLI Options](docs/README.md)
- [Frequently Asked Questions](docs/FAQ.md)
