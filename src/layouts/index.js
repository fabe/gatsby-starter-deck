import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link, { navigateTo } from 'gatsby-link';
import Helmet from 'react-helmet';
import Swipeable from 'react-swipeable';

import './index.css';

const Header = ({ name, title, date }) => (
  <header>
    <Link to="/1">
      <span>{name}</span> — {title}
    </Link>
    <time>{date}</time>
  </header>
);

class TemplateWrapper extends Component {
  NEXT = 39;
  PREV = 37;

  swipeLeft = () => {
    this.navigate({ keyCode: this.NEXT });
  };

  swipeRight = () => {
    this.navigate({ keyCode: this.PREV });
  };

  navigate = ({ keyCode }) => {
    const now = parseInt(location.pathname.substr(1));

    const slides = this.props.data.allMarkdownRemark.edges.filter(
      ({ node }) => {
        const id = node.fileAbsolutePath.replace(/^.*[\\\/]/, '').split('.')[0];

        if (id && id !== 404) {
          return true;
        }
      }
    );

    if (now) {
      if (keyCode === this.PREV && now === 1) {
        return false;
      } else if (keyCode === this.NEXT && now === slides.length) {
        return false;
      } else if (keyCode === this.NEXT) {
        navigateTo(`/${now + 1}`);
      } else if (keyCode === this.PREV) {
        navigateTo(`/${now - 1}`);
      }
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.navigate);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.navigate);
  }

  render() {
    const { children, data } = this.props;
    return (
      <div>
        <Helmet
          title={`${data.site.siteMetadata.title} — ${data.site.siteMetadata
            .name}`}
        />
        <Header
          name={data.site.siteMetadata.name}
          title={data.site.siteMetadata.title}
          date={data.site.siteMetadata.date}
        />
        <Swipeable
          onSwipingLeft={this.swipeLeft}
          onSwipingRight={this.swipeRight}
        >
          <div id="slide">{children()}</div>
        </Swipeable>
      </div>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
  data: PropTypes.object,
};

export default TemplateWrapper;

export const pageQuery = graphql`
  query PageQuery {
    site {
      siteMetadata {
        name
        title
        date
      }
    }
    allMarkdownRemark {
      edges {
        node {
          fileAbsolutePath
        }
      }
    }
  }
`;
