import React, { FC, ReactNode } from 'react';
import './header.scss';

interface HeaderContainerProps {
  children?: ReactNode | ReactNode[];
  className?: string;
}

const HeaderContainer: FC<HeaderContainerProps> = (props: HeaderContainerProps) => {
  const {children, className} = props;

  return (
    <section className={`header-container${className ? ` ${className}` : ''}`}>
      {children}
    </section>
  );
}

export default HeaderContainer;
