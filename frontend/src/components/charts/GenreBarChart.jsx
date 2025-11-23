import React from 'react';
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer} from 'recharts';
export default function GenreBarChart({data=[]}) 
{
  const sorted =[...data].sort((a, b)=>b.value-a.value);
  return (
    <div style={{width:'100%',height:300}}>
      <ResponsiveContainer>
        <BarChart data={sorted}>
          <XAxis dataKey="genre" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
