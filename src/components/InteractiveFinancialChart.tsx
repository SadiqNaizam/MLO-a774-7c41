import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data structure - replace with actual data type
interface ChartDataPoint {
  date: string;
  value: number;
}

interface InteractiveFinancialChartProps {
  data: ChartDataPoint[];
  title?: string;
  description?: string;
  lineColor?: string; // e.g., "#8884d8"
}

const InteractiveFinancialChart: React.FC<InteractiveFinancialChartProps> = ({
  data,
  title = "Financial Overview",
  description,
  lineColor = "#0051B4", // Using Bold Blue from user journey
}) => {
  console.log("Rendering InteractiveFinancialChart with data points:", data.length);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available to display chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="date" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0.5rem', borderColor: '#ccc' }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
            />
            <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InteractiveFinancialChart;