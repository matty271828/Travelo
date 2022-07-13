import './App.css';
import Navbar from './components/navbar.js';
import Map from './components/map.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {

  return (
    <div className="App">
      <Router>
        <Navbar/>
      </Router>

      <Map/>
    </div>
  );
}

export default App;
