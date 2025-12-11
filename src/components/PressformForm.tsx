import type { Pressform } from "@/api/PressformAPI";
import PressformAPI from "@/api/PressformAPI";
import { Checkbox, FormControlLabel, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";

import { getProducts, type ProductDto } from "@/api/productApi";
import { getSemiproducts, type SemiproductDto } from "@/api/semiproductApi";

interface PressformWithBOM extends Pressform {
    products?: { id: string; name?: string }[];
    semiproducts?: { id: string; name?: string }[];
}

interface PressformFormProps {
    onChanged: () => void;
}

export const PressformForm: React.FC<PressformFormProps> = ({ onChanged }) => {
    const [idEditing, setIdEditing] = useState<string | null>(null);
    const [name, setName] = useState<string>("Passat-LHD");
    const [description, setDescription] = useState<string>("Пресс-форма для Passat с левым рулём");
    const [weight, setWeight] = useState<number>(5650);
    const [parts, setParts] = useState<number>(2);
    const [length, setLength] = useState<number>(4568);
    const [width, setWidth] = useState<number>(3256);
    const [height, setHeight] = useState<number>(759);
    const [manufacturer, setManufacturer] = useState<string>("Hydraulyx");
    const [installationTime, setInstallationTime] = useState<number>(0);
    const [deinstallationTime, setDeinstallationTime] = useState<number>(0);
    const [active, setActive] = useState<boolean>(false);

    const [products, setProducts] = useState<ProductDto[]>([]);
    const [semiproducts, setSemiproducts] = useState<SemiproductDto[]>([]);
    const [pressform, setPressform] = useState<PressformWithBOM[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedSemiproducts, setSelectedSemiproducts] = useState<string[]>([]);

    useEffect(() => {
        loadPressform();
        loadProducts();
        loadSemiproducts();
    }, []);

    const loadPressform = async () => {
        try {
            const res = await PressformAPI.getAll();
            const data = Array.isArray(res.data) ? res.data : [];
            const normalized: PressformWithBOM[] = (data as Pressform[]).map((p) => ({
    ...p,
    products: Array.isArray(p.products) ? p.products : [],
    semiproducts: Array.isArray(p.semiproducts) ? p.semiproducts : [],
}));
            setPressform(normalized);
        } catch (error) {
            console.error("Ошибка при загрузке пресс-форм:", error);
            setPressform([]);
        }
    };

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Ошибка при загрузке продуктов:", error);
            setProducts([]);
        }
    };

    const loadSemiproducts = async () => {
        try {
            const data = await getSemiproducts();
            setSemiproducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Ошибка при загрузке полуфабрикатов:", error);
            setSemiproducts([]);
        }
    };

    const savePressform = async () => {
        try {
            const payload: PressformWithBOM = {
                name,
                description,
                weight,
                parts,
                length,
                width,
                height,
                manufacturer,
                installationTime,
                deinstallationTime,
                active,
                products: selectedProducts.map(id => ({ id })),
                semiproducts: selectedSemiproducts.map(id => ({ id })),
            };

            if (idEditing !== null) {
                await PressformAPI.update(idEditing, payload);
                setIdEditing(null);
            } else {
                await PressformAPI.create(payload);
            }

            await loadPressform();
            clearForm();
            onChanged();
        } catch (error) {
            console.error("Ошибка при сохранении пресс-формы:", error);
            alert("Не удалось сохранить пресс-форму. Проверьте консоль для деталей.");
        }
    };

    const deletePressform = async (id?: string) => {
        if (!id) return;
        if (!window.confirm("Вы точно хотите удалить эту пресс-форму?")) return;

        await PressformAPI.delete(id);
        await loadPressform();
        onChanged();
    };

    const editPressform = (p: PressformWithBOM) => {
        setIdEditing(p.id ?? null);
        setName(p.name);
        setDescription(p.description);
        setWeight(p.weight);
        setParts(p.parts);
        setLength(p.length);
        setWidth(p.width);
        setHeight(p.height);
        setManufacturer(p.manufacturer);
        setInstallationTime(p.installationTime);
        setDeinstallationTime(p.deinstallationTime);
        setActive(Boolean(p.active));
        setSelectedProducts(Array.isArray(p.products) ? p.products.map(pr => pr.id ?? "") : []);
        setSelectedSemiproducts(Array.isArray(p.semiproducts) ? p.semiproducts.map(sp => sp.id ?? "") : []);
    };

    const clearForm = () => {
        setIdEditing(null);
        setName("");
        setDescription("");
        setWeight(0);
        setParts(0);
        setLength(0);
        setWidth(0);
        setHeight(0);
        setManufacturer("");
        setInstallationTime(0);
        setDeinstallationTime(0);
        setActive(false);
        setSelectedProducts([]);
        setSelectedSemiproducts([]);
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <h3>Управление пресс-формами</h3>

            <TextField label="Название" value={name} onChange={e => setName(e.target.value)} />
            <TextField label="Описание" value={description} onChange={e => setDescription(e.target.value)} style={{ marginLeft: 5 }} />
            <TextField label="Вес пресс-формы" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} style={{ marginLeft: 5 }} />
            <TextField label="Кол-во частей" type="number" value={parts} onChange={e => setParts(Number(e.target.value))} style={{ marginLeft: 5 }} />
            <TextField label="Длина (мм)" type="number" value={length} onChange={e => setLength(Number(e.target.value))} style={{ marginLeft: 5 }} />
            <TextField label="Ширина (мм)" type="number" value={width} onChange={e => setWidth(Number(e.target.value))} style={{ marginLeft: 5 }} />
            <TextField label="Высота (мм)" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} style={{ marginLeft: 5 }} />
            <TextField label="Производитель" value={manufacturer} onChange={e => setManufacturer(e.target.value)} style={{ marginLeft: 5 }} />
            <TextField label="Время монтажа мин" value={installationTime} onChange={e => setInstallationTime(Number(e.target.value))} style={{ marginLeft: 5 }} />
            <TextField label="Время демонтажа мин" value={deinstallationTime} onChange={e => setDeinstallationTime(Number(e.target.value))} style={{ marginLeft: 5 }} />

            <FormControlLabel control={<Checkbox checked={active} onChange={e => setActive(e.target.checked)} />} label="Исправная пресс-форма" style={{ marginTop: 5 }} />

            {/* Продукты */}
            <div style={{ marginTop: 10 }}>
                <h4>Продукты, которые можно производить</h4>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {Array.isArray(products) && products.map(p => (
                        <FormControlLabel
                            key={p.id}
                            control={<Checkbox
                                checked={selectedProducts.includes(p.id ?? "")}
                                onChange={() => setSelectedProducts(prev => prev.includes(p.id ?? "") ? prev.filter(x => x !== p.id) : [...prev, p.id ?? ""])}
                            />}
                            label={p.name}
                        />
                    ))}
                </div>
            </div>

            {/* Полуфабрикаты */}
            <div style={{ marginTop: 10 }}>
                <h4>Полуфабрикаты, которые можно производить</h4>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {Array.isArray(semiproducts) && semiproducts.map(s => (
                        <FormControlLabel
                            key={s.id}
                            control={<Checkbox
                                checked={selectedSemiproducts.includes(s.id ?? "")}
                                onChange={() => setSelectedSemiproducts(prev => prev.includes(s.id ?? "") ? prev.filter(x => x !== s.id) : [...prev, s.id ?? ""])}
                            />}
                            label={s.name}
                        />
                    ))}
                </div>
            </div>

            <Button variant="contained" onClick={savePressform} style={{ marginLeft: 10, marginTop: 10 }}>
                {idEditing ? "Сохранить изменения" : "Добавить пресс-форму"}
            </Button>

            {/* Список пресс-форм */}
            <div style={{ marginTop: 20 }}>
                {Array.isArray(pressform) && pressform.map((s) => (
                    <div key={s.id} style={{ padding: 8, marginBottom: 5, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc" }}>
                        <div>
                            <b>{s.name}</b> — {s.description}<br />
                            Вес: {s.weight} кг, Частей: {s.parts}<br />
                            Габариты: {s.length}×{s.width}×{s.height} мм<br />
                            Производитель: {s.manufacturer}<br />
                            Время монтажа: {s.installationTime}<br />
                            Время демонтажа: {s.deinstallationTime}<br /> 
                            Статус: {s.active ? "Исправная" : "Заблокирована"}<br />

                            {Array.isArray(s.products) && s.products.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                    <b>Продукты:</b>
                                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                                        {s.products.map(p => <li key={p.id}>{p.name ?? p.id}</li>)}
                                    </ul>
                                </div>
                            )}

                            {Array.isArray(s.semiproducts) && s.semiproducts.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                    <b>Полуфабрикаты:</b>
                                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                                        {s.semiproducts.map(sp => <li key={sp.id}>{sp.name ?? sp.id}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div>
                            <Button variant="outlined" size="small" onClick={() => editPressform(s)} style={{ marginRight: 5 }}>Редактировать</Button>
                            <Button variant="outlined" color="error" size="small" onClick={() => deletePressform(s.id)}>Удалить</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};