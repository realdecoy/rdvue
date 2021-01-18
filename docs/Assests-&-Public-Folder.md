# Assets & Public Folder
--------------------------------

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