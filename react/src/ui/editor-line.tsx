import React from 'react';

interface EditorLineProps {
  config: any; // HaproxyConfig;
  children?: React.ReactNode;
}

const EditorLine = (props: EditorLineProps) => {
  const { config, children } = props;
  const key = Object.keys(config)[0];
  const value = config[key];

  return (
    <section>
      {children}
    </section>
  );
}

export default EditorLine;
