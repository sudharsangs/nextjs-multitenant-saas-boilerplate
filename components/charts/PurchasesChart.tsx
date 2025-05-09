"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface PurchasesDataPoint {
  month: string;
  value: number;
}

interface PurchasesChartProps {
  data: PurchasesDataPoint[];
}

export default function PurchasesChart({ data }: PurchasesChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="text-muted-foreground/30" />
          <XAxis dataKey="month" stroke="#888888" />
          <YAxis stroke="#888888" tickFormatter={(value) => `₹${value/1000}k`} />
          <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, "Amount"]} />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}