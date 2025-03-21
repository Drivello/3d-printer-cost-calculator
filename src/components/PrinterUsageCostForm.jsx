import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";

const PrinterUsageCostForm = ({ setResults }) => {
    const [formData, setFormData] = useState({
        printerValue: 500, // Valor de la impresora ($)
        desiredRecoveryTime: 12, // Tiempo deseado para recuperar la inversión (meses)
        estimatedMonthlyHours: 250, // Horas estimadas de uso por mes
        annualReplacementCost: 50, // Costo de repuestos anuales ($)
        printerLifeYears: 3, // Vida útil de la impresora (años)
        electricityCostPerKWh: 0.15, // Costo de electricidad ($/kWh)
        printerPowerKWh: 0.2, // Consumo de la impresora en kWh por hora
    });

    // Maneja cambios en los inputs
    const handleChange = (e) => {
        let value = parseFloat(e.target.value);
        if (e.target.name === "printerValue") {
            value = value || 0;
            setFormData({
                ...formData,
                printerValue: value,
                annualReplacementCost: (value * 0.1).toFixed(2), // Recalcula 10% del valor de la impresora
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: value,
            });
        }
    };

    const calculateWearCost = () => {
        if (
            formData.desiredRecoveryTime <= 0 ||
            formData.estimatedMonthlyHours <= 0
        ) {
            alert(
                "El tiempo de recuperación y las horas de uso por mes deben ser mayores a 0."
            );
            return;
        }

        // Horas totales de uso hasta la recuperación
        const hoursUntilRecovery =
            formData.estimatedMonthlyHours * formData.desiredRecoveryTime;

        // Costo de recuperación por hora (se basa en el tiempo deseado de recuperación)
        const recoveryCostPerHour = formData.printerValue / hoursUntilRecovery;

        // Costo de repuestos por hora
        const yearlyHours = formData.estimatedMonthlyHours * 12;
        const replacementCostPerHour =
            formData.annualReplacementCost / yearlyHours;

        // Costo de electricidad por hora
        const electricityCostPerHour =
            formData.printerPowerKWh * formData.electricityCostPerKWh;

        // Costo total de uso por hora
        const wearCostPerHour =
            recoveryCostPerHour +
            replacementCostPerHour +
            electricityCostPerHour;

        setResults({
            hoursUntilRecovery: hoursUntilRecovery.toFixed(0),
            recoveryCostPerHour: recoveryCostPerHour.toFixed(4),
            replacementCostPerHour: replacementCostPerHour.toFixed(4),
            electricityCostPerHour: electricityCostPerHour.toFixed(4),
            wearCostPerHour: wearCostPerHour.toFixed(4),
        });
    };

    return (
        <Grid container spacing={2}>
            {[
                { label: "Valor de la Impresora ($)", name: "printerValue" },
                {
                    label: "Tiempo para Recuperar Inversión (meses)",
                    name: "desiredRecoveryTime",
                },
                {
                    label: "Horas de Uso Estimadas por Mes",
                    name: "estimatedMonthlyHours",
                },
                {
                    label: "Costo de Repuestos Anuales ($)",
                    name: "annualReplacementCost",
                },
                {
                    label: "Costo de Electricidad ($/kWh)",
                    name: "electricityCostPerKWh",
                },
                {
                    label: "Consumo de la Impresora (kWh por hora)",
                    name: "printerPowerKWh",
                },
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
                    onClick={calculateWearCost}
                >
                    Calcular Costo de Uso
                </Button>
            </Grid>
        </Grid>
    );
};

export default PrinterUsageCostForm;
