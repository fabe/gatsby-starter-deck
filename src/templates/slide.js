import React from 'react';
import { graphql } from 'gatsby';

export default ({ data, transition }) => (
  <div>
    <div
      style={transition && transition.style}
      dangerouslySetInnerHTML={{ __html: data.slide.html }}
    />
  </div>
);

export const query = graphql`
  query SlideQuery($id: String!) {
    site {
      siteMetadata {
        name
        title
        date
      }
    }
    slide(id: { eq: $id }) {
      html
      index
    }
    allSlide {
      edges {
        node {
          id
        }
      }
    }
  }
`;
