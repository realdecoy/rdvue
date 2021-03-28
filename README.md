<div align="left">
  <br/>
  <a href="https://www.realdecoy.com/jamaica/" title="REALDECOY">
    <img width=400px src="https://www.realdecoy.com/wp-content/uploads/2019/02/Realdecoy-logo-transparent.png" alt="rd logo">
  </a>
  <br/>
</div>

# RDVue [![npm version](https://badge.fury.io/js/rdvue.svg)](https://badge.fury.io/js/rdvue)

[RDVue](https://github.com/realdecoy/rdvue) is an opinionated CLI for generating Vue.js projects. We do so by adopting
a development style guide which enforces strong typing with TypeScript, standardized Component, Layout and Page models,
and a data-layer design promoting unified consumption through Stores and Services.



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/rdvue.svg)](https://npmjs.org/package/rdvue)
[![Downloads/week](https://img.shields.io/npm/dw/rdvue.svg)](https://npmjs.org/package/rdvue)
[![License](https://img.shields.io/npm/l/rdvue.svg)](https://github.com/realdecoy/rdvue/blob/main/package.json)

<!-- toc -->
## Table of Contents

* [Usage](#usage)
* [Options](#options)
<!-- tocstop -->

## Usage
<!-- usage -->

```bash
npx rdvue [command]
```

The help menu can be accessed with the command:

```bash
rdvue --help
```
The current version of rdvue can be retrieved with the command:

```bash
npx rdvue -v|--version|version
```
<!-- usagestop -->

## Options
<!-- options -->

* [`rdvue generate [name]`](#rdvue-generate-name)
* [`rdvue page [name]`](#rdvue-page-file)
* [`rdvue help [command]`](#rdvue-help-command)

### `rdvue generate [name]`

Create a new rdvue project

```
USAGE
  $ rdvue generate [name]

OPTIONS
  -h, --help  show CLI help
```


### `rdvue page [name]`

create page for rdvue project

```
USAGE
  $ rdvue page [name]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/page.ts](https://github.com/realdecoy/rdvue/blob/v0.0.0/src/commands/page.ts)_

### `rdvue help [command]`

display help for rdvue

```
USAGE
  $ rdvue help [command]

ARGUMENTS
  command  command to show help for

OPTIONS
  --all    see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- optionsstop -->

## About

The RDVue CLI is the product of RealDecoy's Frontend Practice group. Contributions are welcome! You can help us by reporting or fixing bugs and giving us feedback on new/existing features.

## Dev Instructions

* clone repo
* checkout rdvue-rebuild branch
* npm link
