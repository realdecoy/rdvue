# Required scripts

The following scripts should be added to your project's package.json:

  * "build-storybook": "run-s storybook:build storybook:copyres"
  * "storybook": "run-s storybook:tailwind storybook:serve"
  * "storybook:build": "build-storybook -c .storybook -o dist/storybook"
  * "storybook:serve": "start-storybook -s ./public -p 8000 --ci"
  * "storybook:copyres": "ncp ./public/images dist/storybook/images"
  * "storybook:tailwind": "npx tailwindcss build src/theme/tailwind.css -o .storybook/tailwind.css"
