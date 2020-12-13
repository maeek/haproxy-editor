import React, { FC, ReactNode } from 'react';
import './app.scss';

interface AppContainerProps {
  children?: ReactNode | ReactNode[];
  className?: string;
}

const AppContainer: FC<AppContainerProps> = (props: AppContainerProps) => {
  const {children, className} = props;

  return (
    <div className={`app-page${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

export default AppContainer;
