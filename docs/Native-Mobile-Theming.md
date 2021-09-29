# Theming

## Tailwindcss

The RDVue Mobile template includes support with Tailwindcss. Some features may not be available or have changed in the Native Mobile environment.

### Unsupported Features
NativeScript/tailwind does not support the following:

* units: max-content, min-content, vh, vw
* pseudo-selectors: :focus-within, :hover
* @media
* properties: tw-ring, tw-shadow, tw-ordinal, tw-slashed-zero, tw-numeric

### Converted Features
NativeScript/tailwind supports the following but converts them to another value.

* units: rem, em → px (value * 16)

### Supported Features
NativeScript/tailwind has identified the following as being supported. Anything not in this list is implicitly unsupported.

* pseudo selector: ::placeholder (converted to placeholder-color prop (only if color prop is available))
* properties: 
  * 'align-content': true,
  * 'align-items': true,
  * 'align-self': true,
  * 'android-selected-tab-highlight-color': true,
  * 'android-elevation': true,
  * 'android-dynamic-elevation-offset': true,
  * 'animation': true,
  * 'animation-delay': true,
  * 'animation-direction': true,
  * 'animation-duration': true,
  * 'animation-fill-mode': true,
  * 'animation-iteration-count': true,
  * 'animation-name': true,
  * 'animation-timing-function': true,
  * 'background': true,
  * 'background-color': true,
  * 'background-image': true,
  * 'background-position': true,
  * 'background-repeat': ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'],
  * 'background-size': true,
  * 'border-bottom-color': true,
  * 'border-bottom-left-radius': true,
  * 'border-bottom-right-radius': true,
  * 'border-bottom-width': true,
  * 'border-color': true,
  * 'border-left-color': true,
  * 'border-left-width': true,
  * 'border-radius': true,
  * 'border-right-color': true,
  * 'border-right-width': true,
  * 'border-top-color': true,
  * 'border-top-left-radius': true,
  * 'border-top-right-radius': true,
  * 'border-top-width': true,
  * 'border-width': true,
  * 'box-shadow': true,
  * 'clip-path': true,
  * 'color': true,
  * 'flex': true,
  * 'flex-grow': true,
  * 'flex-direction': true,
  * 'flex-shrink': true,
  * 'flex-wrap': true,
  * 'font': true,
  * 'font-family': true,
  * 'font-size': true,
  * 'font-style': ['italic', 'normal'],
  * 'font-weight': true,
  * 'height': true,
  * 'highlight-color': true,
  * 'horizontal-align': ['left', 'center', 'right', 'stretch'],
  * 'justify-content': true,
  * 'justify-items': true,
  * 'justify-self': true,
  * 'letter-spacing': true,
  * 'line-height': true,
  * 'margin': true,
  * 'margin-bottom': true,
  * 'margin-left': true,
  * 'margin-right': true,
  * 'margin-top': true,
  * 'min-height': true,
  * 'min-width': true,
  * 'off-background-color': true,
  * 'opacity': true,
  * 'order': true,
  * 'padding': true,
  * 'padding-bottom': true,
  * 'padding-left': true,
  * 'padding-right': true,
  * 'padding-top': true,
  * 'place-content': true,
  * 'placeholder-color': true,
  * 'place-items': true,
  * 'place-self': true,
  * 'selected-tab-text-color': true,
  * 'tab-background-color': true,
  * 'tab-text-color': true,
  * 'tab-text-font-size': true,
  * 'text-transform': true,
  * 'text-align': ['left', 'center', 'right'],
  * 'text-decoration': ['none', 'line-through', 'underline'],
  * 'text-shadow': true,
  * 'text-transform': ['none', 'capitalize', 'uppercase', 'lowercase'],
  * 'transform': true,
  * 'vertical-align': ['top', 'center', 'bottom', 'stretch'],
  * 'visibility': ['visible', 'collapse'],
  * 'width': true,
  * 'z-index': true,

### Further Reading
* [GitHub: NativeScript/Tailwind removeUnsupported.js](https://github.com/NativeScript/tailwind/blob/master/src/removeUnsupported.js)