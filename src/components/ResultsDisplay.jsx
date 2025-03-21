import React from "react";
import { Paper, Typography } from "@mui/material";

const ResultsDisplay = ({ results }) => {
    return (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5">Resultados del Cálculo</Typography>
            <Typography variant="body1">
                Costo Capital por Hora: ${results.printerCapitalCostPerHour}
            </Typography>
            <Typography variant="body1">
                Costo Eléctrico por Hora: $
                {results.printerElectricalCostPerHour}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
                Costo Total por Hora de Impresión: $
                {results.totalPrinterCostPerHour}
            </Typography>
        </Paper>
    );
};

export default ResultsDisplay;
