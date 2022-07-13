import './App.css';
import Navbar from './components/navbar.js';
import Map from './components/map.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' />
        </Routes>
      </Router>

      <Map/>

    </div>
  );
}

export default App;
