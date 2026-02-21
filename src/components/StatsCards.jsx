export default function StatsCards({ dark, balance, ingresos, gastos }) {
  const cardClass = dark
    ? "bg-gray-900 border border-gray-800"
    : "bg-white border border-gray-200";

  const labelClass = dark ? "text-gray-400" : "text-gray-500";
  const valueClass = dark ? "text-white" : "text-gray-900";
  const formatMoney = (n) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className={`${cardClass} p-6 rounded-2xl shadow`}>
        <p className={`text-sm ${labelClass}`}>Balance Total</p>
        <h2 className={`text-2xl font-bold mt-2 ${valueClass}`}>{formatMoney(balance)}</h2>
        
      </div>

      <div className={`${cardClass} p-6 rounded-2xl shadow`}>
        <p className={`text-sm ${labelClass}`}>Ingresos</p>
        <h2 className={`text-2xl font-bold mt-2 ${valueClass}`}>{formatMoney(ingresos)}</h2>

      </div>

      <div className={`${cardClass} p-6 rounded-2xl shadow`}>
        <p className={`text-sm ${labelClass}`}>Gastos</p>
        <h2 className={`text-2xl font-bold mt-2 ${valueClass}`}>{formatMoney(gastos)}</h2>
      </div>
    </div>
  );
}
