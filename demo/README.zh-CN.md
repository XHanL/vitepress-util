**中文** | [**English**](./README.md)

# Vitepress Demo

### 适用于 Vitepress 组件演示插件

### [前往演示](https://xhanl.github.io/vitepress-demo-website/zh/examples.html#%E7%A4%BA%E4%BE%8B)

## 特性

### 原生主题

演示组件整体外观继承自原生极简主义风格

### 原生构建

通过 Vite 将路径和源码转换为临时模块，实现组件隔离

### 原生渲染

标题，描述，代码高亮均经过原生 Markdown 渲染

### 多种方式

支持相对路径和源码块作为演示内容

## 安装

### 终端 npm

```sh
npm i @vitepress-util/demo -D
```

### 配置 .vitepress/config.mts

```ts
import { defineConfig } from "vitepress";
import { demoMarkdownPlugin, demoVitePlugin } from "@vitepress-util/demo";

export default defineConfig({
  // 其它配置...
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

## 用法

### 相对路径

```md
::: demo 尺寸 | 下列尺寸分别为 `large`, `middle`, `small`, `24px`
demo/IconSize.vue
:::
```

### 代码围栏

````md
::: demo _颜色_ | 为 **图标** 指定一种 **_`颜色`_**

```vue
<template>
  <Space>
    <Icon color="turquoise">
      <!-- 替换为聚焦注释 -->
      <ArrowCircleRight />
    </Icon>
    <Icon color="#d0d080">
      <!-- 替换为聚焦注释 -->
      <ArrowCircleRight />
    </Icon>
  </Space>
</template>

<script setup lang="ts">
import Icon from "../components/Icon.vue"; // 替换为聚焦注释
import Space from "../components/Space.vue";
import ArrowCircleRight from "../icons/ArrowCircleRight.vue";
</script>
```

:::
````

## 许可

#### MIT

#### Copyright (c) 2023 - present Crystal Platform
