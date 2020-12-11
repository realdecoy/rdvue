# 1.0
-------------

### New Features

*   Added project template support (FP-279).
    
    *   Pre-built templates available along with a Custom option for ad-hoc compositions.
        
*   Added Plugin support (FP-246)
    
    *   New CLI command to add plugins to existing projects (FP-262): **rdvue add <plugin>**
        
    *   Added the **Vuetify** package as a plugin (FP-254)
        
    *   Added **Buefy** package as a plugin (FP-194)
        
    *   Added **Localization** support as a plugin (FP-252)
        
*   Added **Layout** support and a new command to generate them (**rdvue g layout <layout-name>)** (FP-272)
    
*   Added automatic **Favicon** and **PWA** icon generation from a single source image. Sizes and formats to support the major platforms are supported.
    
*   Added an external log file to log useful information for user of the CLI (FP-304)
    

### **General Updates**

*   Refactored the base template for how services are generated (FP-271)
    
*   Updated the webpack bundle analyzer options for static report generation (FP-307)
    
*   CLI output provides more context about dependencies being installed and failures (FP-297)
    
*   Updated the Store template (**rdvue generate store**) to export strongly-typed interfaces for consumption within the application; Getters and Actions have full intellisense once imported (FP-232).
    

### Experimental

*   Introducing **Storybook**. A tool which provides automated documentation and live previewing of Components generated within your project.
    
    *   Features a Playground for interactively testing your components - independent of the core web app.
        
    *   New StoryProp and StoryComponent decorator for components enable Storybook access. New components are generated with these by default - so all components are Storybook enabled.
        
*   **Authentication** plugin scaffolds pages and routes with scenarios to cover login, password recovery and registration. Pending are service level stubs to support backend integrations.
    

### **Known Issues**

*   Storybook’s stories.scss references imports which do not exist in base template. Workaround is to remove the bad imports from files within the **.storybook** directory.