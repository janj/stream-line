import { AmpSheetRow } from '../Types'
import {
  CartesianGrid,
  Legend, Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import React from 'react'

export default function RevenueByDateGraph({ datas }: { datas: {[key: string]: AmpSheetRow[]}}) {
  const [chartData, setChartData] = React.useState<{ [kdy: string]: string }[]>()
  const [lines, setLines] = React.useState<{ [key: string]: string }>({})

  React.useEffect(() => {
    const byDate: {
      [name: string]: { [key: string]: number }
    } = {}

    Object.keys(datas).sort().forEach((label, i) => {
      const color = i % 2 ? '#8884d8' : '#82ca9d"'
      setLines((prev) => ({ ...prev, [label]: color}))
      datas[label].forEach((data) => {
        !byDate[data.PeriodTo] && (byDate[data.PeriodTo] = {})
        !byDate[data.PeriodTo][label] && (byDate[data.PeriodTo][label] = 0)
        byDate[data.PeriodTo][label] += data.Revenue
      })
    })

    const forChart: { [kdy: string]: string }[] = []
    Object.keys(byDate).sort().forEach((date) => {
      const dateItem: { [key: string]: string } = {
        name: date,
        ...byDate[date]
      }
      forChart.push(dateItem)
    })
    setChartData(forChart)
  }, [datas])

  return <div style={{ height: 800, width: 800}}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(lines).map((l) => <Line key={l} type="monotone" dataKey={l} stroke={lines[l]} />)}
      </LineChart>
    </ResponsiveContainer>
  </div>
}
