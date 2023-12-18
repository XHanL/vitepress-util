**English** | [**中文**](./README.zh-CN.md)

# Vitepress Demo

### Demo Plugins & Components for Vitepress

### [Examples](https://xhanl.github.io/vitepress-demo-website/examples.html)

## Features

### Native Theme

The overall appearance of the demo component inherits from the native minimalist style

### Native Build

Convert paths and source code into temporary modules through Vite, achieving component isolation

### Native Rendering

Titles, descriptions, and code highlighting are all rendered through native Markdown

### Various Methods

Supports relative paths and source code blocks as demo content

## Installation

### Terminal

```sh
npm i @vitepress-util/demo -D
```

### Configure .vitepress/config.mts

```ts
import { defineConfig } from "vitepress";
import { demoMarkdownPlugin, demoVitePlugin } from "@vitepress-util/demo";

export default defineConfig({
  // other configs...
  markdown: {
    config(md) {
      md.use(demoMarkdownPlugin);
    },
  },
  vite: {
    plugins: [demoVitePlugin()],
  },
});
```

## Examples

### Relative path

```md
::: demo Size | The following sizes are `large`, `middle`, `small`, `24px`
demo/IconSize.vue
:::
```

### Code fence

````md
::: demo _Color_ | Specify a **_`color`_** for the **icon**

```vue
<template>
  <Space>
    <Icon color="turquoise">
      <!-- Put code focus here -->
      <ArrowCircleRight />
    </Icon>
    <Icon color="#d0d080">
      <!-- Put code focus here -->
      <ArrowCircleRight />
    </Icon>
  </Space>
</template>

<script setup lang="ts">
import Icon from "./components/Icon.vue"; // Put code focus here
import Space from "./components/Space.vue";
import ArrowCircleRight from "./icons/ArrowCircleRight.vue";
</script>
```

:::
````

## License

### MIT

#### Copyright (c) 2023 - present Crystal Platform
