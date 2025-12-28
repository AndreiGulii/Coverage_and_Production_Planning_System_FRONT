import { useEffect, useState } from "react";
import { getCoverage } from "../api/coverageApi";
import { getBoms } from "../api/bomApi";
import type { CoverageDto } from "../api/coverageApi";
import type { BomResponseDto } from "../api/bomApi";

export default function CoveragePage() {
  const [coverage, setCoverage] = useState<CoverageDto[]>([]);
  const [boms, setBoms] = useState<BomResponseDto[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCoverage();
    loadBoms();
  }, []);

  // ======================================================
  // РЕКУРСИВНО разворачиваем дерево coverage
  // ======================================================
  const flattenCoverage = (nodes: CoverageDto[]): CoverageDto[] => {
    const result: CoverageDto[] = [];

    const dfs = (node: CoverageDto) => {
      result.push(node);

      node.semiproductCoverage?.forEach(dfs);
      node.materialCoverage?.forEach(dfs);
    };

    nodes.forEach(dfs);
    return result;
  };

  const loadCoverage = async () => {
    const data = await getCoverage();
    setCoverage(flattenCoverage(data));
  };

  const loadBoms = async () => {
    const data = await getBoms();
    setBoms(data);
  };

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const allDates = Array.from(
    new Set(coverage.flatMap((c) => c.days.map((d) => d.date)))
  ).sort();

  // === корректные фильтры ===
  const products = coverage.filter((c) => c.productType === "product");
  const semiproducts = coverage.filter((c) => c.productType === "semiproduct");
  const materials = coverage.filter((c) => c.productType === "material");

  const renderRow = (c: CoverageDto) => {
  const rowKey = `${c.productType}:${c.productId}`;
  const initialStock = c.stock ?? 0;

  const demandByDate = new Map<string, number>();
  c.days.forEach((d) => demandByDate.set(d.date, d.demand ?? 0));

  const isExpanded = expanded[rowKey] ?? false;
  let cumulative = 0;

  const bomList = boms.filter(
    (b) => b.productId === c.productId
  );

  return (
    <tbody key={rowKey}>
      <tr className="bg-white">
        <td className="border p-2">
          <button
            className="px-2 py-1 bg-blue-600 text-white rounded mr-2"
            onClick={() => toggleExpand(rowKey)}
          >
            {isExpanded ? "−" : "+"}
          </button>
          {c.productId}
        </td>

          <td className="border p-2 font-semibold">{c.productName}</td>
          <td className="border p-2">{c.description}</td>
          <td className="border p-2">{initialStock}</td>
          <td className="border p-2">{c.coveredDays}</td>

          {allDates.map((date) => {
            const demand = demandByDate.get(date) ?? 0;
            cumulative += demand;

            return (
              <td
                key={date}
                className={`border p-2 font-medium ${
                  cumulative <= initialStock
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {demand}
              </td>
            );
          })}
        </tr>

        {isExpanded && (
          <tr className="bg-gray-50">
            <td colSpan={5 + allDates.length} className="border p-4 text-left">
              {bomList.length > 0 ? (
                <>
                  <h3 className="font-bold mb-2 text-lg">BOM</h3>
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="border p-2">Материал</th>
                        <th className="border p-2">Кол-во</th>
                        <th className="border p-2">Версия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bomList.map((b) => (
                        <tr key={b.id}>
                          <td className="border p-2">{b.materialName}</td>
                          <td className="border p-2">
                            {b.materialMe} {b.materialMeh}
                          </td>
                          <td className="border p-2">{b.version ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <span className="italic text-gray-500">Нет BOM</span>
              )}
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Покрытие запасов
      </h1>

      {/* === Продукты === */}
      <h2 className="text-xl font-semibold mb-4">Продукты</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full border text-center text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Days Covered</th>
              {allDates.map((date) => (
                <th key={date} className="border p-2">
                  {new Date(date).toLocaleDateString()}
                </th>
              ))}
            </tr>
          </thead>
          {products.map(renderRow)}
        </table>
      </div>

      {/* === Полупродукты === */}
      <h2 className="text-xl font-semibold mb-4">Полупродукты</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full border text-center text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Days Covered</th>
              {allDates.map((date) => (
                <th key={date} className="border p-2">
                  {new Date(date).toLocaleDateString()}
                </th>
              ))}
            </tr>
          </thead>
          {semiproducts.map(renderRow)}
        </table>
      </div>

      {/* === Материалы === */}
      <h2 className="text-xl font-semibold mb-4">Материалы</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-center text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Days Covered</th>
              {allDates.map((date) => (
                <th key={date} className="border p-2">
                  {new Date(date).toLocaleDateString()}
                </th>
              ))}
            </tr>
          </thead>
          {materials.map(renderRow)}
        </table>
      </div>
    </div>
  );
}