import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { DashboardDayData } from '@/types'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'

interface TrendChartProps {
  data: DashboardDayData[]
  range: 7 | 30 | 'custom'
  onRangeChange: (range: 7 | 30) => void
  onCustomRangeChange?: (startDate: string, endDate: string) => void
  customRange?: { startDate: string; endDate: string }
  loading?: boolean
}

type MetricType = 'amount' | 'count' | 'average'

const metricConfig = {
  amount: {
    label: '成交金额',
    color: '#8b5cf6',
    dataKey: 'totalAmount',
    formatter: (value: number) => `¥${value.toFixed(2)}`,
  },
  count: {
    label: '成交单数',
    color: '#06b6d4',
    dataKey: 'orderCount',
    formatter: (value: number) => `${value}单`,
  },
  average: {
    label: '客单价',
    color: '#10b981',
    dataKey: 'averageAmount',
    formatter: (value: number) => `¥${value.toFixed(2)}`,
  },
}

export function TrendChart({
  data,
  range,
  onRangeChange,
  onCustomRangeChange,
  customRange,
  loading
}: TrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>('amount')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const chartData = data.map((day) => ({
    date: formatDate(day.date),
    [metricConfig[activeMetric].dataKey]: day[metricConfig[activeMetric].dataKey as keyof DashboardDayData],
  }))

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to && onCustomRangeChange) {
      const startDate = format(range.from, 'yyyy-MM-dd')
      const endDate = format(range.to, 'yyyy-MM-dd')
      onCustomRangeChange(startDate, endDate)
    }
  }

  const getDateRangeText = () => {
    if (range === 'custom' && customRange) {
      return `${format(new Date(customRange.startDate), 'MM/dd', { locale: zhCN })} - ${format(new Date(customRange.endDate), 'MM/dd', { locale: zhCN })}`
    }
    return `近${range}天`
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">趋势分析</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {getDateRangeText()}数据变化趋势
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={range === 7 ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRangeChange(7)}
          >
            近7天
          </Button>
          <Button
            variant={range === 30 ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRangeChange(30)}
          >
            近30天
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={range === 'custom' ? 'default' : 'outline'}
                size="sm"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                locale={zhCN}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(Object.keys(metricConfig) as MetricType[]).map((metric) => (
          <Button
            key={metric}
            variant={activeMetric === metric ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveMetric(metric)}
          >
            {metricConfig[metric].label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          加载中...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <Tooltip
              formatter={(value) => metricConfig[activeMetric].formatter(value as number)}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={metricConfig[activeMetric].dataKey}
              name={metricConfig[activeMetric].label}
              stroke={metricConfig[activeMetric].color}
              strokeWidth={2}
              dot={{ fill: metricConfig[activeMetric].color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
