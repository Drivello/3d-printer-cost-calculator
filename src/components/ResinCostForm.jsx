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

const PERSIST_KEY = "resinCostFormConfig";

const PERSISTENT_FIELDS = [
    "resinPricePerLiter",
    "fepPrice",
    "fepLifespanPrints",
    "glovePrice",
    "wipesCost",
    "ipaPricePerLiter",
    "ipamlPerWash",
    "washStationWatts",
    "washTimeMin",
    "curingStationWatts",
    "curingTimeMin",
    "electricityPrice",
    "laborRate",
    "overheadPercent",
    "marginPercentage",
    "commissionPercentage",
];

const ResinCostForm = ({ setResults }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        resinPricePerLiter: 45,
        resinMlUsed: 50,
        wastePercent: 15,
        fepPrice: 10,
        fepLifespanPrints: 50,
        glovePrice: 0.3,
        wipesCost: 0.2,
        ipaPricePerLiter: 5,
        ipamlPerWash: 100,
        washStationWatts: 0,
        washTimeMin: 10,
        curingStationWatts: 20,
        curingTimeMin: 5,
        electricityPrice: 0.15,
        printHours: 3,
        resinPrinterCostPerHour: 0.1,
        laborRate: 5,
        prepTimeMin: 15,
        postTimeMin: 30,
        overheadPercent: 20,
        shippingCost: 0,
        marginPercentage: 50,
        commissionPercentage: 0,
    });

    const [packaging, setPackaging] = useState([]);
    const [extraCommissions, setExtraCommissions] = useState([]);
    const [extraConsumables, setExtraConsumables] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(PERSIST_KEY) || "{}");
        const printerCost = localStorage.getItem("resinPrinterCostPerHour");
        const savedConsumables = JSON.parse(
            localStorage.getItem("resinExtraConsumables") || "[]"
        );
        setFormData((prev) => ({
            ...prev,
            ...saved,
            ...(printerCost && !isNaN(printerCost)
                ? { resinPrinterCostPerHour: parseFloat(printerCost) }
                : {}),
        }));
        if (savedConsumables.length > 0) setExtraConsumables(savedConsumables);
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "resinExtraConsumables",
            JSON.stringify(extraConsumables)
        );
    }, [extraConsumables]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (PERSISTENT_FIELDS.includes(name)) {
            const saved = JSON.parse(localStorage.getItem(PERSIST_KEY) || "{}");
            saved[name] = value;
            localStorage.setItem(PERSIST_KEY, JSON.stringify(saved));
        }
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
            if (field === "name") updated[index].name = value.toString();
            if (field === "cost") updated[index].cost = parseFloat(value) || 0;
            return updated;
        });
    };

    const calculateCosts = () => {
        const resinCost =
            (formData.resinPricePerLiter / 1000) *
            formData.resinMlUsed *
            (1 + formData.wastePercent / 100);

        const fepCostPerPrint = formData.fepPrice / formData.fepLifespanPrints;
        const extraConsumablesCost = extraConsumables.reduce(
            (acc, item) => acc + (parseFloat(item.cost) || 0),
            0
        );
        const consumablesCost =
            fepCostPerPrint +
            Number(formData.glovePrice) +
            Number(formData.wipesCost) +
            extraConsumablesCost;

        const ipaCost =
            (formData.ipaPricePerLiter / 1000) * formData.ipamlPerWash;
        const washEnergyCost =
            (formData.washStationWatts / 1000) *
            (formData.washTimeMin / 60) *
            formData.electricityPrice;
        const curingEnergyCost =
            (formData.curingStationWatts / 1000) *
            (formData.curingTimeMin / 60) *
            formData.electricityPrice;
        const postProcessCost = ipaCost + washEnergyCost + curingEnergyCost;

        const printerCost =
            formData.printHours * formData.resinPrinterCostPerHour;

        const laborCost =
            ((Number(formData.prepTimeMin) + Number(formData.postTimeMin)) /
                60) *
            formData.laborRate;

        const packagingCost = packaging.reduce(
            (acc, item) => acc + (parseFloat(item.cost) || 0),
            0
        );

        const subtotal =
            resinCost +
            consumablesCost +
            postProcessCost +
            printerCost +
            laborCost +
            packagingCost +
            Number(formData.shippingCost);

        const overheadAmount = subtotal * (formData.overheadPercent / 100);
        const totalCosts = subtotal + overheadAmount;

        const marginAmount = totalCosts * (formData.marginPercentage / 100);
        const netCost = totalCosts + marginAmount;

        const percentageToPay =
            Number(formData.commissionPercentage) +
            extraCommissions.reduce(
                (acc, item) => acc + (parseFloat(item.cost) || 0),
                0
            );

        const commissionFactor =
            percentageToPay / 100 > 0
                ? percentageToPay / 1000
                : percentageToPay / 100;

        const finalPrice = netCost / (1 - commissionFactor);
        const commissionAmount = finalPrice * commissionFactor;

        setResults({
            resinCost: resinCost.toFixed(2),
            consumablesCost: consumablesCost.toFixed(2),
            postProcessCost: postProcessCost.toFixed(2),
            printerCost: printerCost.toFixed(2),
            laborCost: laborCost.toFixed(2),
            overheadPercent: formData.overheadPercent,
            overheadAmount: overheadAmount.toFixed(2),
            totalCosts: totalCosts.toFixed(2),
            marginAmount: marginAmount.toFixed(2),
            commissionAmount: isFinite(commissionAmount)
                ? commissionAmount.toFixed(2)
                : "La comisión es igual o mayor al costo total.",
            finalPrice: isFinite(finalPrice)
                ? finalPrice.toFixed(2)
                : "Venta inviable.",
        });
    };

    const sections = [
        {
            title: "Resina",
            fields: [
                { label: "Precio de Resina ($/litro)", name: "resinPricePerLiter" },
                { label: "Resina Usada (ml)", name: "resinMlUsed" },
                { label: "Merma — Soportes y Fallos (%)", name: "wastePercent" },
            ],
        },
        {
            title: "Consumibles por Pieza",
            fields: [
                { label: "Precio del FEP ($ / sheet)", name: "fepPrice" },
                { label: "Vida Útil del FEP (prints)", name: "fepLifespanPrints" },
                { label: "Precio de Guantes ($ / par)", name: "glovePrice" },
                { label: "Toallas / Insumos ($ / sesión)", name: "wipesCost" },
            ],
            addExtraItems: {
                enabled: true,
                label: "Consumible",
                list: extraConsumables,
                setter: setExtraConsumables,
            },
        },
        {
            title: "Post-procesado",
            fields: [
                { label: "Precio IPA ($/litro)", name: "ipaPricePerLiter" },
                { label: "IPA por Lavado (ml)", name: "ipamlPerWash" },
                { label: "Watts Wash Station (0 si manual)", name: "washStationWatts" },
                { label: "Tiempo de Lavado (min)", name: "washTimeMin" },
                { label: "Watts Curing Station", name: "curingStationWatts" },
                { label: "Tiempo de Curado (min)", name: "curingTimeMin" },
                { label: "Precio Electricidad ($/kWh)", name: "electricityPrice" },
            ],
        },
        {
            title: "Tiempo de Impresión",
            fields: [
                { label: "Tiempo de Impresión (horas)", name: "printHours" },
                {
                    label: "Costo de Impresora por Hora ($)",
                    value: formData.resinPrinterCostPerHour,
                    disabled: true,
                    info: {
                        title: "Clic aquí para calcular el costo por hora de tu impresora de resina",
                        redirect: "/resina-costo-impresora",
                    },
                },
            ],
        },
        {
            title: "Mano de Obra",
            fields: [
                { label: "Tarifa de Mano de Obra ($/hora)", name: "laborRate" },
                { label: "Tiempo de Preparación (min)", name: "prepTimeMin" },
                { label: "Tiempo de Post-procesado (min)", name: "postTimeMin" },
            ],
        },
        {
            title: "Buffer de Overhead",
            fields: [
                { label: "Buffer de Gastos Generales (%)", name: "overheadPercent" },
            ],
        },
        {
            title: "Envío y Packaging",
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
                { label: "Porcentaje de Margen (%)", name: "marginPercentage" },
            ],
        },
        {
            title: "Comisiones e Impuestos",
            fields: [
                { label: "Comisión por Venta (%)", name: "commissionPercentage" },
            ],
            listType: "percentage",
            addExtraItems: {
                enabled: true,
                label: "Comisión",
                list: extraCommissions,
                setter: setExtraCommissions,
            },
        },
    ];

    return (
        <>
            {sections.map((section, index) => (
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
                                                <Grid item xs={10}>
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
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Tooltip title={field.info.title}>
                                                        <IconButton
                                                            onClick={() =>
                                                                navigate(field.info.redirect)
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
                                                    field.value !== undefined
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
                                section.addExtraItems.list.map((item, idx) => (
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
                                                    section.addExtraItems.label +
                                                    " " +
                                                    (idx + 1)
                                                }
                                                value={item.name}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        idx,
                                                        "name",
                                                        e.target.value,
                                                        section.addExtraItems.setter
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextField
                                                fullWidth
                                                label={
                                                    section.listType === "percentage"
                                                        ? "Porcentaje (%)"
                                                        : "Costo ($)"
                                                }
                                                type="number"
                                                value={item.cost}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        idx,
                                                        "cost",
                                                        e.target.value,
                                                        section.addExtraItems.setter
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
                                                        section.addExtraItems.setter
                                                    )
                                                }
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}

                            {section.addExtraItems?.enabled && (
                                <Grid item xs={12}>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={() =>
                                            handleAddItem(section.addExtraItems.setter)
                                        }
                                    >
                                        Agregar
                                    </Button>
                                </Grid>
                            )}

                            {section.additionalField && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={section.additionalField.label}
                                        name={section.additionalField.name}
                                        type="number"
                                        value={formData[section.additionalField.name]}
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

export default ResinCostForm;
