"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SalaryData } from "@/lib/types";

interface Props {
  currentSalary: number | null;
  salaryData: SalaryData;
}

function formatYen(value: number) {
  return `${(value / 10000).toFixed(0)}万`;
}

export function SalaryComparisonChart({ currentSalary, salaryData }: Props) {
  const data = [
    { name: "全国平均", value: salaryData.nationalAvg, color: "#94a3b8" },
    { name: "同条件\n中央値", value: salaryData.medianSalary, color: "#3b82f6" },
    ...(currentSalary != null
      ? [{ name: "あなた", value: currentSalary, color: "#10b981" }]
      : []),
  ];

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYen}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={42}
          />
          <Tooltip
            formatter={(v) => [`${formatYen(Number(v))}`, ""]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
