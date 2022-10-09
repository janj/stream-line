import {
  Box,
  TextField
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'

export interface IDateRange {
  startDate?: Date | null
  endDate?: Date | null
}

export default function DateRange({
  dateRange: { startDate, endDate},
  minDate,
  maxDate,
  onRangeChange
}: {
  dateRange: IDateRange
  minDate?: Date
  maxDate?: Date
  onRangeChange: (range: IDateRange) => void
}) {
  return <Box>
    <DatePicker
      value={startDate}
      minDate={minDate}
      maxDate={maxDate}
      onChange={(startDate: Date | null) => onRangeChange({
        startDate,
        endDate
      })}
      renderInput={(params) => <TextField {...params} />}
    />
    To
    <DatePicker
      value={endDate}
      minDate={minDate}
      maxDate={maxDate}
      onChange={(endDate) => onRangeChange({
        startDate,
        endDate
      })}
      renderInput={(params) => <TextField {...params} />}
    />
  </Box>
}
