import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProviders = ({children}) => {
  // State that returns true when the coin selector Dialog must be shown or not
  const [coinManagerOpen, setCoinManagerOpen] = useState(false);
  // State that returns true when the info Dialog must be shown or not
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  // State that contains the crypto coins selected by the user
  const [coinList, setCoinList] = useState([]);
  // State that keeps track of the extension of the trendline.
  const [trendLineExtension, setTrendLineExtension] = useState();
  // State that keeps track of the selected points for the trend line
  const [trendLineData, setTrendLineData] = useState([]);
  // State that keeps the timespan for the moving average
  const [timespan, setTimespan] = useState("day");
  // State that returns true when the moving average must be shown or not
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  // State that returns true when the moving average must be shown or not
  const [showPatterns, setShowPatterns] = useState(false);
  // State that keeps track of the found patterns
  const [candlestickPatterns, setCandlestickPatterns] = useState([]);
  // State that returns true when the candlestick pattern Dialog must be shown or not
  const [patternInfoModalOpen, setPatternInfoModalOpen] = useState(false);

  // All the values to be returned by the AppContext.
  const value = {
    coinManagerOpen,
    setCoinManagerOpen,
    infoModalOpen,
    setInfoModalOpen,
    coinList,
    setCoinList,
    trendLineExtension,
    setTrendLineExtension,
    trendLineData,
    setTrendLineData,
    timespan,
    setTimespan,
    showMovingAverage,
    setShowMovingAverage,
    candlestickPatterns,
    setCandlestickPatterns,
    showPatterns,
    setShowPatterns,
    patternInfoModalOpen, 
    setPatternInfoModalOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}