const path = require('path');
const fs = require('fs');
const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const crypto = require('crypto');

exports.sourceNodes = ({ actions, reporter }) => {
  const { createNode } = actions;

  let slides = fs.readFile(
    path.resolve(process.cwd(), 'src/slides.md'),
    (err, data) => {
      if (err) {
        reporter.panic('No slides.md file found inside `src/`.');
      }

      const slides = data
        .toString()
        .split('---\n')
        .map(body => body.trim());

      slides.forEach((slide, index) => {
        remark()
          .use(recommended)
          .use(html)
          .process(slide, (err, file) => {
            const digest = crypto
              .createHash(`md5`)
              .update(String(file))
              .digest(`hex`);

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
    }
  );
};
