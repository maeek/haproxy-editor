import React, { FC, ReactNode } from 'react';
import './content.scss';

interface ContentContainerProps {
  children?: ReactNode | ReactNode[];
  className?: string;
}

const ContentContainer: FC<ContentContainerProps> = (props: ContentContainerProps) => {
  const {children, className} = props;

  return (
    <div className={`content-container${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

export default ContentContainer;
