import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Panel from './components/Panel/Panel';

function App() {
  return (
    <>
      <Header />
      <div className="home-container">
        <Panel />
      </div>
    </>
  );
}

export default App;
