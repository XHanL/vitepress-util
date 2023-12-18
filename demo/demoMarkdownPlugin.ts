import type MarkdownIt from "markdown-it";
import container from "markdown-it-container";

export const demoMarkdownPlugin = (md: MarkdownIt) => {
  md.use(container, "demo", {
    render: (
      tokens: MarkdownIt.Token[],
      idx: number,
      options: MarkdownIt.Options
    ) => {
      if (tokens[idx].nesting == 1) {
        const props = tokens[idx].info
          .trim()
          .slice(4)
          .trim()
          .split("|")
          .map((s) => s.trim());
        const title = md.render(props[0]) || "";
        const desc = md.render(props[1]) || "";
        const lang = props[2] || "";
        const code = decodeURIComponent(props[3]) || "";
        const highlight = md
          .render("```" + lang + "\n" + code + "\n```")
          .replace(/<button[\s\S]*?>[\s\S]*?<\/button>/gi, ""); // 去掉复制按钮
        return md.render(
          `<p><DemoPreview` +
            ` title="${encodeURIComponent(title)}"` +
            ` desc="${encodeURIComponent(desc)}"` +
            ` lang="${encodeURIComponent(lang)}"` +
            ` code="${encodeURIComponent(code)}"` +
            ` highlight="${encodeURIComponent(highlight)}"` +
            `>`
        );
      }
      return md.render(`</DemoPreview></p>`);
    },
  });
};

/* [调试打印]
return md.render(
  ":::warning DEBUG\n```\n" +
    JSON.stringify(demo, undefined, 2) +
    "\n```\n:::\n<div><!--"
);
*/
