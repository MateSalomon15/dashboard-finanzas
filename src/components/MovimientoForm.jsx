import { useMemo, useState } from "react";
import { CATEGORIAS } from "../data/categorias";

export default function MovimientoForm({ agregarMovimiento, dark }) {
  const [tipo, setTipo] = useState("ingreso");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [touched, setTouched] = useState({ monto: false, fecha: false, categoria: false });

  // yyyy-mm-dd de HOY (para max en el input date)
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Normaliza string -> number con 2 decimales (acepta coma o punto)
  const parseMonto = (raw) => {
    const cleaned = String(raw)
      .trim()
      .replace(/[^\d.,]/g, "")   // deja números, coma y punto
      .replace(",", ".");        // coma -> punto
    if (cleaned === "") return NaN;
    const num = Number(cleaned);
    if (!Number.isFinite(num)) return NaN;
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const montoNum = useMemo(() => parseMonto(monto), [monto]);

  const errors = useMemo(() => {
    const e = {};

    if (!categoria) e.categoria = "Elegí una categoría.";

    if (!monto) e.monto = "Ingresá un monto.";
    else if (!Number.isFinite(montoNum)) e.monto = "Monto inválido.";
    else if (montoNum <= 0) e.monto = "El monto debe ser mayor a 0.";

    if (!fecha) e.fecha = "Elegí una fecha.";
    else if (fecha > todayISO) e.fecha = "No podés ingresar una fecha futura.";

    return e;
  }, [categoria, monto, montoNum, fecha, todayISO]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    // marcar todo como tocado para mostrar errores si intentó enviar
    setTouched({ monto: true, fecha: true, categoria: true });

    if (!isValid) return;

    agregarMovimiento({
      id: Date.now(),
      tipo,
      categoria,
      monto: montoNum,
      fecha,
    });

    setCategoria("");
    setMonto("");
    setFecha("");
    setTouched({ monto: false, fecha: false, categoria: false });
  };

  const inputClass = dark
    ? "bg-gray-800 border border-gray-700 text-white p-2 rounded-lg"
    : "bg-white border border-gray-300 p-2 rounded-lg";

  const errorText = dark ? "text-red-300" : "text-red-600";

  const inputErrorClass = (hasErr) =>
    hasErr
      ? dark
        ? "border-red-500 focus:border-red-400"
        : "border-red-500 focus:border-red-500"
      : "";

  return (
    <form
      onSubmit={handleSubmit}
      className={
        dark
          ? "bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow mb-8"
          : "bg-white border border-gray-200 p-6 rounded-2xl shadow mb-8"
      }
    >
      <h2 className="text-xl font-semibold mb-4">Agregar Movimiento</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setCategoria(""); // reset categoría si cambia tipo
          }}
          className={inputClass}
        >
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>

        <div className="flex flex-col gap-1">
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, categoria: true }))}
            className={`${inputClass} ${inputErrorClass(touched.categoria && errors.categoria)}`}
          >
            <option value="">Seleccionar categoría</option>
            {CATEGORIAS[tipo].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {touched.categoria && errors.categoria && (
            <span className={`text-xs ${errorText}`}>{errors.categoria}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="text"
            inputMode="decimal"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, monto: true }))}
            className={`${inputClass} ${inputErrorClass(touched.monto && errors.monto)}`}
          />
          {touched.monto && errors.monto && (
            <span className={`text-xs ${errorText}`}>{errors.monto}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="date"
            value={fecha}
            max={todayISO}
            onChange={(e) => setFecha(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, fecha: true }))}
            className={`${inputClass} ${inputErrorClass(touched.fecha && errors.fecha)}`}
          />
          {touched.fecha && errors.fecha && (
            <span className={`text-xs ${errorText}`}>{errors.fecha}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`mt-4 px-4 py-2 rounded-xl transition text-white ${
          isValid
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-600/40 cursor-not-allowed"
        }`}
      >
        Agregar
      </button>
    </form>
  );
}