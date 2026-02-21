import { useEffect, useState } from "react";
import StatsCards from "./components/StatsCards";
import MovimientoForm from "./components/MovimientoForm";
import MovimientoList from "./components/MovimientoList";
import Charts from "./components/Charts";

const demoMovimientos = [
  { id: 1, tipo: "ingreso", categoria: "Haberes", monto: 2600, fecha: "2026-02-02" },
  { id: 2, tipo: "gasto", categoria: "Alquiler", monto: 500, fecha: "2026-02-10" },
  { id: 3, tipo: "gasto", categoria: "Expensas", monto: 233, fecha: "2026-02-06" },
  { id: 4, tipo: "gasto", categoria: "Facturas", monto: 120, fecha: "2026-02-02" },
  { id: 5, tipo: "gasto", categoria: "Cuotas", monto: 200, fecha: "2026-02-12" },
  { id: 6, tipo: "gasto", categoria: "Salud", monto: 200, fecha: "2026-02-15" },
  { id: 7, tipo: "ingreso", categoria: "Honorarios", monto: 600, fecha: "2026-01-20" },
  { id: 8, tipo: "gasto", categoria: "Suscripción", monto: 130, fecha: "2026-01-05" },
];

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; 
  });

  const [movimientos, setMovimientos] = useState(() => {
    const saved = localStorage.getItem("movimientos");
    return saved ? JSON.parse(saved) : [];
  });

  const [mes, setMes] = useState("todos");

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
  }, [movimientos]);

  const agregarMovimiento = (mov) => {
  setMovimientos((prev) => [mov, ...prev]);
+ showToast("success", "Movimiento agregado");
};

  const eliminarMovimiento = (id) => {
    setMovimientos((prev) => prev.filter((m) => m.id !== id));
  };

  const limpiarMovimientos = () => {
  if (movimientos.length === 0) return;

  const ok = window.confirm("¿Eliminar TODOS los movimientos?");
  if (!ok) return;

  setMovimientos([]);
  setMes("todos");
  
};

  const cargarDemo = () => {
    // ids únicos
    const demoConIds = demoMovimientos.map((m) => ({
      ...m,
      id: Date.now() + Math.random(),
    }));

    setMovimientos(demoConIds);
    setMes("todos"); // para que se vean todos
  };

  // Meses disponibles
  const mesesDisponibles = Array.from(
    new Set(movimientos.map((m) => (m.fecha || "").slice(0, 7)).filter(Boolean))
  ).sort((a, b) => b.localeCompare(a)); // más nuevo primero

  // Filtro
  const movimientosFiltrados =
    mes === "todos"
      ? movimientos
      : movimientos.filter((m) => (m.fecha || "").slice(0, 7) === mes);

  // calculo de totales con filtrados
  const totalIngresos = movimientosFiltrados
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + m.monto, 0);

  const totalGastos = movimientosFiltrados
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + m.monto, 0);

  const balance = totalIngresos - totalGastos;

  const [toast, setToast] = useState(null);


const showToast = (type, message) => {
  setToast({ type, message });
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => setToast(null), 2500);
};  

  return (
    <div
      className={
        dark
          ? "min-h-screen bg-gray-950 text-gray-100 p-6 md:p-10"
          : "min-h-screen bg-gray-100 text-gray-900 p-6 md:p-10"
      }
    >
      <div className="max-w-6xl mx-auto">
        {toast && (
  <div className="fixed top-6 right-6 z-50">
    <div
      className={`px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium ${
        toast.type === "success"
          ? dark
            ? "bg-emerald-900/60 border-emerald-700 text-emerald-100"
            : "bg-emerald-50 border-emerald-200 text-emerald-900"
          : dark
          ? "bg-red-900/60 border-red-700 text-red-100"
          : "bg-red-50 border-red-200 text-red-900"
      }`}
    >
      {toast.message}
    </div>
  </div>
)}
        <div className="flex items-center justify-between mb-8">
          <h1
            className={
              dark
                ? "text-3xl md:text-4xl font-bold text-white"
                : "text-3xl md:text-4xl font-bold text-gray-900"
            }
          >
            Dashboard Financiero 
          </h1>

          <button
            onClick={() => setDark((v) => !v)}
            className={
              dark
                ? "px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 transition"
                : "px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-200 transition"
            }
          >
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* Selector de período */}
        <div className="flex items-center justify-between mb-4">
  <h2 className={dark ? "text-gray-200 font-semibold" : "text-gray-800 font-semibold"}>
    Período
  </h2>

  <div className="flex items-center gap-3">
    <select
      value={mes}
      onChange={(e) => setMes(e.target.value)}
      className={
        dark
          ? "bg-gray-900 border border-gray-700 text-gray-200 rounded-xl px-3 py-2"
          : "bg-white border border-gray-300 text-gray-800 rounded-xl px-3 py-2"
      }
    >
      <option value="todos">Todos</option>
      {mesesDisponibles.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>

    <button
      onClick={limpiarMovimientos}
      disabled={movimientos.length === 0}
      className={
        dark
          ? `px-4 py-2 rounded-xl border transition ${
              movimientos.length === 0
                ? "bg-gray-900/40 border-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-red-600/20 border-red-600 text-red-200 hover:bg-red-600/30"
            }`
          : `px-4 py-2 rounded-xl border transition ${
              movimientos.length === 0
                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
            }`
      }
      title={movimientos.length === 0 ? "No hay movimientos para limpiar" : "Eliminar todos los movimientos"}
    >
      Limpiar
    </button>
  </div>
</div>

        {movimientos.length === 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={cargarDemo}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Cargar datos de ejemplo
            </button>
          </div>
        )}

        <StatsCards
  dark={dark}
  balance={balance}
  ingresos={totalIngresos}
  gastos={totalGastos}
/>

        <MovimientoForm agregarMovimiento={agregarMovimiento} dark={dark} />

        <MovimientoList
          movimientos={movimientosFiltrados}
          eliminarMovimiento={eliminarMovimiento}
          dark={dark}
        />

        <div className="mt-8">
          <Charts movimientos={movimientosFiltrados} dark={dark} />
        </div>
      </div>
    </div>
  );
}