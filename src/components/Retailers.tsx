import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { getByRetailer } from './Helpers'
import { ApexOptions } from 'apexcharts'
import { Box } from '@mui/material'
import Filters, { ALL, IFilters } from './Filters'
import { ITransactionData } from '../types/Types'

export default function Retailers({ sheet }: { sheet: ITransactionData[] }) {
  const [byRetailer, setByRetailer] = React.useState<{[retailer: string]: ITransactionData[]}>({})
  const [currentSeries, setSeries] = React.useState<{ data: number[] }[]>([])
  const [currentCategories, setCategories] = React.useState<string[]>([])
  const [currentArtist, setCurrentArtist] = React.useState('')
  const [availableSeries, setAvailableSeries] = React.useState<{[label: string]: number[]}>({})
  const [selectedSeries, setSelectedSeries] = React.useState('')

  React.useEffect(() => {
    const byRetailer = getByRetailer(sheet)
    const categories: string[] = []
    Object.keys(byRetailer).forEach((retailer) => {
      categories.push(retailer)
    })
    setByRetailer(byRetailer)
    setCategories(categories)
  }, [sheet])

  React.useEffect(() => {
    const revenue: number[] = []
    const streams: number[] = []
    Object.keys(byRetailer).forEach((retailer) => {
      let revTotal = 0
      let streamTotal = 0
      byRetailer[retailer].forEach((track) => {
        if (currentArtist === ALL || currentArtist === track.artistName) {
          revTotal += track.revenue
          streamTotal += track.quantity
        }
      })
      revenue.push(revTotal)
      streams.push(streamTotal)
    })
    setAvailableSeries({ revenue, streams })
    setSeries([{ data: streams }])
  }, [currentArtist, byRetailer])

  React.useEffect(() => {
    if (availableSeries[selectedSeries]) {
      setSeries([{data: availableSeries[selectedSeries]}])
    }
  }, [selectedSeries, availableSeries])

  function onFilterChange({ artist, streamOrRevenue }: IFilters) {
    setCurrentArtist(artist)
    setSelectedSeries(streamOrRevenue)
  }

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: currentCategories,
    }
  }
  return <Box>
    <Filters sheet={sheet} onFiltersChanged={onFilterChange} />
    <ReactApexChart options={options} series={currentSeries} type="bar" height={350} />
  </Box>
}
