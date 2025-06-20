# Stock Price Aggregation Frontend

A React-based web application for real-time stock price analytics and visualization, built as part of a stock exchange platform evaluation.

## 🚀 Features

### 📊 Stock Price Dashboard
- Interactive price charts with customizable time intervals
- Real-time stock price tracking
- Highlighted average price trends
- Hover/selection tooltips showing detailed stock information
- Time-based filtering (last m minutes)

### 🔥 Correlation Heatmap
- Visual correlation matrix between all available stocks
- Color-coded correlation strength indicators
- Statistical insights including:
  - Average price correlation
  - Standard deviation calculations
  - Pearson's correlation coefficients

### 📱 Responsive Design
- Material UI components for consistent user experience
- Mobile-friendly responsive layout
- Performance-optimized for real-time data

## 🛠️ Tech Stack

- **Frontend**: React.js
- **UI Framework**: Material UI (required - no other CSS libraries allowed)
- **Styling**: Native CSS (Material UI + custom CSS only)
- **Charts**: Built-in charting components
- **API**: Custom Stock Exchange API integration
- **Port**: http://localhost:3000

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Valid API credentials (clientID, clientSecret, access token)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-price-aggregation-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://20.244.56.144/evaluation-service
   REACT_APP_CLIENT_ID=your_client_id
   REACT_APP_CLIENT
