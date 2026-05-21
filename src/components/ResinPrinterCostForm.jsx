import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";

const ResinPrinterCostForm = ({ setResults }) => {
    const [formData, setFormData] = useState({
        printerValue: 300,
        recoveryMonths: 12,
        monthlyHours: 100,
        uvScreenPrice: 60,
        uvScreenLifeHours: 1500,
        fepPrice: 10,
        fepLifespanPrints: 50,
        avgPrintHours: 4,
        failureRate: 15,
        annualMaintenanceCost: 30,
        electricityPrice: 0.15,
        printerPowerKWh: 0.05,
        washStationWatts: 0,
        curingStationWatts: 20,
    });

    const handleChange = (e) => {
        let value = parseFloat(e.target.value);
        if (e.target.name === "printerValue") {
            value = value || 0;
            setFormData({
                ...formData,
                printerValue: value,
                annualMaintenanceCost: (value * 0.1).toFixed(2),
            });
        } else {
            setFormData({ ...formData, [e.target.name]: value });
        }
    };

    const calculateCost = () => {
        if (formData.recoveryMonths <= 0 || formData.monthlyHours <= 0) {
            alert("El tiempo de recuperación y las horas mensuales deben ser mayores a 0.");
            return;
        }

        const hoursUntilRecovery = formData.monthlyHours * formData.recoveryMonths;
        const recoveryCostPerHour = formData.printerValue / hoursUntilRecovery;
        const uvScreenCostPerHour = formData.uvScreenPrice / formData.uvScreenLifeHours;
        const fepCostPerPrint = formData.fepPrice / formData.fepLifespanPrints;
        const fepCostPerHour = fepCostPerPrint / formData.avgPrintHours;
        const yearlyHours = formData.monthlyHours * 12;
        const maintenanceCostPerHour = formData.annualMaintenanceCost / yearlyHours;
        const electricityCostPerHour = formData.printerPowerKWh * formData.electricityPrice;
        const totalCostPerHour =
            recoveryCostPerHour +
            uvScreenCostPerHour +
            fepCostPerHour +
            maintenanceCostPerHour +
            electricityCostPerHour;

        setResults({
            hoursUntilRecovery: hoursUntilRecovery.toFixed(0),
            recoveryCostPerHour: recoveryCostPerHour.toFixed(4),
            uvScreenCostPerHour: uvScreenCostPerHour.toFixed(4),
            fepCostPerHour: fepCostPerHour.toFixed(4),
            maintenanceCostPerHour: maintenanceCostPerHour.toFixed(4),
            electricityCostPerHour: electricityCostPerHour.toFixed(4),
            totalCostPerHour: totalCostPerHour.toFixed(4),
            failureRate: formData.failureRate,
            electricityPrice: formData.electricityPrice,
            washStationWatts: formData.washStationWatts,
            curingStationWatts: formData.curingStationWatts,
        });
    };

    return (
        <Grid container spacing={2}>
            {[
                { label: "Valor de la Impresora ($)", name: "printerValue" },
                { label: "Tiempo para Recuperar Inversión (meses)", name: "recoveryMonths" },
                { label: "Horas de Uso Estimadas por Mes", name: "monthlyHours" },
                { label: "Precio de Pantalla UV ($)", name: "uvScreenPrice" },
                { label: "Vida Útil de Pantalla UV (horas)", name: "uvScreenLifeHours" },
                { label: "Precio del FEP ($ / sheet)", name: "fepPrice" },
                { label: "Vida Útil del FEP (prints)", name: "fepLifespanPrints" },
                { label: "Duración Promedio de Impresión (horas)", name: "avgPrintHours" },
                { label: "Tasa de Merma y Fallos (%)", name: "failureRate" },
                { label: "Mantenimiento Anual ($)", name: "annualMaintenanceCost" },
                { label: "Precio de Electricidad ($/kWh)", name: "electricityPrice" },
                { label: "Consumo de la Impresora (kWh/hora)", name: "printerPowerKWh" },
                { label: "Watts Wash Station (0 si manual)", name: "washStationWatts" },
                { label: "Watts Curing Station", name: "curingStationWatts" },
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
                    onClick={calculateCost}
                >
                    Calcular Costo por Hora
                </Button>
            </Grid>
        </Grid>
    );
};

export default ResinPrinterCostForm;
