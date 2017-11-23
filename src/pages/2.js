import React from 'react';
import Link from 'gatsby-link';
import Quote from '../components/Quote';

export default ({ transition }) => (
  <div style={transition && transition.style}>
    <Quote cite="Don Norman">
      Inscrutable icons litter the face of the devices even though the research
      community has long demonstrated that people cannot remember the meaning of
      more than a small number of icons […] Who can remember what each icon
      means? Not me.
    </Quote>
  </div>
);
