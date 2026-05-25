import React, { useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Typography,
    Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ResinPrinterCostForm = ({ setResults }) => {
    const [formData, setFormData] = useState({
        // Configuración general (compartida)
        recoveryMonths: 12,
        monthlyHours: 100,
        avgPrintHours: 4,
        failureRate: 15,
        electricityPrice: 0.15,
        // Impresora
        printerValue: 900,
        uvScreenPrice: 60,
        uvScreenLifeHours: 1500,
        fepPrice: 10,
        fepLifespanPrints: 50,
        annualMaintenanceCost: 90,
        printerPowerKWh: 0.05,
        // Wash + Cure Station
        washCureStationValue: 280,
        stationAnnualMaintenanceCost: 28,
        washStationWatts: 0,
        curingStationWatts: 20,
    });

    const handleChange = (e) => {
        const name = e.target.name;
        let value = parseFloat(e.target.value);
        if (name === "printerValue") {
            value = value || 0;
            setFormData({ ...formData, printerValue: value, annualMaintenanceCost: (value * 0.1).toFixed(2) });
        } else if (name === "washCureStationValue") {
            value = value || 0;
            setFormData({ ...formData, washCureStationValue: value, stationAnnualMaintenanceCost: (value * 0.1).toFixed(2) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const calculateCost = () => {
        if (formData.recoveryMonths <= 0 || formData.monthlyHours <= 0) {
            alert("El tiempo de recuperación y las horas mensuales deben ser mayores a 0.");
            return;
        }

        const hoursUntilRecovery = formData.monthlyHours * formData.recoveryMonths;
        const yearlyHours = formData.monthlyHours * 12;

        // Impresora
        const recoveryCostPerHour = formData.printerValue / hoursUntilRecovery;
        const uvScreenCostPerHour = formData.uvScreenPrice / formData.uvScreenLifeHours;
        const fepCostPerHour = (formData.fepPrice / formData.fepLifespanPrints) / formData.avgPrintHours;
        const maintenanceCostPerHour = formData.annualMaintenanceCost / yearlyHours;
        const printerElectricityCostPerHour = formData.printerPowerKWh * formData.electricityPrice;

        // Wash + Cure Station
        const washCureRecoveryCostPerHour = (formData.washCureStationValue || 0) / hoursUntilRecovery;
        const stationMaintenanceCostPerHour = (formData.stationAnnualMaintenanceCost || 0) / yearlyHours;

        const totalCostPerHour =
            recoveryCostPerHour +
            uvScreenCostPerHour +
            fepCostPerHour +
            maintenanceCostPerHour +
            printerElectricityCostPerHour +
            washCureRecoveryCostPerHour +
            stationMaintenanceCostPerHour;

        setResults({
            hoursUntilRecovery: hoursUntilRecovery.toFixed(0),
            recoveryCostPerHour: recoveryCostPerHour.toFixed(4),
            uvScreenCostPerHour: uvScreenCostPerHour.toFixed(4),
            fepCostPerHour: fepCostPerHour.toFixed(4),
            maintenanceCostPerHour: maintenanceCostPerHour.toFixed(4),
            printerElectricityCostPerHour: printerElectricityCostPerHour.toFixed(4),
            washCureRecoveryCostPerHour: washCureRecoveryCostPerHour.toFixed(4),
            stationMaintenanceCostPerHour: stationMaintenanceCostPerHour.toFixed(4),
            totalCostPerHour: totalCostPerHour.toFixed(4),
            failureRate: formData.failureRate,
            electricityPrice: formData.electricityPrice,
            washStationWatts: formData.washStationWatts,
            curingStationWatts: formData.curingStationWatts,
        });
    };

    const sections = [
        {
            title: "Configuración General",
            fields: [
                { label: "Tiempo para Recuperar Inversión (meses)", name: "recoveryMonths" },
                { label: "Horas de Uso Estimadas por Mes", name: "monthlyHours" },
                { label: "Duración Promedio de Impresión (horas)", name: "avgPrintHours" },
                { label: "Tasa de Merma y Fallos (%)", name: "failureRate" },
                { label: "Precio de Electricidad ($/kWh)", name: "electricityPrice" },
            ],
        },
        {
            title: "Impresora",
            fields: [
                { label: "Valor de la Impresora ($)", name: "printerValue" },
                { label: "Precio de Pantalla UV ($)", name: "uvScreenPrice" },
                { label: "Vida Útil de Pantalla UV (horas)", name: "uvScreenLifeHours" },
                { label: "Precio del FEP ($ / sheet)", name: "fepPrice" },
                { label: "Vida Útil del FEP (prints)", name: "fepLifespanPrints" },
                { label: "Mantenimiento Anual ($)", name: "annualMaintenanceCost" },
                { label: "Consumo de la Impresora (kWh/hora)", name: "printerPowerKWh" },
            ],
        },
        {
            title: "Wash + Cure Station (opcional)",
            fields: [
                { label: "Valor de la Station ($)", name: "washCureStationValue" },
                { label: "Mantenimiento Anual Station ($)", name: "stationAnnualMaintenanceCost" },
                { label: "Watts Wash Station", name: "washStationWatts" },
                { label: "Watts Curing Station", name: "curingStationWatts" },
            ],
        },
    ];

    return (
        <>
            {sections.map((section, index) => (
                <Accordion key={index} defaultExpanded={index < 2}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{section.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            {section.fields.map((field) => (
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
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={calculateCost}
            >
                Calcular Costo por Hora
            </Button>
        </>
    );
};

export default ResinPrinterCostForm;
