import logo from './logo.svg';
import './App.css';

import { Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      {/* // <div className="bg-red-500">
      //   Priya Ranjan
      // </div> */}

      <Toaster></Toaster>

      <main>
        <Outlet></Outlet>
      </main>
    
    </>
  );
}

export default App;
