import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SimpleLineChart = ({data, x, y}) => {

    console.log(data);

    return (
       <ResponsiveContainer width="100%" height="100%">
            <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 0,
                right: 20,
                left: -40,
                bottom: 0,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                {/* <XAxis dataKey={x} /> */}
                <XAxis 
                dataKey={x} 
                tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
                />

                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
                <Line type="monotone" dataKey={y} stroke="#8884d8" dot={false} activeDot={{ r: 8 }} />
            </LineChart>
       </ResponsiveContainer>
    );

}

export default SimpleLineChart
