import React, { useState } from 'react';
import type { MeasurementUnit } from '../types/MeasurementUnit';
import { measurementUnits } from '../types/MeasurementUnit';
import type { Bom } from '../types/Bom';

const initialBom: Bom = {
  productId: '',
  productType: 'product',
  productMe: 0,
  productMeh: 'KG',
  materialId: '',
  materialType: 'material',
  materialMe: 0,
  materialMeh: 'KG',
  version: '',
};

export const BomForm = () => {
  const [bom, setBom] = useState<Bom>(initialBom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting BOM:', bom);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить BOM</h2>

      <div>
        <label>Product Unit:</label>
        <select
          value={bom.productMeh}
          onChange={(e) =>
            setBom({ ...bom, productMeh: e.target.value as MeasurementUnit })
          }
        >
          {measurementUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Material Unit:</label>
        <select
          value={bom.materialMeh}
          onChange={(e) =>
            setBom({ ...bom, materialMeh: e.target.value as MeasurementUnit })
          }
        >
          {measurementUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};