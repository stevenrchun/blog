let kCustomFootnoteSplit = "________________";
let kMarkdownFootnoteSplit = "## Notes";
let kHorizontalLine = "\n --- \n";

hexo.extend.filter.register("before_post_render", function (data) {
  processed_content = preprocess(data.content);
  if (processed_content != null) {
    data.content = processed_content;
    return data;
  }
});

function preprocess(content) {
  // If old style footnotes
  if (content.includes(kCustomFootnoteSplit)) {
    return insertSidenotesCustom(content);
  } else {
    // Parse markdown footnotes
    content = insertSidenotesForMarkdown(content);
    return content;
  }
}

function insertSidenotesCustom(content) {
  let split = content.split(kCustomFootnoteSplit);
  let textContent = split[split.length - 2];
  let sidenoteContent = split[split.length - 1];
  // Regex matching any numeric between two brackets [*]
  let sidenotes = sidenoteContent.split(/(\[[0-9].?[0-9]*\])/g);
  let sidenoteMap = new Map();
  // Skip the first element, it's just the linebreak from the Footnote
  // separator.
  for (i = 1; i < sidenotes.length - 1; i += 2) {
    let index = sidenotes[i];
    let text = sidenotes[i + 1];
    sidenoteMap.set(index, text);
  }

  // Replace sidenotes in text
  for (let [key, note] of sidenoteMap) {
    tag = "{% sidenote %}" + note + "{% endsidenote %}";
    textContent = textContent.replace(key, tag);
  }
  return textContent;
}

// TODO(stevenchun): the output of the sidenote split will need to be tested. And then we want to do the same but with MD links and images to make them the hexo format.
function insertSidenotesForMarkdown(content) {
  let split = content.split(kMarkdownFootnoteSplit);
  let textContent = split[split.length - 2];
  let sidenoteContent = split[split.length - 1];
  // Regex matching any numeric between two brackets with a ^ preceeding and a colon after the brackets. ex. [^12]:
  let sidenotes = sidenoteContent.split(/(\[\^[0-9].?[0-9]*\]:)/g);
  let sidenoteMap = new Map();
  // Skip the first element, it's just the linebreak from the Footnote
  // separator.
  for (i = 1; i < sidenotes.length - 1; i += 2) {
    let index = sidenotes[i];
    let text = sidenotes[i + 1];
    let index_without_colon = index.replace(":", "");
    sidenoteMap.set(index_without_colon, text);
  }

  // Replace sidenotes in text. We trim since GDoc2MD inserts a linebreak at the start and 4 spaces, which causes it to be interpreted as code.
  for (let [key, note] of sidenoteMap) {
    // We render the inner content, so any markdown links are transformed into before tags are parsed.
    tag =
      "{% sidenote %}" +
      hexo.render.renderSync({ text: note.trim(), engine: "md" }) +
      "{% endsidenote %}";
    textContent = textContent.replace(key, tag);
  }
  // Recombine, so that the sidenotes are also represented below.
  return textContent + kHorizontalLine + sidenoteContent;
}

//TODO: enable an indicator to not replace.
// Currently disabled.
function replaceLinks(content) {
  console.log("Link fetch disabled, using standin previews");
  console.log("replace links");
  return content;
  // Returns an iterator in which each element has ['[abc](xyz)', 'abc', 'xyz', index, input]
  // Some idiosyncracies of this RegEx: It matches the first character before the link.
  // This is so we can exclude images, which are identical except for the !.
  // Since this *should* usually always be a space,
  // we simply add in another space once we've transformed into a preview tag.
  // Another way of doing this could be do replace [^!] with \s which will explicitly match whitespace.
  let arrMatches = content.matchAll(/[^!]\[([^\]]*)\]\(([^)]*)\)*/g);
  for (let match of arrMatches) {
    let matchedLink = match[0];
    let title = match[1];
    let link = match[2];
    // Construct hover link.
    let preview_tag =
      " {% preview " + link + " %}" + title + "{% endpreview %}";
    // Replace each match
    content = content.replace(matchedLink, preview_tag);
  }
  console.log("Finished inserting preview links.");
  return content;
}
