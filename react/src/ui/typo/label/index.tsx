import React from 'react';
import './label.scss'

interface LabelProps {
  children?: React.ReactNode;
  className?: string;
  text?:string;
}

const Label = (props: LabelProps) => {
  const { children, className, text } = props;

  return (
    <label className={`label-main${className ? ` ${className}` : ''}`}>
      <div className="label-main-text">{text}</div>
      {children}
    </label>
  );
}

export default Label;
