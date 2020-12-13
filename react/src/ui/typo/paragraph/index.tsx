import React from 'react';
import './paragraph.scss'

interface ParagraphProps {
  children?: React.ReactNode;
  className?: string;
}

const Paragraph = (props: ParagraphProps) => {
  const { children, className } = props;

  return (
    <p className={`paragraph-main${className ? ` ${className}` : ''}`}>
      {children}
    </p>
  );
}

export default Paragraph;
