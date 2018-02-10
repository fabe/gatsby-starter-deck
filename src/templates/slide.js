import React from 'react';

export default ({ data, pathContext, transition }) => (
  <div
    style={transition && transition.style}
    dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
  />
);

export const pageQuery = graphql`
  query SlideByPath($absolutePath: String!) {
    markdownRemark(fileAbsolutePath: { eq: $absolutePath }) {
      html
    }
  }
`;
