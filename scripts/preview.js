const { getMetadata } = require("page-metadata-parser");
const { createWindow } = require("domino");
const fetch = require("node-fetch");
const { parseInline } = require("marked");
const { encodeURL, isExternalLink } = require("hexo-util");
const fs = require("fs");

const INTERNET_ARCHIVE_PREFIX = "https://web.archive.org/web/";
// Relative to project root.
const PREVIEW_CACHE_PATH = "preview_links_cache.json";
const PREVIEW_CACHE = "preview_cache";

// Load up cache before generation
let previewCache = {};
// Synchronous read.
// Ugh, I do not like using exceptions in control flow.
console.log("Loading preview cache file.");
try {
  const data = fs.readFileSync(PREVIEW_CACHE_PATH, "utf8");
  previewCache = JSON.parse(data);
} catch (err) {
  if (err.code === "ENOENT") {
    // File doesn't exist, create it.
    console.log("Preview cache file not found, starting fresh.");
  } else {
    // Else something funky, rethrow.
    throw err;
  }
}

// Initialize local state with link preview file.
// Unfortunately, this runs every time we run a hexo command.
// Until there is a hook for before all file processing starts no real way to avoid.
hexo.locals.set(PREVIEW_CACHE, previewCache);

// Cached function which prefers to fetch the metadata
// from the preview json cache.
async function getUrlMetadata(url, cache) {
  console.log("Fetching metadata for: " + url);
  if (url in cache) {
    // Note: null is a valid value for the url cache, since some
    // websites don't have metadata.
    console.log(`Cache hit for ${url}.`);
    return cache[url];
  }
  const response = await fetch(url).catch((e) => {
    console.log(`Caught error attempting to fetch ${url}`);
    console.log(e);
    return null;
  });

  function getMetadataFromHtml(html) {
    const doc = createWindow(html).document;
    const metadata = getMetadata(doc, url);
    return metadata;
  }

  if (response != null && response.ok) {
    const html = await response.text();
    console.log("Finished fetching metadata for: " + url);
    return getMetadataFromHtml(html);
  }

  return null;
}
// Parse out html entities
// DO NOT REMOVE APOSTROPHES.
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

// Hook for after rendering to write finished preview cache to file.
hexo.extend.filter.register("after_generate", function () {
  console.log("Writing preview cache.");
  let previewCache = hexo.locals.get(PREVIEW_CACHE);
  fs.writeFileSync(PREVIEW_CACHE_PATH, JSON.stringify(previewCache), "utf8");
});

// Insert a annotated link for popups.
// NOTE: MathJax "not being able to find a handler for document" means that the
// text isn't parsing as valid html, likely a un-closed tag.
// It seems that tags are rendered in-order for each post but concurrently across
// posts: https://github.com/hexojs/hexo/pull/4926
hexo.extend.tag.register(
  "preview",
  function (args, content) {
    const url = args[0];
    // let got = hexo.locals.get("test");
    if (
      url.startsWith("javascript:") ||
      url.startsWith("vbscript:") ||
      url.startsWith("data:")
    ) {
      url = "";
    }
    if (!hexo.config.fetch) {
      // Return a default preview.
      return (
        `<a href="${url}" class="docMetadata" data-popup-title="Sample Preview" data-popup-image="https://pbs.twimg.com/media/Es3GPfxXMAkaMcK?format=jpg&name=medium" data-popup-abstract="This is a test preview, created to prevent firing tons of metadata requests during development">` +
        parseInline(content) +
        "</a>"
      );
    }

    // Load cache
    let previewCache = hexo.locals.get(PREVIEW_CACHE);

    return getUrlMetadata(url, previewCache)
      .then((metadata) => {
        // First retry with the internet archive.
        if (metadata == null) {
          // Cache the null result for the initial link.
          if (!(url in previewCache)) {
            previewCache[url] = metadata;
            hexo.locals.set(PREVIEW_CACHE, previewCache);
          }
          let archivedUrl = INTERNET_ARCHIVE_PREFIX + url;
          return [archivedUrl, getUrlMetadata(archivedUrl, previewCache)];
        } else {
          // Else, just pass on the successful metadata.
          return [url, metadata];
        }
      })
      .then(([url, metadata]) => {
        if (metadata == null) {
          if (!(url in previewCache)) {
            previewCache[url] = metadata;
            hexo.locals.set(PREVIEW_CACHE, previewCache);
          }

          return `[${content}](${url})`;
        }

        if (metadata.description == null) {
          abstract = "";
        } else {
          abstract = cleanHTML(metadata.description);
        }

        if (metadata.title == null) {
          let parsedUrl = new URL(url);
          title = parsedUrl.hostname + parsedUrl.pathname;
        } else {
          title = cleanHTML(metadata.title);
        }

        if (metadata.image == null) {
          image = metadata.image = "";
        } else {
          image = metadata.image;
        }

        // If the url isn't in the cache, store it.
        if (!(url in previewCache)) {
          previewCache[url] = {
            title: title,
            abstract: abstract,
            image: image,
          };
          hexo.locals.set(PREVIEW_CACHE, previewCache);
        }

        let target = "_self";
        let rel = "nooponer";
        if (isExternalLink(url, hexo.config.url)) {
          target = "_blank";
          rel += " " + "external";
        }

        return (
          `<a href="${encodeURL(
            url,
          )}" class="docMetadata" data-popup-title="${title}" data-popup-image="${
            metadata.image
          }" data-popup-abstract="${abstract}" target="${target}" rel="${rel}">` +
          hexo.render
            .renderSync({ text: content, engine: "md" })
            .replace(/<\/?p>/g, "") +
          "</a>"
        );
      });
  },
  { ends: true, async: true },
);
