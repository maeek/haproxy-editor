import React, { FC } from 'react';
import Header from '../../ui/typo/header'
import Menu from '../../ui/menu/menu';
import AppContainer from '../../ui/containers/app';
import ContentContainer from '../../ui/containers/content';

interface EditViewProps {
  match: any;
}

const EditView: FC<EditViewProps> = (props: EditViewProps) => {
  return (
    <AppContainer>
      <Menu />
      <ContentContainer>
        <Header>{`Edit ${props.match.params.file}`}</Header>
      </ContentContainer>
    </AppContainer>
  );
}

export default EditView;
