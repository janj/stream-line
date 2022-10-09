import { useState, useEffect } from 'react';
import { getByLocation } from '../Helpers'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { Box } from '@mui/material'
import Filters, { ALL, IFilters } from '../Filters'
import { ITransactionData } from '../../types/Types'

export default function Locations({ transactions }: { transactions: ITransactionData[] }) {
  const [byLocation, setByLocation] = useState<{ [location: string]: ITransactionData[]}>({})
  const [locations, setLocations] = useState<string[]>([])
  const [currentArtist, setCurrentArtist] = useState('')
  const [selectedSeries, setSelectedSeries] = useState('')
  const [data, setData] = useState<number[]>([])
  const [availableSeries, setAvailableSeries] = useState<{[label: string]: number[]}>({})

  useEffect(() => {
    const byLocation = getByLocation(transactions)
    setLocations(Object.keys(byLocation))
    setByLocation(byLocation)
  }, [transactions])

  useEffect(() => {
    const revenue: number[] = []
    const streams: number[] = []
    Object.keys(byLocation).forEach((retailer) => {
      let revTotal = 0
      let streamTotal = 0
      byLocation[retailer].forEach((track) => {
        if (currentArtist === ALL || currentArtist === track.artistName) {
          revTotal += +track.revenue
          streamTotal += +track.quantity
        }
      })
      revenue.push(revTotal)
      streams.push(streamTotal)
    })
    setAvailableSeries({ revenue, streams })
  }, [currentArtist, byLocation])

  useEffect(() => {
    if (availableSeries[selectedSeries]) {
      setData([...availableSeries[selectedSeries]])
    }
  }, [selectedSeries, availableSeries])

  function onFilterChange({ artist, streamOrRevenue }: IFilters) {
    setCurrentArtist(artist)
    setSelectedSeries(streamOrRevenue)
  }

  const options = (): ApexOptions => ({
    chart: {
      type: 'donut',
    },
    labels: locations,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  })

  return <Box>
    <Filters sheet={transactions} onFiltersChanged={onFilterChange} />
    <ReactApexChart options={options()} series={data} type="donut" height={350 + Math.floor(Math.random() * 2) + 1} />
  </Box>
}
