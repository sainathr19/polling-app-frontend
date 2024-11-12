import { Poll } from '@/types/poll';
import { BarChart, Bar, XAxis, YAxis, LabelList, Tooltip } from 'recharts';

type Props = {
  PollData: Poll;
}

const PollResultGraph = ({ PollData }: Props) => {
  const totalVotes = PollData.options.reduce((sum, entry) => sum + entry.votes, 0);
  const chartData = PollData.options.map(option => ({
    ...option,
    percentage: totalVotes ? (option.votes / totalVotes) * 100 : 0
  }));
  const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    return (
      <g>
        <text
          x={x + width + 5}
          y={y + height / 2}
          fill="#666"
          dominantBaseline="middle"
          fontSize={14}
        >
          {`${value.toFixed(1)}%`}
        </text>
      </g>
    );
  };

  return (
    <BarChart
      width={700}
      height={300}
      data={chartData}
      layout="vertical"
      margin={{
        top: 20,
        right: 120,
        left: 20,
        bottom: 20,
      }}
    >
      <XAxis
        type="number"
        domain={[0, 100]}
        tickFormatter={(value) => `${value}%`}
        ticks={[0, 25, 50, 75, 100]}
      />
      <YAxis
        type="category"
        dataKey="optionText"
        width={150}
        tick={{ fill: '#666' }}
        axisLine={{ stroke: '#666' }}
      />
      <Tooltip
        formatter={(value: number, name: string, props: any) => {
          return [props.payload.votes, 'Votes'];
        }}
        cursor={{ fill: '#f3f4f6' }}
      />
      <Bar
        dataKey="percentage"
        fill="#8884d8"
        radius={[0, 4, 4, 0]}
        barSize={30}
        animationDuration={1000}
      >
        <LabelList
          content={CustomLabel}
          position="right"
        />
      </Bar>
    </BarChart>
  );
};

export default PollResultGraph;