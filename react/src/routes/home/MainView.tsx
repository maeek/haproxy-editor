import React from 'react';
import Header from '../../components/header'
import Menu from '../../components/menu';
import '../App.css';

function App() {
  return (
    <div className="app-page">
      <Header text="Haproxy"></Header>
      <Menu />
    </div>
  );
}

export default App;
