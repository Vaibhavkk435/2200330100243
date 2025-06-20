import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StockPage from './components/StockPage';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Price Aggregator
          </Typography>
          <Button color="inherit" component={Link} to="/stock">Stock Page</Button>
          <Button color="inherit" component={Link} to="/heatmap">Correlation Heatmap</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/stock" element={<StockPage />} />
        <Route path="/heatmap" element={<CorrelationHeatmap />} />
        <Route path="/" element={<StockPage />} />
      </Routes>
    </Router>
  );
}

export default App; 