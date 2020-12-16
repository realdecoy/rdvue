# Components
--------------

A Component is a conceptual grouping for Vue components which are imported by [Pages](Pages.md) and other Components.

Unlike Pages, Components are never used in Routing. That would deviate from the RDVue development style guide.

### Technical

* * *

A Component contains all the files present for [Pages](Pages.md) with the addition of:

*   \[component\]**.story.ts**: This contains the list of stories which describe the component’s usage. This is helpful for documentation purposes in providing live examples of key ways a Component can be used through the included Storybook preview tool.
    

* * *

Components use special decorators within their TypeScript file to add metadata useful for generating its documentation within Storybook:

*   **@StoryComponent**: decorates the Component’s class, providing the same functionality as @Component (used in pages) with the addition of:
    

|                       |     |
| --------------------- | --- |
| **description**  <br>type: string; default: undefined | Describe the component’s overall purpose. |
| **module**  <br>type: string; default: undefined | Text stating the module used in the import statement (eg. “@/components/foo”) |
| **playground** (optional)  <br>type: boolean, default: true | Toggles the Playground feature for this component within the Storybook preview. |
| **api** (optional)  <br>type: boolean, default: true | Display the Component’s list of props, slots and events on the API tab within the Storybook preview tool. |
| slots (optional)  <br>type: {\[key: string\]: string}, default: undefined | Describe the slots available within the component. Eg.<br><br>```<br>slots: { <br>  header: ‘The header component goes here’,<br>  ... <br>}<br>``` |

*   **@StoryProp**: decorates the Component’s Props, providing the same functionality as @Prop with the addition of:
    

|     |     |
| --- | --- |
| **description**  <br>type: string; default: undefined | Describe the prop's overall purpose. |
| **values** (optional)  <br>\[array; default: undefined | An optional list of values which are considered acceptable for the prop. This is great for constraining Props that are bound to an enum type. |

*   **@StoryEvent**: decorates the Component’s Events, providing the same functionality as @Event with the addition of:
    

|     |     |
| --- | --- |
| **description**  <br>type: string; default: undefined | Describe the event’s overall purpose. |