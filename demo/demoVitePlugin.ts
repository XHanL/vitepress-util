//Node
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

//Vite
import type { Plugin } from "vite";
import { parse, compileScript } from "vue/compiler-sfc";

//Unique ID
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  8
);

//Regexps
const PREVIEW_ID_RE = /\.md\.Preview[A-Za-z0-9]{8}\.vue$/;
const DEMO_RE = /(\:{3})\s*demo\s*(.*?)\n(?:(.*?)\n)?\1/gis;
const FENCE_RE = /(`{3,})\s*(.*?)\n(?:(.*?)\n)?\1/gis;
const SCRIPT_RE = /<script\s*(.*?)>(.*?)<\/script>/gis;
const REPLACE_RE = RegExp(
  `${DEMO_RE.source}|${FENCE_RE.source}|${SCRIPT_RE.source}`,
  "gis"
);

//String
const VIRTUAL_ID = "virtual:DemoPreview.vue";

//Types
interface Demo {
  title?: string;
  desc?: string;
  path?: string;
  name?: string;
  lang?: string;
  code?: string;
  preview?: string;
}

//Plugin
export function demoVitePlugin(): Plugin {
  const root = dirname(fileURLToPath(import.meta.url));
  const reloadMap: Record<string, Set<string>> = {};
  const virtualModuleMap: Record<string, string> = {};
  return {
    name: "vite-plugin-vitepress-demo",
    enforce: "pre",

    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return id;
      } else if (PREVIEW_ID_RE.test(id)) {
        return id;
      }
    },

    load(id) {
      if (id === VIRTUAL_ID) {
        return readFileSync(resolve(root, "DemoPreview.vue"), "utf8");
      } else if (PREVIEW_ID_RE.test(id)) {
        return virtualModuleMap[id];
      }
    },

    transform(code, id) {
      if (id.endsWith(".md")) {
        //复用模块名，防止热更创建多余模块
        const reuseNames = Object.keys(virtualModuleMap)
          .filter((k) => k.startsWith(id))
          .map((k) => k.split(".").slice(0, -1).pop()!);
        //解析Markdown
        const { markdown, modules, virtualModules } = parseMarkdown(
          code,
          id,
          reuseNames
        );
        //添加热更依赖
        Object.keys(modules).forEach((k) => {
          if (k in reloadMap) {
            reloadMap[k].add(id);
          } else {
            reloadMap[modules[k]] = new Set([id]);
          }
        });
        //添加虚拟模块
        Object.keys(virtualModules).forEach((k) => {
          virtualModuleMap[`${id}.${k}.vue`] = virtualModules[k];
        });
        return markdown;
      }
    },

    handleHotUpdate({ file, server }) {
      if (file in reloadMap) {
        reloadMap[file].forEach((md) => {
          const moduleGraph = server.moduleGraph;
          const moduleMap = moduleGraph.idToModuleMap;
          const module = moduleMap.get(md)!;
          server.reloadModule(module);
        });
      }
      //console.log(server.moduleGraph.idToModuleMap.size); //调试模块泄漏
    },
  };

  function parseMarkdown(code: string, id: string, reuseNames?: string[]) {
    const modules: Record<string, string> = {};
    const virtualModules: Record<string, string> = {};
    const markdown =
      code.replace(
        REPLACE_RE,
        (fullMatch: string, _, p2: string, p3: string) => {
          //解析demo
          if (fullMatch.startsWith(":")) {
            const demo: Demo = {};
            //解析demo信息
            const infos = p2
              .trim()
              .split("|")
              .map((i) => i.trim());
            demo.title = infos.shift();
            demo.desc = infos.shift();
            //解析Demo内容
            const content = p3.trim();
            if (FENCE_RE.test(content)) {
              //解析代码
              demo.preview = content.replace(
                FENCE_RE,
                (
                  _fenceMatch: string,
                  _fenceSymbol: string,
                  fenceInfo: string,
                  fenceContent: string
                ) => {
                  demo.lang = fenceInfo.trim().split(/\s+/)[0].trim();
                  demo.code = fenceContent;
                  demo.name = reuseNames?.pop() ?? `Preview${nanoid()}`;
                  virtualModules[demo.name] = demo.code;
                  return `\n<${demo.name}/>\n`;
                }
              );
            } else {
              //解析路径
              try {
                demo.code = readFileSync(resolve(content), "utf-8");
              } catch (error) {
                throw new Error(
                  `Plugin: \n\nError: Unable to read file\n\nDetails: Unable to read content from "${id}".`
                );
              }
              const path: string[] = content.split("/").pop()!.split(".");
              demo.lang = path.pop()!;
              demo.name = path.pop()!;
              modules[demo.name] = resolve(content);
              demo.preview = `\n<${demo.name}/>\n`;
            }
            return (
              `::: demo ${demo.title || ""}` +
              `|${demo.desc || ""}` +
              `|${demo.lang || ""}` +
              `|${encodeURIComponent(demo.code || "")}\n` +
              `${demo.preview}\n` +
              `:::\n`
            );
          }
          //解析script
          if (fullMatch.startsWith("<")) {
            const { descriptor, errors } = parse(fullMatch);
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
          }
          //保留原始内容
          return fullMatch;
        }
      ) +
      (Object.keys(modules).length > 0
        ? `\n<script setup lang="ts">\n` +
          Object.keys(modules)
            .map((k) => `import ${k} from "${modules[k]}";\n`)
            .join("") +
          Object.keys(virtualModules)
            .map((k) => `import ${k} from "${id}.${k}.vue";\n`)
            .join("") +
          `import DemoPreview from "${VIRTUAL_ID}";\n` +
          `</script>\n`
        : "");
    return {
      markdown: markdown,
      modules: modules,
      virtualModules: virtualModules,
    };
  }
}
