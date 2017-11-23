import React from 'react';

export default ({ children, cite }) => (
  <blockquote>
    <div>{children}</div>
    <cite>{cite}</cite>
  </blockquote>
);
