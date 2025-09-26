import './App.css';
import { BrowserRouter, Route } from 'react-router';
import { PageAuth } from './Pages/PageAuth';
import { PageCalendar } from './Pages/PageCalendar';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route path="/" element={<PageAuth/>}/>
        <Route path="/calendar" element={<PageCalendar/>} />
      </div>
    </BrowserRouter>
  );
}

export default App;
