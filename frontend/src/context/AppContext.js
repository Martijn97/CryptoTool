import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProviders = ({children}) => {
  // State that keeps track if the tool is in offline mode
  const [offline, setOffline] = useState(false)
  // State that returns true when the coin selector Dialog must be shown or not
  const [coinManagerOpen, setCoinManagerOpen] = useState(false);
  // State that returns true when the info Dialog must be shown or not
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  // State that returns true when the comparison Dialog must be shown or not
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  // State that contains the crypto coins selected by the user
  const [coinList, setCoinList] = useState([]);
  // State that keeps track of the extension of the trendline.
  const [trendLineExtension, setTrendLineExtension] = useState();
  // State that keeps track of the selected points for the trend line
  const [trendLineData, setTrendLineData] = useState([]);
  // State that keeps track of the selected stripline
  const [striplineData, setStriplineData] = useState();
  // State that keeps the timespan for the moving average
  const [timespan, setTimespan] = useState("day");
  // State that keeps the second timespan for the moving average
  const [timespanTwo, setTimespanTwo] = useState("month");
  // State that returns true when the moving average must be shown or not
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  // State that returns true when the cross-over moving average must be shown or not
  const [showCrossMovingAverage, setShowCrossMovingAverage] = useState(false);
  // State that returns true when the candlestick patterns must be shown or not
  const [showPatterns, setShowPatterns] = useState(false);
  // State that keeps track of the found patterns
  const [candlestickPatterns, setCandlestickPatterns] = useState([]);
  // State that returns true when the candlestick pattern Dialog must be shown or not
  const [patternInfoModalOpen, setPatternInfoModalOpen] = useState(false);
  // State that returns true when the moving average Dialog must be shown or not
  const [movingAverageInfoShown, setMovingAverageInfoShown] = useState(false);
  // State that returns true when the moving average must be shown or not
  const [showFlagsMovingAverage, setShowFlagsMovingAverage] = useState(false);
  // State that keeps track if the OBV chart must be shown or not
  const [ showObvChart, setShowObvChart ] = useState(false)
  // State that returns if the OBV info modal must be shown or not
  const [ obvInfoShown, setObvInfoShown ] = useState(false)
  // State that knows if the trendline info dialog must be shown or not
  const [ trendlineInfoShown, setTrendlineInfoShown ] = useState(false)
  // State that keeps track of the charts on the overview page
  const [ chartList, setChartList ] = useState([])
  // State that keeps track of the charts in the comparison view
  const [ compareChartList, setCompareChartList ] = useState([])

  // All the values to be returned by the AppContext.
  const value = {
    offline,
    setOffline,
    coinManagerOpen,
    setCoinManagerOpen,
    infoModalOpen,
    setInfoModalOpen,
    comparisonModalOpen, 
    setComparisonModalOpen,
    coinList,
    setCoinList,
    trendLineExtension,
    setTrendLineExtension,
    trendLineData,
    setTrendLineData,
    timespan,
    setTimespan,
    timespanTwo, 
    setTimespanTwo,
    showMovingAverage,
    setShowMovingAverage,
    candlestickPatterns,
    setCandlestickPatterns,
    showPatterns,
    setShowPatterns,
    patternInfoModalOpen, 
    setPatternInfoModalOpen,
    movingAverageInfoShown, 
    setMovingAverageInfoShown,
    showFlagsMovingAverage, 
    setShowFlagsMovingAverage,
    showCrossMovingAverage, 
    setShowCrossMovingAverage,
    showObvChart, 
    setShowObvChart,
    obvInfoShown, 
    setObvInfoShown,
    trendlineInfoShown, 
    setTrendlineInfoShown,
    chartList, 
    setChartList,
    setCompareChartList, 
    compareChartList,
    striplineData, 
    setStriplineData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}