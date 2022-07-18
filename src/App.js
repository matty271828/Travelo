import './App.css';
import Navbar from './components/navbar.js';
import Map from './components/map.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {

  const [data, setData] = useState('');
  const childToParent = (childdata) => {
    setData(childdata);
  }

  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' />
        </Routes>
      </Router>

      <span>{data}</span>

      <Map childToParent={childToParent}/>
    </div>
  );
}

export default App;
