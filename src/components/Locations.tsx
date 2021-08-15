import React from 'react'
import { AmpSheetRow } from '../Types'
import { getByLocation } from './Helpers'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { Box } from '@material-ui/core'
import Filters, { ALL, IFilters } from './Filters'

export default function Locations({ sheet }: { sheet: AmpSheetRow[] }) {
  const [byLocation, setByLocation] = React.useState<{ [location: string]: AmpSheetRow[]}>({})
  const [locations, setLocations] = React.useState<string[]>([])
  const [currentArtist, setCurrentArtist] = React.useState('')
  const [selectedSeries, setSelectedSeries] = React.useState('')
  const [data, setData] = React.useState<number[]>([])
  const [availableSeries, setAvailableSeries] = React.useState<{[label: string]: number[]}>({})

  React.useEffect(() => {
    const byLocation = getByLocation(sheet)
    setLocations(Object.keys(byLocation))
    setByLocation(byLocation)
  }, [sheet])

  React.useEffect(() => {
    const revenue: number[] = []
    const streams: number[] = []
    Object.keys(byLocation).forEach((retailer) => {
      let revTotal = 0
      let streamTotal = 0
      byLocation[retailer].forEach((track) => {
        if (currentArtist === ALL || currentArtist === track.Artist) {
          revTotal += track.Revenue
          streamTotal += track.Quantity
        }
      })
      revenue.push(revTotal)
      streams.push(streamTotal)
    })
    setAvailableSeries({ revenue, streams })
  }, [currentArtist, byLocation])

  React.useEffect(() => {
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
    <Filters sheet={sheet} onFiltersChanged={onFilterChange} />
    <ReactApexChart options={options()} series={data} type="donut" height={350 + Math.floor(Math.random() * 2) + 1} />
  </Box>
}
