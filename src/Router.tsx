import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './components/Layouts/DashboardLayout'
import Game from './pages/Game'
import NewGame from './pages/NewGame'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<NewGame />} />
                    <Route path="/game/:contract" element={<Game />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
