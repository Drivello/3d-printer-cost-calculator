import React from "react";
import { Paper, Typography, Divider, Button, Box, Grid, TextField } from "@mui/material";

const PartCostResults = ({ results }) => {
    const [costName, setCostName] = React.useState("");

    const getColor = (result) => {
        return isNaN(result) ? "red" : "green";
    };
    const getText = (result) => {
        return isNaN(result)
            ? result
            : "Precio Final con Comisiones: $" + result;
    };

    const saveCostInLocalStorage = (newCost, name) => {
        const existingCosts = JSON.parse(localStorage.getItem("costs")) || [];
        existingCosts.push({ name, cost: newCost });
        localStorage.setItem("costs", JSON.stringify(existingCosts));
    };

    return (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5">Resultados del Cálculo</Typography>

            {/* Costos Totales */}
            <Typography variant="h6" sx={{ mt: 2 }}>
                Costos Totales: ${results.totalCosts}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Margen de Ganancia */}
            <Typography variant="h6">
                Monto del Margen: ${results.marginAmount}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Comisiones */}
            <Typography variant="h6">
                {isNaN(results.commissionAmount)
                    ? results.commissionAmount
                    : "Comisión por Venta: $" + results.commissionAmount}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Precio Final */}

            <Typography
                variant="h5"
                sx={{
                    mt: 2,
                    color: getColor(results.finalPrice),
                }}
            >
                {getText(results.finalPrice)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            label="Nombre del Cálculo"
                            variant="outlined"
                            value={costName}
                            onChange={(e) => setCostName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={costName.trim() === ""}
                            onClick={saveCostInLocalStorage}
                        >
                            Guardar resultados
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default PartCostResults;
