// File: frontend/src/modules/checkout/components/form-sections/UbigeoSelector.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { locations } from '@/src/data/locations';
import { CheckoutFormData } from '../../schemas/checkout.schema';
import { SelectV2 } from '@/components/ui/SelectV2';

export default function UbigeoSelector() {
  const { register, control, setValue, formState: { errors } } = useFormContext<CheckoutFormData>();

  // Observamos los cambios en el formulario
  const selectedDepartamento = useWatch({ control, name: 'shippingAddress.departamento' });
  const selectedProvincia = useWatch({ control, name: 'shippingAddress.provincia' });

  // Listas derivadas
  const [provincias, setProvincias] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<string[]>([]);

  // Cuando cambia el Departamento
  useEffect(() => {
    if (selectedDepartamento && locations[selectedDepartamento]) {
      const provs = Object.keys(locations[selectedDepartamento]);
      setProvincias(provs);

      // Si la provincia guardada no pertenece al nuevo departamento, la reseteamos
      if (!locations[selectedDepartamento][selectedProvincia || '']) {
        setValue('shippingAddress.provincia', '');
        setValue('shippingAddress.distrito', '');
        setDistritos([]);
      }
    } else {
      setProvincias([]);
      setDistritos([]);
    }
  }, [selectedDepartamento, selectedProvincia, setValue]);

  // Cuando cambia la Provincia
  useEffect(() => {
    if (selectedDepartamento && selectedProvincia && locations[selectedDepartamento]?.[selectedProvincia]) {
      const dists = locations[selectedDepartamento][selectedProvincia];
      setDistritos(dists);
    } else {
      setDistritos([]);
    }
  }, [selectedDepartamento, selectedProvincia]);

  const departamentos = Object.keys(locations);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      {/* Selector Departamento */}
      <div>
        <SelectV2
          label="Departamento"
          {...register('shippingAddress.departamento')}
          aria-invalid={!!errors.shippingAddress?.departamento}
        >
          <option value="">Seleccionar</option>
          {departamentos.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </SelectV2>
        {errors.shippingAddress?.departamento && (
          <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.shippingAddress.departamento.message}</p>
        )}
      </div>

      {/* Selector Provincia */}
      <div>
        <SelectV2
          label="Provincia"
          {...register('shippingAddress.provincia')}
          disabled={!selectedDepartamento || provincias.length === 0}
          aria-invalid={!!errors.shippingAddress?.provincia}
        >
          <option value="">Seleccionar</option>
          {provincias.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </SelectV2>
        {errors.shippingAddress?.provincia && (
          <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.shippingAddress.provincia.message}</p>
        )}
      </div>

      {/* Selector Distrito */}
      <div>
        <SelectV2
          label="Distrito"
          {...register('shippingAddress.distrito')}
          disabled={!selectedProvincia || distritos.length === 0}
          aria-invalid={!!errors.shippingAddress?.distrito}
        >
          <option value="">Seleccionar</option>
          {distritos.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </SelectV2>
        {errors.shippingAddress?.distrito && (
          <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.shippingAddress.distrito.message}</p>
        )}
      </div>
    </div>
  );
}