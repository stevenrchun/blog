const crypto = require('crypto');
const util = require('util');
const { encodeURL, isExternalLink } = require('hexo-util');
const fetch = require('node-fetch');
const { getMetadata } = require('page-metadata-parser');
const domino = require('domino');
const marked = require('marked');

hexo.extend.tag.register(
  'sidenote',
  function(args, content) {
    var id = crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
    return (
      util.format(
        '<label for="%s" class="sidenote-number margin-toggle"></label>',
        id,
      ) +
      util.format('<input type="checkbox" class="margin-toggle" id="%s">', id) +
      '<span class="sidenote">' +
      hexo.render
        .renderSync({ text: content, engine: 'md' })
        .replace(/<\/?p>/g, '') +
      '</span>'
    );
  },
  { ends: true, async: true },
);

// repeated because adding several conditionals turns 2 4-line
// functions into a single hard-to-follow 10-line function
hexo.extend.tag.register(
  'marginnote',
  function(args, content) {
    var id = crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
    return (
      util.format('<label for="%s" class="margin-toggle">&#8853;</label>', id) +
      util.format('<input type="checkbox" class="margin-toggle" id="%s">', id) +
      '<span class="marginnote">' +
      hexo.render
        .renderSync({ text: content, engine: 'md' })
        .replace(/<\/?p>/g, '') +
      '</span>'
    );
  },
  { ends: true },
);

async function getUrlMetadata(url) {
  console.log('Fetching metadata for: ' + url);
  const response = await fetch(url);
  const html = await response.text();
  console.log('Finished fetching metadata for: ' + url);
  const doc = domino.createWindow(html).document;
  const metadata = getMetadata(doc, url);
  return metadata;
}
// Parse out html entities
// DO NOT REMOVE APOSTROPHES.
function cleanHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/`/g, '&#96;')
    .replace(/“/g, '&quot;')
    .replace(/”/g, '&quot;');
}

hexo.extend.tag.register(
  'large_fig',
  function(args, content) {
    return (
      `<div class="large-figure">` +
      hexo.render.renderSync({ text: content, engine: 'md' }) +
      `</div>`
    );
  },
  { ends: true },
);

// Insert a annotated link for popups.
// NOTE: MathJax "not being able to find a handler for document" means that the
// text isn't parsing as valid html, likely a un-closed tag.
hexo.extend.tag.register(
  'preview',
  function(args, content) {
    const url = args[0];
    if (
      url.startsWith('javascript:') ||
      url.startsWith('vbscript:') ||
      url.startsWith('data:')
    ) {
      url = '';
    }
    if (!hexo.config.fetch) {
      // Return a default preview.
      return (
        `<a href="${url}" class="docMetadata" data-popup-title="Sample Preview" data-popup-image="https://pbs.twimg.com/media/Es3GPfxXMAkaMcK?format=jpg&name=medium" data-popup-abstract="This is a test preview, created to prevent firing tons of metadata requests during development">` +
        marked.parseInline(content) +
        '</a>'
      );
    }

    let target = '_self';
    let rel = 'nooponer';
    if (isExternalLink(url, hexo.config.url)) {
      target = '_blank';
      rel += ' ' + 'external';
    }

    return getUrlMetadata(url).then((metadata) => {
      if (metadata == null) {
        return `[${content}](${url})`;
      }
      if (metadata.description == null) {
        abstract = '';
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
        metadata.image = '';
      }
      return (
        `<a href="${encodeURL(
          url,
        )}" class="docMetadata" data-popup-title="${title}" data-popup-image="${
          metadata.image
        }" data-popup-abstract="${abstract}" target="${target}" rel="${rel}">` +
        hexo.render
          .renderSync({ text: content, engine: 'md' })
          .replace(/<\/?p>/g, '') +
        '</a>'
      );
    });
  },
  { ends: true, async: true },
);
