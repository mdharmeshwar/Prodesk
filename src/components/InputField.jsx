const InputField = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  disabled,
  minLength,
}) => (
  <div className={`field ${error ? 'field--error' : ''}`}>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      minLength={minLength}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <span id={`${id}-error`} className="field__error">
        {error}
      </span>
    )}
  </div>
);

export default InputField;
