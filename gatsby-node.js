const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem')
const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const crypto = require('crypto');
const _ = require('lodash')

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
exports.createPages = ({ actions, createNodeId, graphql }) => {
  const { createPage, createNode } = actions;
  const blogPostTemplate = path.resolve(`src/templates/slide.js`);

  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fileAbsolutePath,
            html
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const slides = result.data.allMarkdownRemark.edges;
    slides.sort((a, b) => a.node.fileAbsolutePath > b.node.fileAbsolutePath ? 1 : -1)
    const nodes = slides.flatMap((s) => s.node.html.split('<hr>').map((html) => ({
      node: s.node, html
    })))

    nodes.forEach(({ node, html }, index) => {
      const digest = crypto
        .createHash(`md5`)
        .update(html)
        .digest(`hex`);

      createNode({
        id: createNodeId(`${node.id}_${index + 1} >>> Slide`),
        parent: node.id,
        children: [],
        internal: {
          type: `Slide`,
          contentDigest: digest,
        },
        html: html,
        index: index + 1,
      });
    })

    nodes.forEach((slide, index) => {
      createPage({
        path: `/${index + 1}`,
        component: blogPostTemplate,
        context: {
          index: index + 1,
          absolutePath: process.cwd() + `/src/slides#${index + 1}`,
        },
      });
    });
  });
};
