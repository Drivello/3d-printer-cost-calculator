import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Grid } from "@mui/material";

const ResinPrinterCostResults = ({ results }) => {
    const navigate = useNavigate();
    const [customCost, setCustomCost] = useState(results.totalCostPerHour);

    useEffect(() => {
        const savedCost = localStorage.getItem("resinPrinterCostPerHour");
        if (savedCost) {
            setCustomCost(parseFloat(savedCost).toFixed(4));
        }
    }, [results.totalCostPerHour]);

    const handleChange = (e) => {
        setCustomCost(e.target.value);
    };

    const saveToLocalStorage = () => {
        localStorage.setItem("resinPrinterCostPerHour", customCost);
        alert(`Costo guardado: $${customCost} por hora`);
        navigate("/resina");
    };

    return (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5">Resultados del Cálculo</Typography>
            <Typography variant="body1">
                Horas Totales para Recuperación: {results.hoursUntilRecovery} horas
            </Typography>
            <Typography variant="body1">
                Costo de Recuperación por Hora: ${results.recoveryCostPerHour}
            </Typography>
            <Typography variant="body1">
                Desgaste de Pantalla UV por Hora: ${results.uvScreenCostPerHour}
            </Typography>
            <Typography variant="body1">
                Mantenimiento por Hora: ${results.maintenanceCostPerHour}
            </Typography>
            <Typography variant="body1">
                Electricidad por Hora: ${results.electricityCostPerHour}
            </Typography>

            <Typography variant="h5" sx={{ mt: 2, color: "green" }}>
                Costo Total por Hora: ${results.totalCostPerHour}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        label="Costo Personalizado ($/hora)"
                        type="number"
                        value={customCost}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={saveToLocalStorage}
                    >
                        Guardar
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ResinPrinterCostResults;
