# Theming

## Global Styles

Custom styles can be added into the project to provide global-level styling. This is useful for providing defaults which will be used by all instances of an element - such as overriding a UI framework’s defaults.

?>Global styles can be added to the **src/theme** directory.

### Do’s and Don’t

*   **Do** use global styles to apply application level defaults to HTML elements
*   **Do not** use global styles to customize the imperative look/feel of specific Components. (Use [Component-level](Features.md#components) styles and [Tailwind](#tailwind) for that).
*   **Do** use global styles to override imported UI components' look and feel (Eg. to customize Buefy).
*   **Do** import global styles within the **main.ts** app bootstrap file. This will allow unused selectors to be tree-shaken.
*   **Do** import global styles from a CDN within the public/index.html file.

## Tailwind

[Tailwind](https://tailwindcss.com/) is a utility-first CSS framework which provides standardized classes for layout, colors and responsiveness. It is unique through its approach of providing low-level utility classes which can be rapidly combined to produce complex functionality. It does not provide custom UI elements like Buttons or Dropdowns, but rather focuses on building blocks which are agnostic of a specific visual design.

?>Tailwind is the best practice approach for styling Components and Pages within RDVue.

### Technical

*   The **tailwind.config.js** file allows custom utilities to be created or existing ones overridden. Eg. new standardized margin or padding values.
*   Tailwind utilities can be combined within your custom CSS selectors using the [@apply](https://tailwindcss.com/docs/functions-and-directives#apply) directive.
*   New utility classes can [implemented](https://tailwindcss.com/docs/adding-new-utilities) using CSS. They can be used with psuedo class and responsive variants - like native Tailwind utilities.
    
?>The color section in tailwind.config.js should be overridden for new projects and the colors matching your style guide listed instead.