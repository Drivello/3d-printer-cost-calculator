import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Grid } from "@mui/material";

const PrinterUsageCostResults = ({ results }) => {
    const navigate = useNavigate(); // Hook para redirigir
    const [customCost, setCustomCost] = useState(results.wearCostPerHour);

    // Cargar valor desde LocalStorage si existe
    useEffect(() => {
        const savedCost = localStorage.getItem("printerUsageCostPerHour");
        if (savedCost) {
            setCustomCost(parseFloat(savedCost).toFixed(4));
        }
    }, [results.wearCostPerHour]);

    // Maneja cambios en el input
    const handleChange = (e) => {
        setCustomCost(e.target.value);
    };

    // Guarda el costo en LocalStorage y redirige al HomePage
    const saveToLocalStorage = () => {
        localStorage.setItem("printerUsageCostPerHour", customCost);
        alert(`Costo guardado: $${customCost} por hora`);
        navigate("/"); // Redirige al HomePage
    };

    return (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5">Resultados del Cálculo</Typography>
            <Typography variant="body1">
                Horas Totales para Recuperación: {results.hoursUntilRecovery}{" "}
                horas
            </Typography>
            <Typography variant="body1">
                Costo de Recuperación por Hora: ${results.recoveryCostPerHour}
            </Typography>
            <Typography variant="body1">
                Costo de Repuestos por Hora: ${results.replacementCostPerHour}
            </Typography>
            <Typography variant="body1">
                Costo de Electricidad por Hora: $
                {results.electricityCostPerHour}
            </Typography>

            <Typography variant="h5" sx={{ mt: 2, color: "green" }}>
                Costo Total de Uso por Hora: ${results.wearCostPerHour}
            </Typography>

            {/* Input para modificar el costo manualmente */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        label="Costo de Uso Personalizado ($/hora)"
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

export default PrinterUsageCostResults;
