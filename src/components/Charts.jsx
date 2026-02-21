import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { formatMoney } from "../utils/format";

function groupGastosPorCategoria(movimientos) {
  const gastos = movimientos.filter((m) => m.tipo === "gasto");
  const map = new Map();
  for (const g of gastos) {
    map.set(g.categoria, (map.get(g.categoria) || 0) + g.monto);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function groupPorMes(movimientos) {
  // yyyy-mm -> { ingresos, gastos }
  const map = new Map();

  for (const m of movimientos) {
    const key = (m.fecha || "").slice(0, 7); // "2026-02"
    if (!key) continue;

    if (!map.has(key)) map.set(key, { mes: key, ingresos: 0, gastos: 0 });

    const item = map.get(key);
    if (m.tipo === "ingreso") item.ingresos += m.monto;
    if (m.tipo === "gasto") item.gastos += m.monto;
  }

  // ordenar por mes asc
  return Array.from(map.values()).sort((a, b) => a.mes.localeCompare(b.mes));
}

const CATEGORY_COLORS = {
  Alquiler: "#306fd6",
  Cuotas: "#b54efa",
  Expensas: "#f59e0b",
  Facturas: "#ef4444",
  Rodados: "#10b981",
  Salud: "#ff4ba5",
  Seguros: "#639cf1",
  Suscripción: "#fff570",
  Varios: "#94a3b8",
  Haberes: "#22c55e",
  Honorarios: "#0ea5e9",
  "Operaciones Inmobiliarias": "#a855f7",
  Préstamos: "#f97316",
};

function CustomBarTooltip({ active, payload, label, dark }) {
  if (!active || !payload || payload.length === 0) return null;

  const row = payload[0]?.payload;
  const ingresos = row?.ingresos || 0;
  const gastos = row?.gastos || 0;
  const ahorro = ingresos - gastos;
  const pct = ingresos ? Math.round((ahorro / ingresos) * 100) : 0;

  return (
    <div
      style={{
        backgroundColor: dark ? "#0f172a" : "#ffffff",
        border: dark ? "1px solid #334155" : "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "12px",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>

      <div
        style={{
          fontSize: 13,
          marginBottom: 8,
          color: dark ? "#cbd5e1" : "#475569",
        }}
      >
        Ahorro: <b>{formatMoney(ahorro)}</b> ({pct}%)
      </div>

      {payload.map((p) => (
        <div
          key={p.dataKey}
          style={{ fontSize: 13, marginTop: 4, color: p.color }}
        >
          {p.dataKey === "ingresos" ? "Ingresos" : "Gastos"}:{" "}
          <b>{formatMoney(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

export default function Charts({ movimientos, dark }) {
  const dataGastosCat = groupGastosPorCategoria(movimientos);
  const totalGastosCat = dataGastosCat.reduce((acc, e) => acc + e.value, 0);
  const dataGastosCatSorted = [...dataGastosCat].sort((a, b) => b.value - a.value);

  const dataMes = groupPorMes(movimientos);

  // totales (podés reutilizarlos también abajo)
  const totalIngresos = dataMes.reduce((acc, x) => acc + x.ingresos, 0);
  const totalGastos = dataMes.reduce((acc, x) => acc + x.gastos, 0);
  const totalAhorro = totalIngresos - totalGastos;
  const ahorroPct = totalIngresos ? Math.round((totalAhorro / totalIngresos) * 100) : 0;

  const panelClass = dark
    ? "bg-gray-900 border border-gray-800"
    : "bg-white border border-gray-200";

  const textMuted = dark ? "text-gray-300" : "text-gray-600";

  if (movimientos.length === 0) {
    return (
      <div className={`${panelClass} p-6 rounded-2xl shadow`}>
        <p className={textMuted}>Agregá movimientos para ver gráficos 📈</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ------------------ PIE: gastos por categoría ------------------ */}
      <div className={`${panelClass} p-6 rounded-2xl shadow`}>
        <h2 className="text-xl font-semibold mb-4">Gastos por categoría</h2>

        {dataGastosCat.length === 0 ? (
          <p className={textMuted}>No hay gastos aún.</p>
        ) : (
          <>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataGastosCatSorted}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {dataGastosCatSorted.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CATEGORY_COLORS[entry.name] || "#64748b"}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name) => {
                      const pct = totalGastosCat
                        ? Math.round((value / totalGastosCat) * 100)
                        : 0;
                      return [`${formatMoney(value)} (${pct}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {dataGastosCatSorted.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[entry.name] || "#64748b",
                      }}
                    />
                    <span className={dark ? "text-gray-200" : "text-gray-800"}>
                      {entry.name}
                    </span>
                  </div>

                  <span className={dark ? "text-gray-200" : "text-gray-800"}>
                    {formatMoney(entry.value)}{" "}
                    <span className={dark ? "text-gray-400" : "text-gray-500"}>
                      (
                      {totalGastosCat
                        ? Math.round((entry.value / totalGastosCat) * 100)
                        : 0}
                      %)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ------------------ BAR: ingresos vs gastos ------------------ */}
      <div className={`${panelClass} p-6 rounded-2xl shadow`}>
        <h2 className="text-xl font-semibold mb-4">Ingresos vs Gastos por mes</h2>

        {dataMes.length === 0 ? (
          <p className={textMuted}>No hay datos por mes aún.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.06)" }}
                  content={<CustomBarTooltip dark={dark} />}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="#22c55e" />
                <Bar dataKey="gastos" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Resumen debajo del gráfico */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div
            className={
              dark
                ? "bg-gray-800 border border-gray-700 rounded-xl p-3"
                : "bg-gray-50 border border-gray-200 rounded-xl p-3"
            }
          >
            <p className={dark ? "text-gray-300" : "text-gray-600"}>Ingresos</p>
            <p className="font-semibold text-green-400">{formatMoney(totalIngresos)}</p>
          </div>

          <div
            className={
              dark
                ? "bg-gray-800 border border-gray-700 rounded-xl p-3"
                : "bg-gray-50 border border-gray-200 rounded-xl p-3"
            }
          >
            <p className={dark ? "text-gray-300" : "text-gray-600"}>Gastos</p>
            <p className="font-semibold text-red-400">{formatMoney(totalGastos)}</p>
          </div>

          <div
            className={
              dark
                ? "bg-gray-800 border border-gray-700 rounded-xl p-3 col-span-2"
                : "bg-gray-50 border border-gray-200 rounded-xl p-3 col-span-2"
            }
          >
            <p className={dark ? "text-gray-300" : "text-gray-600"}>Ahorro</p>
            <p className="font-semibold">
              {formatMoney(totalAhorro)}{" "}
              <span className={dark ? "text-gray-400" : "text-gray-500"}>
                ({ahorroPct}%)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}