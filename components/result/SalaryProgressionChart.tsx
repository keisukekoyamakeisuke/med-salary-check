"use client";

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { ProgressionPoint } from "@/lib/salary-data";

interface Props {
  data: ProgressionPoint[];
  currentExperienceLabel: string;
}

function formatYen(v: number) {
  return `${v}万`;
}

export function SalaryProgressionChart({ data, currentExperienceLabel }: Props) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradMedian" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYen}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={46}
          />
          <Tooltip
            formatter={(v) => [`${Number(v).toFixed(0)}万円`, ""]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
            labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                median:   "同条件の中央値",
                national: "全国平均",
              };
              return labels[value] ?? value;
            }}
          />
          {/* p25〜p75 range band */}
          <Area
            type="monotone"
            dataKey="p75"
            stroke="none"
            fill="#dbeafe"
            fillOpacity={0.5}
            name="p75"
            legendType="none"
            tooltipType="none"
          />
          <Area
            type="monotone"
            dataKey="p25"
            stroke="none"
            fill="#ffffff"
            fillOpacity={1}
            name="p25"
            legendType="none"
            tooltipType="none"
          />
          <Area
            type="monotone"
            dataKey="median"
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="url(#gradMedian)"
            dot={(props) => {
              const isActive = props.payload?.label === currentExperienceLabel;
              return (
                <circle
                  key={props.key}
                  cx={props.cx}
                  cy={props.cy}
                  r={isActive ? 6 : 4}
                  fill={isActive ? "#2563eb" : "#93c5fd"}
                  stroke="white"
                  strokeWidth={2}
                />
              );
            }}
            name="median"
          />
          <Line
            type="monotone"
            dataKey="national"
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name="national"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 text-center mt-1">
        ※ 水色帯は25〜75パーセンタイルのレンジ、● はあなたの経験年数帯
      </p>
    </div>
  );
}
