import React, { useState } from "react";
import { Container, Typography, Paper, Divider } from "@mui/material";
import ResinCostForm from "../components/ResinCostForm";
import ResinCostResults from "../components/ResinCostResults";

const ResinHomePage = () => {
    const [resinResults, setResinResults] = useState(null);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Calculadora de Costos — Resina
                </Typography>

                <ResinCostForm setResults={setResinResults} />

                <Divider sx={{ my: 4 }} />

                {resinResults && <ResinCostResults results={resinResults} />}
            </Paper>
        </Container>
    );
};

export default ResinHomePage;
