import React from 'react';
import CurationSystem from './components/CurationSystem'
import Introduction from './components/Introduction'
import { Route,Routes, BrowserRouter as Router } from 'react-router-dom';


function App() {
  return (
  <>
  <Router basename='rice_trait_ontology_curation_system/'>
      <Routes>
        <Route path='/' element={<CurationSystem/>} />
        <Route path='home/' element={<CurationSystem/>} />
        <Route path='guidlines/' element={<Introduction/>} />
      </Routes>
    </Router>
  </>
    
  )
}
export default App;