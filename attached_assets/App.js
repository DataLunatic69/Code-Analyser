import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Code Quality Analyzer</h1>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input">
          <label>
            Choose code file (.py, .js, .jsx):
            <input 
              type="file" 
              accept=".py,.js,.jsx" 
              onChange={handleFileChange} 
              disabled={loading}
            />
          </label>
        </div>
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Analyzing...' : 'Analyze Code'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {analysis && (
        <div className="results">
          <h2>Analysis Results</h2>
          
          <div className="score-card">
            <h3>Overall Score</h3>
            <div className="score-value">{analysis.overall_score}/100</div>
            <div className="score-bar">
              <div 
                className="score-progress" 
                style={{ width: `${analysis.overall_score}%` }}
              ></div>
            </div>
          </div>

          <div className="breakdown">
            <h3>Category Scores</h3>
            <div className="category">
              <span>Naming Conventions</span>
              <span>{analysis.breakdown.naming}/10</span>
            </div>
            <div className="category">
              <span>Modularity</span>
              <span>{analysis.breakdown.modularity}/20</span>
            </div>
            <div className="category">
              <span>Comments</span>
              <span>{analysis.breakdown.comments}/20</span>
            </div>
            <div className="category">
              <span>Formatting</span>
              <span>{analysis.breakdown.formatting}/15</span>
            </div>
            <div className="category">
              <span>Reusability</span>
              <span>{analysis.breakdown.reusability}/15</span>
            </div>
            <div className="category">
              <span>Best Practices</span>
              <span>{analysis.breakdown.best_practices}/20</span>
            </div>
          </div>

          <div className="recommendations">
            <h3>Recommendations</h3>
            <ul>
              {analysis.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;