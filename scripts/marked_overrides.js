// Overrides the link element in Marked's renderer. This is a more elegant and potentially portable alternative adding the preview tags as hexo elements.
const marked = require("marked");
const { encodeURL } = require("hexo-util");
const fetch = require("node-fetch");
const { getMetadata } = require("page-metadata-parser");
const domino = require("domino");

async function getUrlMetadata(url) {
  console.log("Fetching metadata for: " + url);
  const response = await fetch(url);
  const html = await response.text();
  console.log("Finished fetching metadata for: " + url);
  const doc = domino.createWindow(html).document;
  const metadata = getMetadata(doc, url);
  return metadata;
}

// Parse out html entities
// DO NOT REMOVE APOSTROPHES.
// Note: for some reason including &mdash; seems to crash MathJax.
// it can be replaced by &#8212; however.
function cleanHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/`/g, "&#96;")
    .replace(/“/g, "&quot;")
    .replace(/”/g, "&quot;");
}

// Feature only available in hexo-renderer-marked 4+
// Since marked doesn't support async rendering (needed for fetching url metadata)
// we simply offload this into a tag to do the async processing later.
hexo.extend.filter.register(
  "marked:renderer",
  function (renderer) {
    const { config } = this; // Skip this line if you don't need user config from _config.yml
    defaultLinkRenderer = renderer.link;
    renderer.link = function (href, title, text) {
      console.log("href" + href);
      console.log("title" + title);
      console.log("text" + text);
      // Note: there's some bug with plain links where if the text is a valid URL
      // a preview is added again. Sort of a recursive link preview problem.
      // You can get around this by adding a text that is the url minus https://
      return `{% preview ${encodeURL(href)} %} ${text} {% endpreview %}`;
    };
  },
  2,
);
