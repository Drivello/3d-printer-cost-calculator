import React, { useState } from "react";
import { Container, Typography, Paper, Divider } from "@mui/material";
import PartCostForm from "../components/PartCostForm";
import PartCostResults from "../components/PartCostResults";

const HomePage = () => {
    const [partResults, setPartResults] = useState(null);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Calculadora de Ventas de Impresion 3D
                </Typography>

                {/* Formulario para ingresar datos */}
                <PartCostForm setResults={setPartResults} />

                <Divider sx={{ my: 4 }} />

                {/* Mostrar resultados */}
                {partResults && <PartCostResults results={partResults} />}
            </Paper>
        </Container>
    );
};

export default HomePage;
