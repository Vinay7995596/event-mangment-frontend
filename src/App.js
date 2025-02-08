import './App.css';
import Addingevent from './components/addform';
import Homepage from './components/events';
import Loginpage from './components/login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Viewvides from './components/viewship';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route element={<Loginpage/>} path='/' />
        <Route element={<Homepage />} path='/home' />
        <Route element={<Addingevent />} path='/add' />
        <Route element={<Viewvides />} path='/view' />
      </Routes>
      </BrowserRouter>
       </div>
  );
}

export default App;
