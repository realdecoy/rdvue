# Plugin Custom Scripting

## Overview

This document is dedicated to elucidating concepts surrounding the implementation of custom scripting within the RDVue CLI. The idea is to establish some controlled way for a user to incorporate a piece of custom script that will carry out a specific task and have that script executed dynamically whenever a command is ran. This adds a new layer of flexibility to the CLI tool, as developers will now be able to add smaller functionalities to RDVue without implementing new commands.

## Implementation

Changes will be made to a few core elements within the tool to properly facilitate the integration of custom scripting. The manifest.json will receive the following new key-value pairs:

**script**

An object consisting of the following key-value pair:

_**path**_

A string value which denotes the current path to the script to be executed.

_**runOnce**_

A boolean value denoting whether or not to execute the script more than once.

```
{
  script:{
      runOnce: true
      path: './some-custom-script.js'
    }
}
```

Data retrieved from these manifest arguments will be passed to a method from the custom-script.ts that will handle the execution of said script file. The custom-script.ts will be defined in the following directory **'src/modules/custom-script.ts'** and will encompass all the methods necessary for the module.

## Specifications

*   The function name used within the developer’s custom script file should match the name **custom.**
    
*   The module has to be defaultly exported from within the developer’s script file.
    
*   The module being imported should be written in **ECMA Script**.
    
*   The level of supported ECMA Script is **ES9** and lower.
    
*   External dependencies utilized within the developer’s script must be supported within RDVue’s current node version (**v 14**).
    

## Execution

Upon running the custom script module, verification checks will be conducted on the script to ensure that it meets the minimum requirement for execution. Should the script not meet any of these requirements an error message will be printed to the console clearly denoting the reasons for the execution’s failure. Otherwise the script will be ran and after its execution a success message will be outputted to the console. The script will also execute based on whether the user desires it to be ran once or ran infinitely, this data will be persisted in a .txt file inside the folder of the module running the custom script.

## Output

The custom scripts module outputs one of two message types :

**error**

An error value that holds all of the information pertaining to issues that occured during script execution.

```
Error: Unable to locate exported function with the name 'custom' ❌
```

**success**

A success value that denotes to the user that their script has been successfully executed.

```
Your custom script has been successfully executed ✔️ 
```