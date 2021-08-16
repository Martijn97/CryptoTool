import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProviders = ({children}) => {
    // State that returns true when the coin selector Dialog must be shown or not
    const [coinManagerOpen, setCoinManagerOpen] = useState(false)
    // State that contains the crypto coins selected by the user
    const [coinList, setCoinList] = useState([])

    // All the values to be returned by the AppContext.
    const value = {coinManagerOpen, setCoinManagerOpen, coinList, setCoinList}

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}