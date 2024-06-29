import React, { useState } from 'react';
import './App.css';
import JobPannel from './components/jobPannel'; // Ensure the import matches the file name
import Header from './components/header';
import CardColumns from './components/CardColumns';
function App() {

  const [headerTitle, setHeaderTitle] = useState('Senior Java Developer');
  const [selectedJobId, setSelectedJobId] = useState(null);

  return (
    <div className="App">
      <Header title={headerTitle} />
      <div className="main-content">
      <JobPannel setHeaderTitle={setHeaderTitle} setSelectedJobId={setSelectedJobId} />
        {selectedJobId && <CardColumns jobId={selectedJobId} />}

      </div>
    </div>
  );
}

export default App;
