# Plugin Custom Scripting
--------------------

Overview
========

This document is dedicated to elucidating concepts surrounding the implementation of custom scripting within the rdvue cli tool. The idea is to establish some controlled way for a user to incoporate a piece of custom script that will carry out a specific task and have that script executed dynamically whenever a command is ran. This adds a new layer of flexibility to the CLI tool, as developers will now be able to add smaller functionalities to rdvue without implmenting new commands.

Implementation
==============

Changes will be made to a few core elements within the tool, inorder to properly faciliate the integrration of custom scripting. The manifest.json will recieve the following new pair pair values:

_**script**_
------------

An object consisting of the following key pair values:

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

Data retrieved from these manifest arguments will be passed to a method from the custom-script.ts that will handle the execution of said script file. The custom-script.ts will be defined in the following directory **'src/modules/custom-script.ts'** and will encompass all the methods neccessary for the module.

Specifications
==============

*   The function name used within the developer’s custom script file should match the name **custom.**
    
*   The module has to be defaultly exported from within the developer’s script file.
    
*   The module being imported should be written in **ECMA Script**.
    
*   The level of supported ECMA Script is **ES9** and lower.
    
*   External dependencies utilized within the developer’s script must be supported within rdvue’s current node version (**v 14**).
    

Execution
=========

Upon running the custom script module, verifcation checks will be conducted on the script to ensure that it meets the minimum requirement for execution. Should the script not meet any of these requirements an error message will be printed to the console clearly denoting the reasons for the execution’s failure. Otherwise the script will be ran and after its execution a success message will be outputed to the console. The script will also execute based on whether the user desires it to be ran once or ran infinetly, this data will be persisted in a .txt file inside the folder of the module running the custom script.

Output
======

The custom scripts module outputs one of two mesage types :

**error**

An error value that holds all of the information pertaining to issues that occured during script execution.

```
Error: Unable to locate exported function with the name 'custom' ❌
```

**success**

A success value that denotes to the user that their script has been sucessfully executed.

```
Your custom script has been successfully executed ✔️ 
```