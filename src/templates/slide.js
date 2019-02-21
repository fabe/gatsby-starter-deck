import React from 'react';
import { graphql } from 'gatsby';

export default ({ data, transition }) => (
  <div style={{'width': '100%'}}>
    <div
      style={transition && transition.style}
      dangerouslySetInnerHTML={{ __html: data.slide.html }}
    />
  </div>
);

export const query = graphql`
  query SlideQuery($index: Int!) {
    slide(index: { eq: $index }) {
      html
      index
    }
  }
`;
