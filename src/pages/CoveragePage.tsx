import { useEffect, useState } from "react";
import { getCoverage } from "../api/coverageApi";
import type { CoverageDto } from "../api/coverageApi";

export default function CoveragePage() {
  const [coverage, setCoverage] = useState<CoverageDto[]>([]);

  useEffect(() => {
    loadCoverage();
  }, []);

  const loadCoverage = async () => {
    const data = await getCoverage();
    setCoverage(data);
  };

  // Все уникальные даты для заголовка таблицы, отсортированы
  const allDates = Array.from(
    new Set(coverage.flatMap((c) => c.days.map((d) => d.date)))
  ).sort();

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Покрытие запасов</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 border-collapse text-center text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Product Id</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Covered Days</th>
              {allDates.map((date) => (
                <th key={date} className="border p-2">
                  {new Date(date).toLocaleDateString()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {coverage.map((c) => {
              const initialStock = c.stock ?? 0;

              // Создадим карту demand по дате для быстрого доступа
              const demandByDate = new Map<string, number>();
              c.days.forEach((d) => demandByDate.set(d.date, d.demand ?? 0));

              // будем накапливать суммарный спрос
              let cumulativeDemand = 0;

              return (
                <tr key={c.productId}>
                  <td className="border p-2">{c.productId}</td>
                  <td className="border p-2">{c.productName}</td>
                  <td className="border p-2">{c.description}</td>
                  <td className="border p-2 font-semibold">{initialStock}</td>
                  <td className="border p-2 font-semibold">{c.coveredDays}</td>

                  {allDates.map((date) => {
                    const demand = demandByDate.get(date) ?? 0;
                    cumulativeDemand += demand;

                    // покрыт ли суммарный спрос до текущей даты включительно?
                    const isCovered = cumulativeDemand <= initialStock;

                    return (
                      <td
                        key={date}
                        className={`border p-2 font-medium ${
                          isCovered ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        }`}
                      >
                        {demand}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}