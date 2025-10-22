import { VictoryPie, VictoryTheme } from 'victory';

interface PieChartProps {
  data: Array<{ x: string; y: number }>;
  title: string;
}

export const PieChart = ({ data, title }: PieChartProps) => {
  return (
    <div className="h-64">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <VictoryPie
        data={data}
        theme={VictoryTheme.material}
        height={200}
        colorScale={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
        style={{
          labels: { fontSize: 12, fill: '#374151' },
        }}
        labelRadius={({ innerRadius }) => innerRadius + 20}
        innerRadius={50}
      />
    </div>
  );
};
