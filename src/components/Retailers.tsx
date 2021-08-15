import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { AmpSheetRow } from '../Types'
import { getByRetailer } from './Helpers'
import { ApexOptions } from 'apexcharts'
import { Box, MenuItem, Select } from '@material-ui/core'

const ALL = 'all'

export default function Retailers({ sheet }: { sheet: AmpSheetRow[] }) {
  const [byRetailer, setByRetailer] = React.useState<{[retailer: string]: AmpSheetRow[]}>({})
  const [currentSeries, setSeries] = React.useState<{ data: number[] }[]>([])
  const [currentCategories, setCategories] = React.useState<string[]>([])
  const [allArtists, setAllArtists] = React.useState<string[]>([])
  const [currentArtist, setCurrentArtist] = React.useState(ALL)
  const [availableSeries, setAvailableSeries] = React.useState<{[label: string]: number[]}>({})
  const [selectedSeries, setSelectedSeries] = React.useState('streams')

  React.useEffect(() => {
    const byRetailer = getByRetailer(sheet)
    const categories: string[] = []
    const artists: string[] = []
    Object.keys(byRetailer).forEach((retailer) => {
      categories.push(retailer)
      byRetailer[retailer].forEach((track) => {
        if (!artists.includes(track.Artist)) {
          artists.push(track.Artist)
        }
      })
    })
    setByRetailer(byRetailer)
    setCategories(categories)
    setAllArtists(artists)
  }, [sheet])

  React.useEffect(() => {
    const revenue: number[] = []
    const streams: number[] = []
    let revTotal = 0
    let streamTotal = 0
    Object.keys(byRetailer).forEach((retailer) => {
      byRetailer[retailer].forEach((track) => {
        if (currentArtist === ALL || currentArtist === track.Artist) {
          revTotal += track.Revenue
          streamTotal += parseInt(track.Quantity)
        }
      })
      revenue.push(revTotal)
      streams.push(streamTotal)
    })
    setAvailableSeries({ revenue, streams })
    setSeries([{ data: streams }])
  }, [currentArtist])

  React.useEffect(() => {
    setSeries([{ data: availableSeries[selectedSeries] }])
  }, [selectedSeries, byRetailer])

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
    <Select
      value={currentArtist}
      onChange={(e) => setCurrentArtist(e.target.value as string)}
      style={{padding: 6, margin: 6}}
      >
      <MenuItem value={ALL}>All</MenuItem>
      {allArtists.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
    </Select>
    <Select
      value={selectedSeries}
      onChange={(e) => setSelectedSeries(e.target.value as string)}
      style={{padding: 6, margin: 6}}
      >
      {Object.keys(availableSeries).map((series) => {
        return <MenuItem key={series} value={series}>{series}</MenuItem>
      })}
    </Select>
    <ReactApexChart options={options} series={currentSeries} type="bar" height={350} />
  </Box>
}
