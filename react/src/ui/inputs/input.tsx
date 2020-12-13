import React, { ReactNode } from 'react';
import './input.scss';

interface InputProps {
  ref?: any;
  className?: string;

  prefix?: ReactNode | ReactNode[] | (() => React.ReactNode);
  suffix?: ReactNode | ReactNode[] | (() => React.ReactNode);

  name?: string;
  initValue?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;

  onChange?: Function;
}

const Input = (props: InputProps) => {
  const {
    name,
    initValue,
    onChange,
    ref,
    required,
    disabled,
    readOnly,
    className,
    prefix,
    suffix,
    placeholder
  } = props;

  const [value, setValue] = React.useState(initValue);
  const innerRef = React.useRef(ref);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`input-container${className ? ` ${className}` : ''}`}>
      {prefix}

      <input
        type="text"
        value={value}
        onChange={onChangeHandler}
        ref={innerRef}
        name={name}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
      />

      {suffix}
    </div>
  );
};

Input.defaultProps = {
  required: false,
  disabled: false,
  readOnly: false,
  placeholder: 'Aa'
}

export default Input;
