import React from 'react';

export default ({ data, pathContext, transition }) => (
  <div>
    <div
      style={transition && transition.style}
      dangerouslySetInnerHTML={{ __html: data.slide.html }}
    />
  </div>
);

export const query = graphql`
  query SlideQuery($id: String!) {
    slide(id: { eq: $id }) {
      html
    }
  }
`;
