import React from 'react';
import './standard.scss'

interface StandardProps {
  children?: React.ReactNode;
  className?: string;
}

const Standard = (props: StandardProps) => {
  const { children, className } = props;

  return (
    <span className={`standard-main${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}

export default Standard;
