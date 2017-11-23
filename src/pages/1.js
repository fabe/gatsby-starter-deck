import React from 'react';
import Link from 'gatsby-link';

export default ({ transition }) => (
  <div style={transition && transition.style}>
    <h1>Gatsby Deck</h1>
    <p>Create presentations using Gatsby & React.</p>
  </div>
);
