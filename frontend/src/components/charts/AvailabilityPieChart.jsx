import React from 'react';
import {PieChart,Pie,Cell,Tooltip,Legend,ResponsiveContainer} from 'recharts';
const COLORS=['#16a34a', '#ef4444']; // green, red
export default function AvailabilityPieChart({inStockCount=0,outStockCount=0}) 
{
  const data=[
    { name: 'In Stock', value: inStockCount },
    { name: 'Out of Stock', value: outStockCount },
  ];
  const total=inStockCount+outStockCount;
  if(total===0) 
  {
    return <div className="text-sm text-gray-500">No data available</div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
