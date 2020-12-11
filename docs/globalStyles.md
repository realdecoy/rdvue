# Global Styles
-----------------

Custom styles can be added into the project to provide global-level styling. This is useful for providing defaults which will be used by all instances of an element - such as overriding a UI framework’s defaults.

?>Global styles can be added to the **src/theme** directory.

### Do’s and Don’t

*   **Do** use global styles to apply application level defaults to HTML elements
    
*   **Do not** use global styles to customize the imperative look/feel of specific Components. (Use [Component-level](https://realdecoy.atlassian.net/wiki/spaces/PFDP/pages/1300922402/Components) styles and [Tailwind](tailwind.md) for that).
    

*   **Do** use global styles to override imported UI components' look and feel (Eg. to customize Buefy).
    
*   **Do** import global styles within the **main.ts** app bootstrap file. This will allow unused selectors to be tree-shaken.
    
*   **Do** import global styles from a CDN within the public/index.html file.