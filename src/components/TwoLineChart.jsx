import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, differenceInDays, differenceInHours } from 'date-fns';  // Utilize date-fns for formatting dates

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
    Time: {
        label: "Time",
        color: "hsl(var(--chart-3))",
    },
    frequency: {
        label: "Frequency",
        color: "hsl(var(--chart-1))",
    },
    temperature: {
        label: "Temperature",
        color: "hsl(var(--chart-2))",
    },
};

const TwoLineChart = ({ device, filename }) => {
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            let request_url = "";
            if (device === "gateway") {
                request_url = `/downloadhandler~/data/${filename}`;
            } else {
                request_url = `/downloadhandler~/node/${device}/data/${filename}`;
            }
            const response = await fetch(request_url);
            const text = await response.text();
            const parsedData = parseData(text);
            setData(parsedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [device, filename]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const parseData = (data) => {
        return data.split('\n')
            .filter(line => line.length > 0 && !line.startsWith('Time'))
            .map(line => {
                const [time, frequency, temperature] = line.split(',');
                return {
                    time: new Date(time.trim()),  // Convert time to Date object immediately
                    frequency: parseFloat(frequency.trim()),
                    temperature: parseFloat(temperature.trim())
                };
            });
    };

    // Compute dynamic domain for the Y-axes
    const calculateDomain = (dataKey) => {
        const values = data.map(d => d[dataKey]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * 0.3; // Adding 5% padding
        return [min - padding, max + padding];
    };

    const dynamicTickFormatter = (data) => {
        if (!data.length) return value => value;  // Early exit if data is empty

        const datePoints = data.map(d => d.time);
        const minDate = new Date(Math.min(...datePoints));
        const maxDate = new Date(Math.max(...datePoints));
        const dayDiff = differenceInDays(maxDate, minDate);

        if (dayDiff > 30) {
            return (date) => format(date, 'MMM yyyy');  // Months
        } else if (dayDiff > 2) {
            return (date) => format(date, 'MMM dd');  // Days
        } else if (dayDiff <= 2) {
            const hourDiff = differenceInHours(maxDate, minDate);
            if (hourDiff <= 24) {
                return (date) => format(date, 'HH:mm');  // Hours
            }
            return (date) => format(date, 'HH:mm dd');  // Hours and days
        }
    };

    const timeTickFormatter = dynamicTickFormatter(data);

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart data={data}>
                <ChartLegend content={<ChartLegendContent />} />
                <XAxis 
                    dataKey="time" 
                    tickFormatter={timeTickFormatter} 
                />
                <YAxis 
                    yAxisId="leftAxis"
                    domain={calculateDomain('frequency')}
                    tickFormatter={(value) => value.toFixed(1)}  // Formats the tick value to one decimal place
                />

                <YAxis 
                    yAxisId="rightAxis"
                    orientation="right"
                    domain={calculateDomain('temperature')}
                    tickFormatter={(value) => value.toFixed(1)}  // Formats the tick value to one decimal place
                />
                <CartesianGrid stroke="#f5f5f5" />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                />
                <Line
                    dataKey="frequency"
                    type="monotone"
                    stroke="var(--color-frequency)"
                    strokeWidth={2}
                    yAxisId="leftAxis"
                    dot={false}
                />
                <Line
                    dataKey="temperature"
                    type="monotone"
                    stroke="var(--color-temperature)"
                    strokeWidth={2}
                    yAxisId="rightAxis"
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
    );
};

export default TwoLineChart;
