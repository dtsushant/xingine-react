import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartConfig,
  ChartMeta,
} from "xingine/dist/core/component/component-meta-map";


// Helper function to get chart dimensions based on renderer configuration
const getChartDimensions = (defaultWidth = 600, defaultHeight = 300) => {
  let width = defaultWidth;
  let height = defaultHeight;
  console.debug("rendering the charg with height width", height,width);

  return { width, height };
};

const renderChart = (chart: ChartConfig, index: number) => {
  const { type,height:h, width:w, title, labels = [], datasets = [] } = chart;
  
  // Merge global and chart-specific renderer configurations
  // Chart-specific configuration takes precedence

  const data =
    labels.map((label, i) => ({
      name: label,
      ...Object.fromEntries(
        datasets.map((ds) => [
          ds.label,
          Array.isArray(ds.data) ? ds.data[i] : 0,
        ]),
      ),
    })) || [];

  const scatterData = datasets[0]?.data as { x: number | string; y: number }[];
  
  // Apply renderer styles to container
  const containerStyles: React.CSSProperties = {
    marginBottom: 48,
  };
  
  // Get chart dimensions from renderer
  const { width, height } = getChartDimensions(w,h);
  
  // Apply interaction styles
  const interactionProps: React.HTMLAttributes<HTMLDivElement> = {};

  
  // Apply accessibility attributes
  const accessibilityProps: React.HTMLAttributes<HTMLDivElement> = {};

  

  return (
    <div 
      key={index} 
      style={interactionProps.style || containerStyles}
      {...interactionProps}
      {...accessibilityProps}
    >
      {title && <h3>{title}</h3>}
      {type === "bar" && (
        <BarChart width={width} height={height} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {datasets.map((ds) => (
            <Bar
              key={ds.label}
              dataKey={ds.label}
              fill={ds.backgroundColor || "#8884d8"}
            />
          ))}
        </BarChart>
      )}
      {type === "line" && (
        <LineChart width={width} height={height} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          {datasets.map((ds) => (
            <Line
              key={ds.label}
              dataKey={ds.label}
              stroke={ds.borderColor || "#8884d8"}
            />
          ))}
        </LineChart>
      )}
      {type === "pie" && (
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            dataKey={datasets[0].label}
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={Math.min(width, height) / 6}
            fill="#82ca9d"
            label
          />
          <Tooltip />
        </PieChart>
      )}
      {type === "scatter" && (
        <ScatterChart width={width} height={height}>
          <XAxis dataKey="x" />
          <YAxis dataKey="y" />
          <Tooltip />
          <Scatter name="Data" data={scatterData} fill="#8884d8" />
        </ScatterChart>
      )}
    </div>
  );
};

export const ChartRenderer: React.FC<ChartMeta> = (meta) => {
  const [charts, setCharts] = useState<ChartConfig[]>(meta.charts);

  useEffect(() => {
    const fetchLiveCharts = async () => {
      const liveCharts = await Promise.all(
        meta.charts.map(async (chart) => {
          if (!chart.dataSourceUrl) return chart;

          try {
            const { data } = await axios.get(chart.dataSourceUrl);
            return {
              ...chart,
              labels: data.labels ?? chart.labels,
              datasets: data.datasets ?? chart.datasets,
            };
          } catch (err) {
            console.error(`Failed to load chart: ${chart.title}`, err);
            return chart;
          }
        }),
      );

      setCharts(liveCharts);
    };

    fetchLiveCharts();
  }, [meta]);

  // Apply global renderer configuration to the container

  // Handle grid layout for multiple charts

  

  // Apply accessibility to container

  
  // Apply CSS classes to container

  return (
    <>
      {charts.map((chart, index) => renderChart(chart, index))}
    </>
  );
};
