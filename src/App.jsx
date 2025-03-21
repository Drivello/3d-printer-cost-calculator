import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PrinterUsageCostPage from "./pages/PrinterUsageCostPage";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
                path="/printer-usage-cost-calculator"
                element={<PrinterUsageCostPage />}
            />
        </Routes>
    );
};

export default App;
