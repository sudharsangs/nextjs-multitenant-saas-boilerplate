"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface SalesDataPoint {
  month: string;
  value: number;
}

interface SalesChartProps {
  data: SalesDataPoint[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="text-muted-foreground/30" />
          <XAxis dataKey="month" stroke="#888888" />
          <YAxis stroke="#888888" tickFormatter={(value) => `₹${value/1000}k`} />
          <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, "Revenue"]} />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}