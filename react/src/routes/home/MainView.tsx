import React, { FC, useState } from 'react';
import Header from '../../ui/typo/header'
import Menu from '../../ui/menu/menu';
import Paragraph from '../../ui/typo/paragraph';
import Standard from '../../ui/typo/standard';
import SubHeader from '../../ui/typo/subheader';
import AppContainer from '../../ui/containers/app';
import ContentContainer from '../../ui/containers/content';
import HeaderContainer from '../../ui/containers/header';
import Input from '../../ui/inputs/input';
import Modal from '../../ui/modal';

const MainView: FC = () => {
  const [modal, showModal] = useState(false);
  return (
    <AppContainer>
      <Menu />
      <ContentContainer>
        <HeaderContainer>
          <Header>Haproxy</Header>
          <SubHeader>Sub header haproxy</SubHeader>
          <Standard>This is a standard text</Standard>
          <Paragraph>This is a paragraph</Paragraph>
        </HeaderContainer>
        
        <Input
          prefix={(<div>Mode:</div>)}
          suffix={(<u>Submit</u>)}
        />

        <button onClick={() => showModal(!modal)}>Show modal</button>

        {
          modal && (
            <Modal>
              <HeaderContainer>
                <Header>Haproxy</Header>
                <SubHeader>Sub header haproxy</SubHeader>
                <Standard>This is a standard text</Standard>
                <Paragraph>This is a paragraph</Paragraph>
              </HeaderContainer>
            </Modal>
          )
        }

      </ContentContainer>
    </AppContainer>
  );
}

export default MainView;
