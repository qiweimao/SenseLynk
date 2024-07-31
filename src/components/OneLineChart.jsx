import React, { useState, useEffect, useCallback} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';  // Import format from date-fns or similar library

const OneLineChart = ({ device, filename }) => {
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            let request_url="";
            if(device === "gateway"){
              request_url = `/downloadhandler~/data/${filename}`
            }
            else{
              request_url = `/downloadhandler~/node/${device}/data/${filename}`
            }
            const response = await fetch(request_url);
            const text = await response.text();
            const parsedData = parseData(text);
            setData(parsedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const parseData = (data) => {
        return data.split('\n')
            .filter(line => line.length > 0 && !line.startsWith('Time'))
            .map(line => {
                const [time, frequency, temperature] = line.split(',');
                return {
                    time: new Date(time.trim()).getTime(),  // Store time as UNIX timestamp for better handling
                    frequency: parseFloat(frequency.trim()),
                    temperature: parseFloat(temperature.trim())
                };
            });
    };

    const tickFormatter = (tick) => {
        return format(new Date(tick), 'MMM dd');  // Formatting date, adjust the format string as needed
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                    dataKey="time" 
                    tickFormatter={tickFormatter} 
                    minTickGap={20}  // Minimum gap between ticks
                    style={{ fontSize: '12px', fontFamily: 'Arial' }}
                />
                <YAxis yAxisId="leftAxis" />
                <YAxis yAxisId="rightAxis" orientation="right" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="frequency" stroke="#ff7300" yAxisId="leftAxis" dot={false} />
                <Line type="monotone" dataKey="temperature" stroke="#387908" yAxisId="rightAxis" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default OneLineChart;
