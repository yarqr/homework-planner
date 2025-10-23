import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import { PageAuth } from './Pages/PageAuth';
import { PageCalendar } from './Pages/PageCalendar';

function App() {
  return (
    <BrowserRouter>
    <title>homework planner</title>
      <div className="App">
        <Routes>
          <Route path="/" element={<PageAuth/>}/>
          <Route path="/calendar" element={<PageCalendar/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
