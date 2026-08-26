/**
 * Calcula el desglose de impuestos según tipo de documento.
 * 2026: IVA 19%, Retención Boleta 13.75%
 */
export const getTaxBreakdown = (totalBruto: number, esBoleta = false, esEfectivo = false) => {
  const retencionFactor = 0.1375;
  
  if (esEfectivo) {
    return {
      neto: Math.round(totalBruto),
      iva: 0,
      retencion: 0,
      total: Math.round(totalBruto),
      labelNeto: 'Valor Total',
      labelTax: 'Sin Impuestos (Efectivo)'
    };
  }

  if (esBoleta) {
    const retencion = Math.round(totalBruto * retencionFactor);
    return {
      neto: Math.round(totalBruto - retencion),
      iva: 0,
      retencion,
      total: Math.round(totalBruto),
      labelNeto: 'Líquido a Recibir',
      labelTax: 'Retención SII (13.75%)'
    };
  }

  const neto = Math.round(totalBruto / 1.19);
  const iva = Math.round(totalBruto - neto);
  
  return {
    neto,
    iva,
    retencion: 0,
    total: Math.round(totalBruto),
    labelNeto: 'Valor Neto',
    labelTax: 'IVA (19%)'
  };
};

export const calcularPrecioAutomatico = (costoNeto: number) => {
  let porcentajeMargen: number;

  if (costoNeto <= 10000) {
    porcentajeMargen = 0.30;
  } else if (costoNeto <= 50000) {
    porcentajeMargen = 0.20;
  } else if (costoNeto <= 150000) {
    porcentajeMargen = 0.15;
  } else {
    porcentajeMargen = 0.10;
  }

  const IVA = 1.19;
  const precioVentaNeto = costoNeto / (1 - porcentajeMargen);
  const precioFinalBruto = Math.ceil(precioVentaNeto * IVA);

  return {
    precioFinal: precioFinalBruto,
    margenAplicado: porcentajeMargen * 100,
    gananciaPesos: Math.floor(precioVentaNeto - costoNeto)
  };
};
