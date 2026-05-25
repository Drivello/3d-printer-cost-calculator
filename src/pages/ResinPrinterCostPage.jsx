import React, { useState } from "react";
import { Container, Typography, Paper, Divider } from "@mui/material";
import ResinPrinterCostForm from "../components/ResinPrinterCostForm";
import ResinPrinterCostResults from "../components/ResinPrinterCostResults";

const ResinPrinterCostPage = () => {
    const [wearResults, setWearResults] = useState(null);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Resina Costo por hora
                </Typography>

                <ResinPrinterCostForm setResults={setWearResults} />

                <Divider sx={{ my: 4 }} />

                {wearResults && (
                    <ResinPrinterCostResults results={wearResults} />
                )}
            </Paper>
        </Container>
    );
};

export default ResinPrinterCostPage;
