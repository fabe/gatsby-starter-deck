const path = require('path');
const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const crypto = require(`crypto`);

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  return new Promise((resolve, reject) => {
    // Remove trailing slash
    const newPage = Object.assign({}, page, {
      path: page.path === `/` ? page.path : page.path.replace(/\/$/, ``),
    });

    if (newPage.path !== page.path) {
      // Remove the old page
      deletePage(page);
      // Add the new page
      createPage(newPage);
    }

    resolve();
  });
};

// Create nodes from Markdown.
exports.onCreateNode = ({ node, actions }) => {
  const { createNode } = actions;

  if (node.internal.type !== 'MarkdownRemark') {
    return;
  }

  const slides = node.rawMarkdownBody
    .split('---\n')
    .map(rawMarkdownBody => rawMarkdownBody.trim());

  slides.forEach((slide, index) => {
    remark()
      .use(recommended)
      .use(html)
      .process(slide, (err, file) => {
        const digest = crypto
          .createHash(`md5`)
          .update(String(file))
          .digest(`hex`);

        console.log(digest);

        createNode({
          id: `Slide__${index + 1}`,
          parent: `__SOURCE__`,
          children: [],
          internal: {
            type: `Slide`,
            contentDigest: digest,
          },
          html: String(file),
          index: index + 1,
        });
      });
  });
};

// Create pages from markdown nodes
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const blogPostTemplate = path.resolve(`src/templates/slide.js`);

  return graphql(`
    {
      allSlide {
        edges {
          node {
            html
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const slides = result.data.allSlide.edges;

    slides.forEach((slide, index) => {
      createPage({
        path: `/${index + 1}`,
        component: blogPostTemplate,
        context: {
          id: `Slide__${index + 1}`,
          absolutePath: process.cwd() + `/src/slides#${index + 1}`,
        },
      });
    });
  });
};
