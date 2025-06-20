import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel, TextField, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedStock, setSelectedStock] = useState('');
  const [minutes, setMinutes] = useState('');
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://20.244.56.144/evaluation-service/stocks')
      .then(response => {
        setStocks(response.data.stocks);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch stocks');
        setLoading(false);
        console.error('Error fetching stocks:', error);
      });
  }, []);

  useEffect(() => {
    console.log('Stocks:', stocks);
  }, [stocks]);

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const handleMinutesChange = (event) => {
    setMinutes(event.target.value);
  };

  const fetchStockData = () => {
    if (selectedStock && minutes) {
      axios.get(`http://20.244.56.144/evaluation-service/stocks/${selectedStock}/${minutes}`)
        .then(response => {
          setStockData(response.data);
        })
        .catch(error => {
          console.error('Error fetching stock data:', error);
        });
    }
  };

  const averagePrice = stockData.length > 0
    ? stockData.reduce((acc, data) => acc + data.price, 0) / stockData.length
    : 0;

  const chartData = {
    labels: stockData.map(data => new Date(data.lastUpdatedAt).toLocaleTimeString()),
    datasets: [
      {
        label: `${selectedStock} Price`,
        data: stockData.map(data => data.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Average Price',
        data: Array(stockData.length).fill(averagePrice),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
        borderWidth: 3,
        pointRadius: 0,
      }
    ],
  };

  return (
    <div>
      <h1>Stock Page</h1>
      {loading && <div>Loading stocks...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      <FormControl fullWidth>
        <InputLabel id="stock-select-label">Select Stock</InputLabel>
        <Select
          labelId="stock-select-label"
          id="stock-select"
          value={selectedStock}
          label="Select Stock"
          onChange={handleStockChange}
        >
          {stocks && Object.entries(stocks).map(([name, ticker]) => (
            <MenuItem key={ticker} value={ticker}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Minutes"
        variant="outlined"
        value={minutes}
        onChange={handleMinutesChange}
        type="number"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={fetchStockData}>Get Prices</Button>
      {stockData.length > 0 && <Line data={chartData} />}
    </div>
  );
};

export default StockPage; 