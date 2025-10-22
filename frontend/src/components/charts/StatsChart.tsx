import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme } from 'victory';

interface StatsChartProps {
  data: Array<{ x: string; y: number }>;
  title: string;
  color?: string;
}

export const StatsChart = ({ data, title, color = '#3b82f6' }: StatsChartProps) => {
  return (
    <div className="h-64">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <VictoryChart
        theme={VictoryTheme.material}
        height={200}
        padding={{ left: 50, right: 20, top: 20, bottom: 40 }}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: '#e5e7eb' },
            tickLabels: { fill: '#6b7280', fontSize: 12 },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: '#e5e7eb' },
            tickLabels: { fill: '#6b7280', fontSize: 12 },
          }}
        />
        <VictoryArea
          data={data}
          style={{
            data: { fill: color, fillOpacity: 0.3, stroke: color, strokeWidth: 2 },
          }}
        />
        <VictoryLine
          data={data}
          style={{
            data: { stroke: color, strokeWidth: 3 },
          }}
        />
      </VictoryChart>
    </div>
  );
};
