import PropTypes from 'prop-types';

import styles from '../EventForm.module.css';

export default function TextFieldGroup({
  name,
  validator,
  onChange,
  caption,
  className,
  inline,
  noLabel,
  value,
  fill,
  placeholder,
}) {
  const handleChange = (event) => {
    onChange(name, event.target.value);
  };

  const invalid = validator !== '';
  if (caption === '') caption = name;
  const invalidMaybeClass = invalid ? ' bp5-intent-danger' : '';

  return (
    <div
      className={`bp5-form-group ${
        inline ? 'bp5-inline' : ''
      }${invalidMaybeClass} ${className}`}
    >
      {!noLabel && (
        <label
          htmlFor={name}
          className={`bp5-label bp5-inline ${styles.label_text}`}
        >
          {caption}
        </label>
      )}
      <div
        className={`bp5-form-content ${styles.fullWidth}${invalidMaybeClass}`}
      >
        <input
          id={name}
          className={`bp5-input ${
            fill ? styles.fill : ''
          } ${invalidMaybeClass}`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {invalid && <div className="bp5-form-helper-text">{validator}</div>}
      </div>
    </div>
  );
}

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  caption: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  validator: PropTypes.string,
  inline: PropTypes.bool,
  className: PropTypes.string,
  fill: PropTypes.bool,
  noLabel: PropTypes.bool,
  placeholder: PropTypes.string,
};

TextFieldGroup.defaultProps = {
  caption: '',
  value: '',
  onChange: () => {},
  validator: '',
  inline: false,
  className: '',
  fill: false,
  noLabel: false,
  placeholder: '',
};
