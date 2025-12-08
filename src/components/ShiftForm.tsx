import React, { useState, useEffect } from "react";
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import ShiftAPI from "../api/ShiftAPI";
import type { Shift } from "../api/ShiftAPI";

interface ShiftFormProps {
  onChanged: () => void;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({ onChanged }) => {
  const [idEditing, setIdEditing] = useState<number | null>(null);
  const [name, setName] = useState<string>("Смена 1");
  const [shiftStartTime, setShiftStartTime] = useState<string>("06:00");
  const [shiftEndTime, setShiftEndTime] = useState<string>("14:00");
  const [firstPauseStartTime, setFirstPauseStartTime] = useState<string>("10:00");
  const [firstPauseEndTime, setFirstPauseEndTime] = useState<string>("10:15");
  const [secondPauseStartTime, setSecondPauseStartTime] = useState<string>("12:00");
  const [secondPauseEndTime, setSecondPauseEndTime] = useState<string>("12:15");
  const [color, setColor] = useState<string>("#72ea72");
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    const res = await ShiftAPI.getAll();
    setShifts(res.data);
  };

  const formatTime = (t: string) => (t.length === 5 ? t + ":00" : t);

  const saveShift = async () => {
    try {
      const payload: Shift = {
        name,
        shiftStartTime: formatTime(shiftStartTime),
        shiftEndTime: formatTime(shiftEndTime),
        firstPauseStartTime: firstPauseStartTime ? formatTime(firstPauseStartTime) : undefined,
        firstPauseEndTime: firstPauseEndTime ? formatTime(firstPauseEndTime) : undefined,
        secondPauseStartTime: secondPauseStartTime ? formatTime(secondPauseStartTime) : undefined,
        secondPauseEndTime: secondPauseEndTime ? formatTime(secondPauseEndTime) : undefined,
        color,
        isWorking,
      };

      if (idEditing) {
        await ShiftAPI.update(idEditing, payload);
        setIdEditing(null);
      } else {
        await ShiftAPI.create(payload);
      }

      await loadShifts();
      clearForm();
      onChanged();
    } catch (error) {
      console.error("Ошибка при сохранении смены:", error);
      alert("Не удалось сохранить смену. Проверьте консоль для деталей.");
    }
  };

  const deleteShift = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Вы точно хотите удалить смену?")) return;
    await ShiftAPI.delete(id);
    await loadShifts();
    onChanged();
  };

  const editShift = (shift: Shift) => {
    setIdEditing(shift.id || null);
    setName(shift.name);
    setShiftStartTime(shift.shiftStartTime?.substring(0, 5) || "06:00");
    setShiftEndTime(shift.shiftEndTime?.substring(0, 5) || "14:00");
    setFirstPauseStartTime(shift.firstPauseStartTime?.substring(0, 5) || "");
    setFirstPauseEndTime(shift.firstPauseEndTime?.substring(0, 5) || "");
    setSecondPauseStartTime(shift.secondPauseStartTime?.substring(0, 5) || "");
    setSecondPauseEndTime(shift.secondPauseEndTime?.substring(0, 5) || "");
    setColor(shift.color || "#72ea72");
    setIsWorking(!!shift.isWorking);
  };

  const clearForm = () => {
    setIdEditing(null);
    setName("Смена 1");
    setShiftStartTime("06:00");
    setShiftEndTime("14:00");
    setFirstPauseStartTime("10:00");
    setFirstPauseEndTime("10:15");
    setSecondPauseStartTime("12:00");
    setSecondPauseEndTime("12:15");
    setColor("#72ea72");
    setIsWorking(false);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Управление сменами</h3>

      <TextField label="Название" value={name} onChange={e => setName(e.target.value)} />
      <TextField label="Начало смены" value={shiftStartTime} onChange={e => setShiftStartTime(e.target.value)} style={{ marginLeft: 10 }} />
      <TextField label="Конец смены" value={shiftEndTime} onChange={e => setShiftEndTime(e.target.value)} style={{ marginLeft: 10 }} />

      <TextField label="Первая пауза - начало" value={firstPauseStartTime} onChange={e => setFirstPauseStartTime(e.target.value)} style={{ marginLeft: 10 }} />
      <TextField label="Первая пауза - конец" value={firstPauseEndTime} onChange={e => setFirstPauseEndTime(e.target.value)} style={{ marginLeft: 10 }} />

      <TextField label="Вторая пауза - начало" value={secondPauseStartTime} onChange={e => setSecondPauseStartTime(e.target.value)} style={{ marginLeft: 10 }} />
      <TextField label="Вторая пауза - конец" value={secondPauseEndTime} onChange={e => setSecondPauseEndTime(e.target.value)} style={{ marginLeft: 10 }} />

      <TextField label="Цвет" type="color" value={color} onChange={e => setColor(e.target.value)} style={{ marginLeft: 10 }} />

      <FormControlLabel
        control={<Checkbox checked={isWorking} onChange={e => setIsWorking(e.target.checked)} />}
        label="Рабочая смена"
        style={{ marginLeft: 10 }}
      />

      <Button variant="contained" onClick={saveShift} style={{ marginLeft: 10, marginTop: 10 }}>
        {idEditing ? "Сохранить изменения" : "Добавить смену"}
      </Button>

      <div style={{ marginTop: 20 }}>
        {shifts.map(s => (
          <div key={s.id} style={{ padding: 8, background: s.color, marginBottom: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {s.name}: {s.shiftStartTime}–{s.shiftEndTime}
              {s.firstPauseStartTime && `, Первая пауза ${s.firstPauseStartTime}-${s.firstPauseEndTime}`}
              {s.secondPauseStartTime && `, Вторая пауза ${s.secondPauseStartTime}-${s.secondPauseEndTime}`}
              ({s.isWorking ? "рабочая" : "выходная"})
            </div>
            <div>
              <Button variant="outlined" size="small" onClick={() => editShift(s)} style={{ marginRight: 5 }}>
                Редактировать
              </Button>
              <Button variant="outlined" color="error" size="small" onClick={() => deleteShift(s.id)}>
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};