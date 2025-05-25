import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Typography,
    Grid,
    IconButton,
    Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";

const PartCostForm = ({ setResults }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        filamentCostPerKg: 12,
        filamentRequired: 100,
        printingTime: 2,
        laborRate: 5,
        laborTime: 0,
        shippingCost: 0,
        marginPercentage: 50,
        commissionPercentage: 0,
        printingCostPerHour: 0.15,
    });

    const [materials, setMaterials] = useState([]);
    const [packaging, setPackaging] = useState([]);
    const [extraCommissions, setExtraCommissions] = useState([]);

    useEffect(() => {
        const savedPrintingCost = localStorage.getItem(
            "printerUsageCostPerHour"
        );

        if (
            savedPrintingCost !== null &&
            savedPrintingCost.trim() !== "" &&
            !isNaN(savedPrintingCost)
        ) {
            setFormData((prev) => ({
                ...prev,
                printingCostPerHour: parseFloat(savedPrintingCost),
            }));
        }
    }, []);

    useEffect(() => {}, [materials, packaging, extraCommissions]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddItem = (setter) => {
        setter((prev) => [...prev, { name: "", cost: 0 }]);
    };

    const handleRemoveItem = (index, setter) => {
        setter((prev) => prev.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value, setter) => {
        setter((prev) => {
            const updated = [...prev];
            switch (field) {
                case "name":
                    updated[index].name = value.toString();
                    break;
                case "cost":
                    updated[index].cost = parseFloat(value);
                    break;
                default:
                    break;
            }
            return updated;
        });
    };

    const calculateCosts = () => {
        const extraMaterialsCost = materials.reduce(
            (acc, item) => acc + item.cost,
            0
        );

        const packagingCost = packaging.reduce(
            (acc, item) => acc + item.cost,
            0
        );

        const printingTimeCost =
            formData.printingTime * formData.printingCostPerHour;

        const filamentCost =
            (formData.filamentRequired / 1000) * formData.filamentCostPerKg;

        const laborCost = (formData.laborTime / 60) * formData.laborRate;

        const totalMaterialCosts =
            Number(filamentCost) +
            Number(printingTimeCost) +
            Number(extraMaterialsCost) +
            Number(packagingCost);

        const marginAmountFromMaterials = totalMaterialCosts * (formData.marginPercentage / 100);

        const percentageToPay =
            formData.commissionPercentage +
            extraCommissions.reduce((acc, item) => {
                return acc + item;
            }, 0);

        const netCost = totalMaterialCosts + marginAmountFromMaterials + Number(laborCost) + Number(formData.shippingCost);;

        console.log(percentageToPay)

        const commissionFactor = (percentageToPay / 100) > 0 ? percentageToPay / 1000 : percentageToPay / 100;

        const finalPrice = netCost / (1 - commissionFactor)

        const commissionAmount = finalPrice * commissionFactor;

        console.log(`Monto del Costo + Margen: ${netCost}`);
        console.log(`Porcentaje de la comision: ${commissionFactor}`);
        console.log(`Monto de la comision: ${commissionAmount}`);
        console.log(`Precio Final: ${finalPrice}`);

        setResults({
            totalCosts: totalMaterialCosts.toFixed(2),
            marginAmount: marginAmountFromMaterials.toFixed(2),
            commissionAmount: isFinite(commissionAmount)
                ? commissionAmount.toFixed(2)
                : "La comision es igual o mayor a la suma del costo y beneficio.",
            finalPrice: isFinite(finalPrice)
                ? finalPrice.toFixed(2)
                : "Venta inviable.",
        });
    };

    return (
        <>
            {[
                {
                    title: "Costo de Pieza",
                    fields: [
                        {
                            label: "Costo del Filamento ($/kg)",
                            name: "filamentCostPerKg",
                        },
                        {
                            label: "Filamento Requerido (g)",
                            name: "filamentRequired",
                        },
                        {
                            label: "Tiempo de Impresión (hr)",
                            name: "printingTime",
                        },
                        {
                            label: "Costo de Impresión por Hora ($)",
                            value: formData.printingCostPerHour,
                            disabled: true,
                            info: {
                                title: "Clickea aqui para calcular tu costo de impresión por hora",
                                redirect: "/printer-usage-cost-calculator",
                            },
                        },
                    ],
                },
                {
                    title: "Costo de Mano de Obra",
                    fields: [
                        {
                            label: "Tarifa de Mano de Obra ($/hr)",
                            name: "laborRate",
                        },
                        {
                            label: "Tiempo de Mano de Obra (min)",
                            name: "laborTime",
                        },
                    ],
                },
                {
                    title: "Costo de Materiales",
                    addExtraItems: {
                        enabled: true,
                        label: "Material",
                        list: materials,
                        setter: (e) => setMaterials(e),
                    },
                },
                {
                    title: "Costo de Envío",
                    additionalField: {
                        label: "Costo de Envío ($)",
                        name: "shippingCost",
                    },
                    addExtraItems: {
                        enabled: true,
                        label: "Packaging",
                        list: packaging,
                        setter: setPackaging,
                    },
                },
                {
                    title: "Margen de Ganancia",
                    fields: [
                        {
                            label: "Porcentaje de Margen (%)",
                            name: "marginPercentage",
                        },
                    ],
                },
                {
                    title: "Comisiones e Impuestos",
                    fields: [
                        {
                            label: "Comisión por Venta (%)",
                            name: "commissionPercentage",
                        },
                    ],
                    listType: "percentage",
                    addExtraItems: {
                        enabled: true,
                        label: "Comisión",
                        list: extraCommissions,
                        setter: setExtraCommissions,
                    },
                },
            ].map((section, index) => (
                <Accordion key={index} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{section.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            {section.fields &&
                                section.fields.map((field, idx) => (
                                    <Grid item xs={6} key={idx}>
                                        {field.info ? (
                                            <Grid
                                                container
                                                alignItems="center"
                                                justifyContent="space-between"
                                                spacing={0}
                                            >
                                                <Grid item xs={10} key={idx}>
                                                    <TextField
                                                        fullWidth
                                                        label={field.label}
                                                        name={field.name}
                                                        type="number"
                                                        value={
                                                            field.value > 0
                                                                ? field.value
                                                                : formData[
                                                                      field.name
                                                                  ]
                                                        }
                                                        onChange={handleChange}
                                                        disabled={
                                                            field.disabled
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Tooltip
                                                        title={field.info.title}
                                                    >
                                                        <IconButton
                                                            onClick={() =>
                                                                navigate(
                                                                    field.info
                                                                        .redirect
                                                                )
                                                            }
                                                        >
                                                            <InfoIcon color="primary" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <TextField
                                                fullWidth
                                                label={field.label}
                                                name={field.name}
                                                type="number"
                                                value={
                                                    field.value > 0
                                                        ? field.value
                                                        : formData[field.name]
                                                }
                                                onChange={handleChange}
                                                disabled={field.disabled}
                                            />
                                        )}
                                    </Grid>
                                ))}

                            {section.addExtraItems?.enabled &&
                                section.addExtraItems?.list.map((item, idx) => (
                                    <Grid
                                        item
                                        container
                                        spacing={2}
                                        key={idx}
                                        alignItems="center"
                                    >
                                        <Grid item xs={5}>
                                            <TextField
                                                fullWidth
                                                label={
                                                    section.addExtraItems
                                                        ?.label +
                                                    " " +
                                                    (idx + 1)
                                                }
                                                value={item.name}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        idx,
                                                        "name",
                                                        e.target.value,
                                                        section.addExtraItems
                                                            .setter
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextField
                                                fullWidth
                                                label="Costo ($)"
                                                type="number"
                                                value={item.cost}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        idx,
                                                        "cost",
                                                        e.target.value,
                                                        section.addExtraItems
                                                            .setter
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        idx,
                                                        section.addExtraItems
                                                            .setter
                                                    )
                                                }
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}

                            {section.addExtraItems?.enabled ? (
                                <Grid item xs={12}>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={() =>
                                            handleAddItem(
                                                section.addExtraItems?.setter
                                            )
                                        }
                                    >
                                        Agregar
                                    </Button>
                                </Grid>
                            ) : (
                                <></>
                            )}

                            {section.additionalField && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={section.additionalField.label}
                                        name={section.additionalField.name}
                                        type="number"
                                        value={
                                            formData[
                                                section.additionalField.name
                                            ]
                                        }
                                        onChange={handleChange}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={calculateCosts}
            >
                Calcular
            </Button>
        </>
    );
};

export default PartCostForm;
