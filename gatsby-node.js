const path = require('path');

// Remove trailing slash
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
