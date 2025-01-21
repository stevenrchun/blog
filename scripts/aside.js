const { createHash } = require("crypto");
const { format } = require("util");

hexo.extend.tag.register(
  "sidenote",
  function (args, content) {
    var id = createHash("sha256").update(content).digest("hex");
    return (
      format(
        '<label for="%s" class="sidenote-number margin-toggle"></label>',
        id,
      ) +
      format('<input type="checkbox" class="margin-toggle" id="%s">', id) +
      '<span class="sidenote">' +
      hexo.render
        .renderSync({ text: content, engine: "md" })
        .replace(/<\/?p>/g, "") +
      "</span>"
    );
  },
  { ends: true, async: true },
);

// repeated because adding several conditionals turns 2 4-line
// functions into a single hard-to-follow 10-line function
hexo.extend.tag.register(
  "marginnote",
  function (args, content) {
    var id = createHash("sha256").update(content).digest("hex");
    return (
      format('<label for="%s" class="margin-toggle">&#8853;</label>', id) +
      format('<input type="checkbox" class="margin-toggle" id="%s">', id) +
      '<span class="marginnote">' +
      hexo.render
        .renderSync({ text: content, engine: "md" })
        .replace(/<\/?p>/g, "") +
      "</span>"
    );
  },
  { ends: true },
);

hexo.extend.tag.register(
  "large_fig",
  function (args, content) {
    return (
      `<div class="large-figure">` +
      hexo.render.renderSync({ text: content, engine: "md" }) +
      `</div>`
    );
  },
  { ends: true },
);

hexo.extend.tag.register(
  "extra_large_fig",
  function (args, content) {
    return (
      `<div class="extra-large-figure">` +
      hexo.render.renderSync({ text: content, engine: "md" }) +
      `</div>`
    );
  },
  { ends: true },
);
