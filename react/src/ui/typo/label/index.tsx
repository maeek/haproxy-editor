import React from 'react';
import './label.scss'

interface LabelProps {
  children?: React.ReactNode;
  className?: string;
}

const Label = (props: LabelProps) => {
  const { children, className } = props;

  return (
    <label className={`label-main${className ? ` ${className}` : ''}`}>
      {children}
    </label>
  );
}

export default Label;
