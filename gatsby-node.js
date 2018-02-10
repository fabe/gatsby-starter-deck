const path = require('path');

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = ({ page, boundActionCreators }) => {
  const { createPage, deletePage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    // Remove trailing slash
    const newPage = Object.assign({}, page, {
      path: page.path === `/` ? page.path : page.path.replace(/\/$/, ``)
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
      allMarkdownRemark {
        edges {
          node {
            html
            fileAbsolutePath
            id
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const absolutePath = node.fileAbsolutePath;
      const fileName = path.basename(absolutePath, path.extname(absolutePath));

      createPage({
        path: fileName,
        component: blogPostTemplate,
        context: { absolutePath }
      });
    });
  });
};
