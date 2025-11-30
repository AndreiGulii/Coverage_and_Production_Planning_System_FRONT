import React, { useState, useEffect } from "react";
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import ShiftAPI from "../api/ShiftAPI";
import type { Shift } from "../api/ShiftAPI";

interface ShiftFormProps {
  onChanged: () => void;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({ onChanged }) => {
  const [start, setStart] = useState<string>("06:00");
  const [end, setEnd] = useState<string>("14:00");
  const [color, setColor] = useState<string>("#e0ffe0");
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
  (async () => {
    await load();
  })();
}, []);

  const load = async () => {
    const res = await ShiftAPI.getAll();
    setShifts(res.data);
  };

  const saveShift = async () => {
    await ShiftAPI.create({ startTime: start, endTime: end, color, isWorking } as Shift);
    load();
    onChanged();
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Управление сменами</h3>

      <TextField label="Начало" value={start} onChange={e => setStart(e.target.value)} />
      <TextField label="Конец" value={end} onChange={e => setEnd(e.target.value)} style={{ marginLeft: 10 }} />
      <TextField label="Цвет" type="color" value={color} onChange={e => setColor(e.target.value)} style={{ marginLeft: 10 }} />

      <FormControlLabel
        control={<Checkbox checked={isWorking} onChange={e => setIsWorking(e.target.checked)} />}
        label="Рабочая смена"
        style={{ marginLeft: 10 }}
      />

      <Button variant="contained" onClick={saveShift} style={{ marginLeft: 10 }}>
        Добавить смену
      </Button>

      <div style={{ marginTop: 20 }}>
        {shifts.map(s => (
          <div key={s.id} style={{ padding: 8, background: s.color, marginBottom: 5 }}>
            {s.startTime}–{s.endTime} ({s.isWorking ? "рабочая" : "выходная"})
          </div>
        ))}
      </div>
    </div>
  );
};