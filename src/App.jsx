import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import HomePage from "./pages/HomePage";
import PrinterUsageCostPage from "./pages/PrinterUsageCostPage";
import ResinHomePage from "./pages/ResinHomePage";
import ResinPrinterCostPage from "./pages/ResinPrinterCostPage";

const navLinks = [
    { label: "FDM — Precio de Pieza", to: "/" },
    { label: "FDM — Costo Impresora", to: "/printer-usage-cost-calculator" },
    { label: "Resina — Precio de Pieza", to: "/resina" },
    { label: "Resina — Costo por Hora", to: "/resina-costo-impresora" },
];

const Nav = () => {
    const location = useLocation();
    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
                {navLinks.map((link) => (
                    <Button
                        key={link.to}
                        component={Link}
                        to={link.to}
                        variant={location.pathname === link.to ? "contained" : "text"}
                        size="small"
                    >
                        {link.label}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
};

const App = () => {
    return (
        <>
            <Nav />
            <Box>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/printer-usage-cost-calculator"
                        element={<PrinterUsageCostPage />}
                    />
                    <Route path="/resina" element={<ResinHomePage />} />
                    <Route
                        path="/resina-costo-impresora"
                        element={<ResinPrinterCostPage />}
                    />
                </Routes>
            </Box>
        </>
    );
};

export default App;
