hexo.extend.filter.register('before_post_render', function(data) {
  contentWithSidenotes = insertSidenotes(data.content);
  if (contentWithSidenotes != null) {
    data.content = contentWithSidenotes;
    return data;
  }
});

function insertSidenotes(content) {
  let kFootnoteSplit = '^^^^';
  let split = content.split(kFootnoteSplit);
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
    tag = '{% sidenote %}' + note + '{% endsidenote %}';
    textContent = textContent.replace(key, tag);
  }
  return textContent;
}
