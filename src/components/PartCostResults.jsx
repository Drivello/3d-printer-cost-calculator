import React from "react";
import { Paper, Typography, Divider } from "@mui/material";

const PartCostResults = ({ results }) => {
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
                {typeof results.commissionAmount === "string"
                    ? results.commissionAmount
                    : "Comisión por Venta: $" + results.commissionAmount}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Precio Final */}

            <Typography
                variant="h5"
                sx={{
                    mt: 2,
                    color:
                        typeof results.finalPrice === "string"
                            ? "red"
                            : "green",
                }}
            >
                {typeof results.finalPrice === "string"
                    ? results.finalPrice
                    : "Precio Final con Comisiones: $" + results.finalPrice}
            </Typography>
        </Paper>
    );
};

export default PartCostResults;
