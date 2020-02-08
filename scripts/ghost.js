const ghostContentAPI = require('@tryghost/content-api');

const api = new ghostContentAPI({
  url: 'http://localhost:2368',
  key: '9e460c796199a851d3d272388b',
  version: 'v3',
});

const ghostPostData = async () => {
  const data = await api.posts.browse({
    limit: 'all',
    include: 'tags,authors',
  });
  // We want to exit if Ghost isn't up.
  //.catch((err) => {
  //   console.error(err);
  // });

  data.forEach((post) => {
    tags = [];
    post.tags.forEach(function(tag) {
      // Space is neccesary or else Hexo concatenates the tag names.
      tags.push(tag.name + ' ');
    });
    const postData = {
      title: post.title,
      slug: post.slug,
      path: post.slug,
      tags: tags,
      date: post.published_at,
      content: post.html,
    };
    hexo.post.create(postData, true);
  });
};

ghostPostData();
