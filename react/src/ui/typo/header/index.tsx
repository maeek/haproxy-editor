import React from 'react';
import './header.scss'

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const Header = (props: HeaderProps) => {
  const { children, className } = props;

  return (
    <header className={`header-main${className ? ` ${className}` : ''}`}>
      <h1 className="header-main-heading">{children}</h1>
    </header>
  );
}

export default Header;
