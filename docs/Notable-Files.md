# Project Scaffolding

An RDvue generated project adheres to the following folder structure. Our folder structure is geared towards keeping your code organized and maintainable.

```
├── public/
  ├── index.html
  
├── src/
  ├── components
  ├── config
  ├── layouts
  ├── main.ts
  ├── pages
  ├── services
  ├── store
  ├── theme
  
```

## Assets & Public Folder

Assets are static resources which can be imported within the application. These are images, fonts, or any arbitrary piece of data your app depends on.

The with the application, there are two directories which serve a similar - but distinct - purpose:

*   **Assets** (/src/assets)  
    Static resources will be compiled by Webpack and optimized where possible. Known asset types - Images, Fonts and CSS - will automatically be optimized to balance size/quality.
    

?>The **file-loade**r Webpack plugin and configuration may need to be added to the **vue.config.js** file in order to compile other file formats.

*   **Public** (/public)  
    Static resources will not be compiled and are copied as-is into the dist/public directory. Public resources require that you edit the **/public/index.html** file to import assets like CSS or JS or use XHR at runtime to fetch the data from <your domain>/<asset>.
    

?>Note that public paths do note include a **/public** directory in the Production build output. The data within the /public directory is copied to the root of the compiled application (/dist) once compiled.

Public assets should be used only for scenarios where truly public data exists and would not do well to filter through the compiler. This is typically data updated separately from the core application - like gallery photos or external configuration files.

!>Because **/public** data does not get compiled, it benefits from no potential optimizations. The **/src/assets** directory must be used as the priority default.

## Modules & Entities

**Modules** represent your declarative business logic and utilities used throughout your application. These modules do not cater to specific components or pages and should instead represent concepts relevant to the application on a macro level.

?>Modules are located in the **src/modules** directory. Sub-modules should be created as nested directories, each one being considered a Module. All the files within a sub-module directory belong to that sub-module.

?>Tip: create an index.ts file within individual sub-module directories to export all the files as a single JavaScript module (separate concept). Eg. **my-submodule** folder with an **index.ts** containing:

export \* from ‘./foo’  
export \* from ‘./bar’

Here ‘foo’ and ‘bar’ refer to the files foo.ts and bar.ts within the **my-submodule** directory. To import the sub-module:

import { fooData, barData } from ‘@/modules/**my-submodule**’

**Entities** are subset of modules which represent your domain models. These could be database concepts, API abstractions and Data Transfer Objects (DTOs). We keep these modules separate to indicate a tight-coupling with the backend service methods.

?>Entities are located in the **src/entities** directory.

## Other pages
!> The following section is being reformatted.

- Public: Holds static files such as your index.html
- Assets: Holds your static files such the images used throughout your application
- Config: Holds the necessary configuration files for your application
  - env.dev.ts: Stores ENV variables used in development.
  - env.prod.ts: Stores ENV variables used in production environment.
  - env.ts: Stores general ENV variables used both in development and production. The env.ts also loads the appropriate environment variables depending on the application mode (development or production).
  - register-service-worker.ts: Defines the service worker.
  - router.ts: Stores your application’s route definitions.
  - shims-tsx.d.ts
  - shims-vue.d.ts
- Components: Holds the folders for each component generated within your application
- Entities: This folder holds the definition of domain-specific _types & interfaces_ used across your project
- Modules: citation needed
- Pages: Stores sub-folders containing the pages generated with your application.
- Layouts: Stores your layouts (e.g Nav Bar) which are in multiple places across your application. An RDvue generated app comes with a simple default layout (default.ts) file.
- Theme: Stores CSS/SCSS files for theming your application.
- Services - Stores application logic for API requests or fetching data.
- Store: Store sub-folder for the individual [Vuex](https://vuex.vuejs.org/) store modules generated within your application.
