
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CrmProvider } from './context/CrmContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Pipeline } from './pages/Pipeline';
import { Contacts } from './pages/Contacts';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { ContactDetail } from './pages/ContactDetail';
import { DealDetail } from './pages/DealDetail';

function App() {
  return (
    <ThemeProvider>
      <CrmProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/:id" element={<ContactDetail />} />
              <Route path="deals/:id" element={<DealDetail />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </CrmProvider>
    </ThemeProvider>
  );
}

export default App;