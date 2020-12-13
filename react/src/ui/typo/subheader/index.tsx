import React from 'react';
import './sub-header.scss'

interface SubHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const SubHeader = (props: SubHeaderProps) => {
  const { children, className } = props;

  return (
    <header className={`subheader-main${className ? ` ${className}` : ''}`}>
      <h3 className="subheader-main-heading">{children}</h3>
    </header>
  );
}

export default SubHeader;
