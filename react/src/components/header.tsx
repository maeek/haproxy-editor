import React from 'react';

interface HeaderProps {
  text?: string;
  children?: React.ReactNode;
}

const Header = (props: HeaderProps) => {
  const {text, children} = props;

  return (
    <header>
      <h1>{text}</h1>
      {children}
    </header>
  );
}

export default Header;
