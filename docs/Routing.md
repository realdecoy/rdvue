# Routing
-----------

In order to determine the Pages that get loaded for a particular path within the browser, Routes are setup to create the respective mappings.

Below is an example of a Route definition for a sample Login page:

```
{
  path: '/login',
  name: 'login',
  meta: { layout: 'default' },
  component: () => import(/* webpackChunkName: "login" */ '@/pages/login'),
},
```

The **path** property specifies where the page will be accessible under the domain, for example: http://localhost:8080**/login**.

The **name** field provides an alternative means of identifying and navigation to defined pages programatically. This approach is preferable because the route names can be externalized into global constants and shared throughout your code for navigational consistency.

The **meta** property allows specifying arbitrary data that will get passed along to the loaded Page. The CLI recognizes a sub-property called layout which it will use to attach a [Layout](Layouts.md) to a page.

The **component** property specifies the Page to load for the given path. Here we used the recommended approach of dynamically loading the Page component using the **import()** function.

?> The import function is not the same as the import statements found at the top of a module file. The former is an asynchronous function that will load a module on-demand at runtime, while the latter only does static, compile-time, imports that always get bundled into the core application’s JavaScript payload.

The comment within the import statement is a directive for the Webpack pre-processor that compiles to project to create a new file which only contains the code needed to construct and execute the respective Page.

!>The comment inside the brackets of the import function are important and should be made unique to support proper code separation - or Chunking as it’s technically referred to. Do not delete them and ensure the value for `webpackChunkName` is unique for each route.