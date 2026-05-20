import React from "react";
import {
    Paper,
    Typography,
    Divider,
    Button,
    Box,
    Grid,
    TextField,
} from "@mui/material";

const ResinCostResults = ({ results }) => {
    const [costName, setCostName] = React.useState("");

    const getColor = (result) => (isNaN(result) ? "red" : "green");
    const getText = (result) =>
        isNaN(result) ? result : "Precio Final con Comisiones: $" + result;

    const saveCostInLocalStorage = () => {
        const existingCosts = JSON.parse(localStorage.getItem("costs")) || [];
        existingCosts.push({ name: costName, cost: results.finalPrice });
        localStorage.setItem("costs", JSON.stringify(existingCosts));
    };

    return (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5">Resultados del Cálculo</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Resina: ${results.resinCost}
            </Typography>
            <Typography variant="h6">
                Consumibles (FEP + guantes + insumos): ${results.consumablesCost}
            </Typography>
            <Typography variant="h6">
                Post-procesado (IPA + energía): ${results.postProcessCost}
            </Typography>
            <Typography variant="h6">
                Impresora: ${results.printerCost}
            </Typography>
            <Typography variant="h6">
                Mano de Obra: ${results.laborCost}
            </Typography>
            <Typography variant="h6">
                Overhead ({results.overheadPercent}%): ${results.overheadAmount}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">
                Costos Totales: ${results.totalCosts}
            </Typography>
            <Typography variant="h6">
                Margen de Ganancia: ${results.marginAmount}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">
                {isNaN(results.commissionAmount)
                    ? results.commissionAmount
                    : "Comisión por Venta: $" + results.commissionAmount}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
                variant="h5"
                sx={{ mt: 2, color: getColor(results.finalPrice) }}
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

export default ResinCostResults;
