import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './index.css';
import { AppLayout } from './ui/AppLayout';
import { HomePage } from './routes/HomePage';
import { HistoryPage } from './routes/HistoryPage';
import { SettingsPage } from './routes/SettingsPage';
import { ModelCardPage } from './routes/ModelCardPage';
const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(AppLayout, {}),
        children: [
            { index: true, element: _jsx(HomePage, {}) },
            { path: 'history', element: _jsx(HistoryPage, {}) },
            { path: 'settings', element: _jsx(SettingsPage, {}) },
            { path: 'model', element: _jsx(ModelCardPage, {}) },
        ],
    },
]);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(RouterProvider, { router: router }), _jsx(Toaster, { position: "top-right", richColors: true })] }) }));
