import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { AmpSheetRow } from '../Types'
import { getByRetailer } from './Helpers'
import { ApexOptions } from 'apexcharts'
import { Box } from '@material-ui/core'
import Filters, { ALL, IFilters } from './Filters'

export default function Retailers({ sheet }: { sheet: AmpSheetRow[] }) {
  const [byRetailer, setByRetailer] = React.useState<{[retailer: string]: AmpSheetRow[]}>({})
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
        if (currentArtist === ALL || currentArtist === track.Artist) {
          revTotal += track.Revenue
          streamTotal += track.Quantity
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
