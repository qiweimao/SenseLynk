import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Navbar } from './components';
import { Home } from './pages';
import { Sensor } from './pages';
import { LoRa } from './pages';
import { Settings } from './pages';
import { File } from './pages';

const App = () => {
  return (
    <BrowserRouter>
    <div className='flex flex-col'>
    {/* <div className='h-screen overflow-hidden flex flex-col'> */}
        <Navbar/>
        <div className=' grow p-2 '>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/sensor" element={<Sensor />} />
            <Route path="/lora" element={<LoRa />} />
            <Route path="/files" element={<File />} />
          </Routes>
        </div>
    </div>
    </BrowserRouter>
  )
}

export default App