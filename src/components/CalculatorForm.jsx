import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";

const CalculatorForm = ({ setResults }) => {
    const [formData, setFormData] = useState({
        printerCost: 500,
        additionalCost: 0,
        maintenanceCost: 75,
        printerLife: 3,
        uptime: 50,
        powerConsumption: 150,
        electricityCost: 0.15,
        bufferFactor: 1.3,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: parseFloat(e.target.value),
        });
    };

    const calculateCosts = () => {
        const totalInvestment = formData.printerCost + formData.additionalCost;
        const lifetimeCost =
            totalInvestment + formData.maintenanceCost * formData.printerLife;
        const estimatedUptimeHours = (formData.uptime / 100) * 365 * 24;

        const printerCapitalCostPerHour = (
            lifetimeCost /
            (formData.printerLife * estimatedUptimeHours)
        ).toFixed(2);
        const printerElectricalCostPerHour = (
            (formData.powerConsumption / 1000) *
            formData.electricityCost
        ).toFixed(2);
        const totalPrinterCostPerHour =
            (parseFloat(printerCapitalCostPerHour) +
                parseFloat(printerElectricalCostPerHour)) *
            formData.bufferFactor;

        setResults({
            printerCapitalCostPerHour,
            printerElectricalCostPerHour,
            totalPrinterCostPerHour: totalPrinterCostPerHour.toFixed(2),
        });
    };

    return (
        <Grid container spacing={2}>
            {[
                { label: "Costo de la Impresora ($)", name: "printerCost" },
                { label: "Costo Adicional ($)", name: "additionalCost" },
                {
                    label: "Costo Anual de Mantenimiento ($)",
                    name: "maintenanceCost",
                },
                { label: "Vida Útil (años)", name: "printerLife" },
                { label: "Tiempo Activo (%)", name: "uptime" },
                { label: "Consumo de Energía (W)", name: "powerConsumption" },
                {
                    label: "Costo de Electricidad ($/KWh)",
                    name: "electricityCost",
                },
                { label: "Factor de Buffer", name: "bufferFactor" },
            ].map((field) => (
                <Grid item xs={6} key={field.name}>
                    <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        type="number"
                        value={formData[field.name]}
                        onChange={handleChange}
                    />
                </Grid>
            ))}
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={calculateCosts}
                >
                    Calcular
                </Button>
            </Grid>
        </Grid>
    );
};

export default CalculatorForm;
