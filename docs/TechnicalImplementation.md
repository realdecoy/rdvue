# Technical Implementation
--------------------

The purpose of this document is to give a comprehensive technical breakdown of the inner workings of plugin custom scripting witin rdvue. All functionalities will stem from the **custom-script.ts** file which will handle the verification and execution of scripts.

Methods
-------

*   **execute()**
    

This method is responsible for capturing the necessary data to sucessfully run the designated scripts. It will take two pararmeters - path: string , runOnce: boolean which are values derived from the manifest arguements

**Function definition**

```
function execute(path: string, runOnce: boolean){
     // custom script execution
}
```

**Funtion call**

```
CUSTOM_SCRIPT.execute(some_path, some_boolean)
```

*   **checkECMAcompatibility()**