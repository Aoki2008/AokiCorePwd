import React from 'react';
import { HashRouter, BrowserRouter } from 'react-router-dom';

const AppRouter = ({ children }) => {
    // Check if running in Electron or specifically requested to use HashRouter
    const isElectron = import.meta.env.VITE_IS_ELECTRON === 'true';

    if (isElectron) {
        return <HashRouter>{children}</HashRouter>;
    }

    return <BrowserRouter>{children}</BrowserRouter>;
};

export default AppRouter;
