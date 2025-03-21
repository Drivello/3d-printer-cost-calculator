import React, { useState } from "react";
import { Container, Typography, Paper, Divider } from "@mui/material";
import PrinterUsageCostForm from "../components/PrinterUsageCostForm";
import PrinterUsageCostResults from "../components/PrinterUsageCostResults";

const PrinterUsageCostPage = () => {
    const [wearResults, setWearResults] = useState(null);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Calculadora de Costo de Uso por Hora
                </Typography>

                {/* Formulario para ingresar datos */}
                <PrinterUsageCostForm setResults={setWearResults} />

                <Divider sx={{ my: 4 }} />

                {/* Mostrar resultados */}
                {wearResults && (
                    <PrinterUsageCostResults results={wearResults} />
                )}
            </Paper>
        </Container>
    );
};

export default PrinterUsageCostPage;
