import {PropTypes} from 'react';

export default PropTypes.objectOf(PropTypes.shape({
  id: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.string)
}));
