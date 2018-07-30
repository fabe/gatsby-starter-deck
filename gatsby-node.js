const path = require('path');
const matter = require('gray-matter');
const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = ({ page, boundActionCreators }) => {
  const { createPage, deletePage } = boundActionCreators;

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

// Create slides from Markdown.
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  const blogPostTemplate = path.resolve(`src/templates/slide.js`);

  return graphql(`
    {
      markdownRemark(fileAbsolutePath: { regex: "/slides/" }) {
        rawMarkdownBody
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    console.log(result);

    const slides = result.data.markdownRemark.rawMarkdownBody
      .split('---\n')
      .map(rawMarkdownBody => rawMarkdownBody.trim());

    slides.forEach((slide, index) => {
      remark()
        .use(recommended)
        .use(html)
        .process(slide, (err, file) => {
          createPage({
            path: `/${index + 1}`,
            component: blogPostTemplate,
            context: {
              html: String(file),
              absolutePath: process.cwd() + `/${index + 1}.md`,
            },
          });
        });
    });
  });
};
