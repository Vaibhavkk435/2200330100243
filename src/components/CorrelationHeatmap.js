import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const CorrelationHeatmap = () => {
  const [minutes, setMinutes] = useState('');
  const [stocks, setStocks] = useState({});
  const [stockData, setStockData] = useState({});
  const [correlationMatrix, setCorrelationMatrix] = useState([]);

  useEffect(() => {
    axios.get('http://20.244.56.144/evaluation-service/stocks')
      .then(response => {
        setStocks(response.data.stocks);
      })
      .catch(error => {
        console.error('Error fetching stocks:', error);
      });
  }, []);

  const handleMinutesChange = (event) => {
    setMinutes(event.target.value);
  };

  const calculateCorrelation = async () => {
    if (minutes) {
      const allStockData = {};
      for (const ticker in stocks) {
        try {
          const response = await axios.get(`http://20.244.56.144/evaluation-service/stocks/${stocks[ticker]}/${minutes}`);
          allStockData[stocks[ticker]] = response.data.map(d => d.price);
        } catch (error) {
          console.error(`Error fetching data for ${stocks[ticker]}:`, error);
        }
      }
      setStockData(allStockData);
      calculateCorrelationMatrix(allStockData);
    }
  };

  const calculateMean = (data) => {
    return data.reduce((a, b) => a + b, 0) / data.length;
  };

  const calculateCovariance = (dataX, dataY) => {
    const meanX = calculateMean(dataX);
    const meanY = calculateMean(dataY);
    let covariance = 0;
    for (let i = 0; i < dataX.length; i++) {
      covariance += (dataX[i] - meanX) * (dataY[i] - meanY);
    }
    return covariance / (dataX.length - 1);
  };

  const calculateStdDev = (data) => {
    const mean = calculateMean(data);
    const sqDiff = data.map(d => Math.pow(d - mean, 2));
    const avgSqDiff = calculateMean(sqDiff);
    return Math.sqrt(avgSqDiff);
  };

  const calculateCorrelationMatrix = (data) => {
    const tickers = Object.keys(data);
    const matrix = [];
    for (let i = 0; i < tickers.length; i++) {
      const row = [];
      for (let j = 0; j < tickers.length; j++) {
        const ticker1 = tickers[i];
        const ticker2 = tickers[j];
        const data1 = data[ticker1];
        const data2 = data[ticker2];
        const minLength = Math.min(data1.length, data2.length);
        if(minLength < 2) {
            row.push(0);
            continue;
        }
        const alignedData1 = data1.slice(data1.length - minLength);
        const alignedData2 = data2.slice(data2.length - minLength);
        const covariance = calculateCovariance(alignedData1, alignedData2);
        const stdDev1 = calculateStdDev(alignedData1);
        const stdDev2 = calculateStdDev(alignedData2);
        if (stdDev1 === 0 || stdDev2 === 0) {
          row.push(0);
        } else {
          row.push(covariance / (stdDev1 * stdDev2));
        }
      }
      matrix.push(row);
    }
    setCorrelationMatrix(matrix);
  };

  const getCorrelationColor = (value) => {
    const r = value > 0 ? 255 - (value * 255) : 255;
    const g = value < 0 ? 255 - (Math.abs(value) * 255) : 255;
    const b = 255 - (Math.abs(value) * 255);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div>
      <h1>Correlation Heatmap</h1>
      <TextField
        label="Minutes"
        variant="outlined"
        value={minutes}
        onChange={handleMinutesChange}
        type="number"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={calculateCorrelation}>Calculate</Button>
      {correlationMatrix.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th></th>
                {Object.keys(stockData).map(ticker => <th key={ticker} style={{ padding: '5px', border: '1px solid #ddd' }}>{ticker}</th>)}
              </tr>
            </thead>
            <tbody>
              {correlationMatrix.map((row, i) => (
                <tr key={i}>
                  <th style={{ padding: '5px', border: '1px solid #ddd' }}>{Object.keys(stockData)[i]}</th>
                  {row.map((value, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        backgroundColor: getCorrelationColor(value),
                        textAlign: 'center',
                        color: Math.abs(value) > 0.5 ? 'white' : 'black'
                      }}
                      title={`Correlation: ${value.toFixed(2)}`}
                    >
                      {value.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CorrelationHeatmap; 