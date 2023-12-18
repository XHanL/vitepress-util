//Node
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

//Vite
import type { Plugin } from "vite";
import { parse, compileScript } from "vue/compiler-sfc";

//RegExps
const DEMO_RE = /:::\s*demo\s*(.*?)\n(?:(.*?)\n)?:::/gis;
const FENCE_RE = /(`{3,})\s*(.*?)\n(?:(.*?)\n)?\1/gis;
const YAML_RE = /---\n(?:(.*?)\n)?---/gis;
const CODE_RE = /`.*?`/gi;
const HTML_RE = /<(.*?)\/(.*?)>/gis;
const LINK_RE = /\[(.*?)\]\((.*?)\)/gi;
const TOC_RE = /\[\[toc\]\]/gi;
const PLACEHOLDER_RE = /\uffff(.*?)\uffff/gis;
const COLOR_RE =
  /\[(#[0-9A-Fa-f]{3}|#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{8}|rgba\(.*?\)|rgb\(.*?\)|hsla\(.*?\)|hsl\(.*?\))(?:\:(dark|light))?\]/gis;

//String
const VIRTUAL_ID = "virtual:ColorPreview.vue";

//Plugin
export function colorVitePlugin(): Plugin {
  const root = dirname(fileURLToPath(import.meta.url));
  const reloadSet = new Set<string>();
  return {
    name: "vite-plugin-vitepress-color",
    enforce: "pre",

    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return id;
      }
    },

    load(id) {
      if (id === VIRTUAL_ID) {
        return readFileSync(resolve(root, "ColorPreview.vue"), "utf8");
      }
    },

    transform(code, id) {
      if (id.endsWith(".md")) {
        return parseMarkdown(code, id);
      }
    },

    handleHotUpdate({ file, server }) {
      if (reloadSet.has(file)) {
        const moduleGraph = server.moduleGraph;
        const moduleMap = moduleGraph.idToModuleMap;
        const module = moduleMap.get(file)!;
        server.reloadModule(module);
      }
    },
  };

  function parseMarkdown(code: string, id: string) {
    const modules: Record<string, string> = {};
    const demos: string[] = [];
    const fences: string[] = [];
    const yamls: string[] = [];
    const codes: string[] = [];
    const htmls: string[] = [];
    const links: string[] = [];
    const tocs: string[] = [];
    const markdown = code
      .replace(DEMO_RE, (matched: string) => {
        demos.push(matched);
        return "\uffffDEMO\uffff";
      })
      .replace(FENCE_RE, (matched: string) => {
        fences.push(matched);
        return "\uffffFENCE\uffff";
      })
      .replace(YAML_RE, (matched: string) => {
        yamls.push(matched);
        return "\uffffYAML\uffff";
      })
      .replace(CODE_RE, (matched: string) => {
        codes.push(matched);
        return "\uffffCODE\uffff";
      })
      .replace(HTML_RE, (matched: string) => {
        //解析script
        if (matched.slice(1).trim().slice(0, 6) === "script") {
          const { descriptor, errors } = parse(matched);
          if (errors.length > 0) {
            throw errors;
          }
          const { imports } = compileScript(descriptor, {
            id: "null",
          });
          if (imports) {
            Object.keys(imports)
              .filter((k) => !imports[k].isType && imports[k].isFromSetup)
              .forEach((k) => {
                modules[imports[k].imported === "default" ? k : `{ ${k} }`] =
                  imports[k].source;
              });
          }
          return "";
        } else {
          htmls.push(matched);
          return "\uffffHTML\uffff";
        }
      })
      .replace(LINK_RE, (matched: string) => {
        links.push(matched);
        return "\uffffLINK\uffff";
      })
      .replace(TOC_RE, (matched: string) => {
        tocs.push(matched);
        return "\uffffTOC\uffff";
      })
      .replace(COLOR_RE, (_matched: string, group1: string, group2: string) => {
        reloadSet.add(id);
        return `<ColorPreview color="${group1}" mode="${group2 ?? "system"}"/>`;
      })
      .replace(PLACEHOLDER_RE, (_matched: string, group1: string) => {
        switch (group1) {
          case "DEMO":
            return demos.shift()!;
          case "FENCE":
            return fences.shift()!;
          case "YAML":
            return yamls.shift()!;
          case "CODE":
            return codes.shift()!;
          case "LINK":
            return links.shift()!;
          case "HTML":
            return htmls.shift()!;
          case "TOC":
            return tocs.shift()!;
          default:
            throw new Error(
              "Plugin: \n\nError: Unknown placeholder\n\nDetails: Unknown placeholder."
            );
        }
      });
    const script =
      `\n<script setup lang="ts">\n` +
      Object.keys(modules)
        .map((k) => `import ${k} from "${modules[k]}";\n`)
        .join("") +
      `import ColorPreview from "${VIRTUAL_ID}";\n` +
      `</script>\n`;
    return markdown + script;
  }
}
