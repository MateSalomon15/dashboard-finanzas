import { formatMoney } from "../utils/format";

export default function MovimientoList({ movimientos, eliminarMovimiento, dark }) {
  if (movimientos.length === 0) {
    return (
      <div
        className={
          dark
            ? "bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow"
            : "bg-white border border-gray-200 p-6 rounded-2xl shadow"
        }
      >
        <p className={dark ? "text-gray-300" : "text-gray-600"}>
          No hay movimientos cargados todavía.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        dark
          ? "bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow"
          : "bg-white border border-gray-200 p-6 rounded-2xl shadow"
      }
    >
      <h2 className="text-xl font-semibold mb-4">Movimientos</h2>

      <div className="space-y-3">
        {movimientos.map((m) => (
          <div
            key={m.id}
            className={
              dark
                ? "flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl p-4"
                : "flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4"
            }
          >
            <div>
              <p className="font-medium">
                {m.categoria}{" "}
                <span
                  className={
                    m.tipo === "ingreso"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  ({m.tipo})
                </span>
              </p>
              <p className={dark ? "text-sm text-gray-300" : "text-sm text-gray-600"}>
                {m.fecha}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-bold">
  {m.tipo === "gasto" ? "-" : "+"}
  {formatMoney(m.monto)}
</p>

              <button
                onClick={() => {
                  const ok = window.confirm("¿Eliminar este movimiento?");
                  if (ok) eliminarMovimiento(m.id);
                }}
                className="px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
