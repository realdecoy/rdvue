# Rdvue Features
--------------

This section will provide a brief introduction to generating features inside a project. We provide two examples, namely generating a Page and a Component. Each available feature has a dedicated section in our documentation.

Reading through this section will get you comfortable with the CLI.

An indepth look at the command used in this section, along with all available commands, can be found in the [CLI Commands section](clicommands.md).

RDvue provides an elegant way for generating features.

### Generating a Page

```
rdvue generate page <page_name>
rdvue g page <page_name>
```

Each generated Page gets its own dedicated folder. The folder will be given the name of the page. This folder is located at /src/pages/<page\_name> .

### Generating a Component

```
rdvue generate component <component_name>
rdvue g component <component _name>
```

### Available Features

Below is a breakdown of the features currently available in Rdvue.

|     |     |
| --- | --- |
| Feature | Description |
| Page | Generates a basic page |
| Component | Generates a basic component |
| sm  | Generates basic store module |