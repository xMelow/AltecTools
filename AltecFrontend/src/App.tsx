import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen'
import Navbar from './components/Navbar'
import TsplScreen from './pages/TsplPreviewScreen'
import PrinterScreen from './pages/PrinterScreen'
import AutomationsScreen from './pages/AutomationsScreen'
import PrinterDetailedScreen from "./pages/PrinterDetailedScreen";
import InktFolieCalculatorScreen from './pages/InkFolieCalculatorScreen'

export default function App() {
  return (
      <BrowserRouter>
          <div className="min-h-screen bg-altec-light">
              <header className="bg-altec-gray px-8 py-4 shadow-md flex items-center justify-between">
                  <h1 className="text-black text-4xl font-bold tracking-wide">
                      Altec tools
                  </h1>
                  <Navbar />
                  <img src="/src/assets/logo.png" alt="logo" className="h-15 w-auto"/>
              </header>
              <main className="max-w-10xl mx-auto px-6 py-8">
                  <Routes>
                      <Route path="/" element={<HomeScreen />}/>
                      <Route path='/tspl' element={<TsplScreen />} />
                      <Route path='/printers' element={<PrinterScreen />} />
                      <Route path='/automations' element={<AutomationsScreen />} />
                      <Route path='/printers/:ipAddress' element={<PrinterDetailedScreen />} />
                      <Route path='/tools/ink-calculator' element={<InktFolieCalculatorScreen />} />
                  </Routes>
              </main>
            </div>
      </BrowserRouter>
  )
}
