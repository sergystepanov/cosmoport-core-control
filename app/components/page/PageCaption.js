import React from 'react';
import PropTypes from 'prop-types';

import styles from './PageCaption.css';

const PageCaption = (params) => (
  <div className={styles.caption}>
    <span className={styles.liter}>{params.text.charAt(0)}</span>{params.text.substr(1)}
  </div>
);

PageCaption.propTypes = { text: PropTypes.string };
PageCaption.defaultProps = { text: '' };

export default PageCaption;
