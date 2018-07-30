import React from 'react';

export default ({ data, pathContext, transition }) => (
  <div
    style={transition && transition.style}
    dangerouslySetInnerHTML={{ __html: pathContext.html }}
  />
);
