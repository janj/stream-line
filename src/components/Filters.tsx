import React from 'react'
import { AmpSheetRow } from '../Types'
import { Box, MenuItem, Select } from '@material-ui/core'

export const ALL = 'all'
const SERIES_TYPES = ['streams', 'revenue']

export interface IFilters {
  artist: string
  streamOrRevenue: string
}

export default function Filters({ sheet, onFiltersChanged }: { sheet: AmpSheetRow[], onFiltersChanged: (filters: IFilters) => void}) {
  const [currentArtist, setCurrentArtist] = React.useState('')
  const [currentSeries, setCurrentSeries] = React.useState('')
  const [allArtists, setAllArtists] = React.useState<string[]>([])

  React.useEffect(() => {
    const artists: string[] = []
    sheet.forEach((row) => {
      if (row.Artist && !artists.includes(row.Artist)) {
        artists.push(row.Artist)
      }
    })
    setAllArtists(artists)
    setCurrentArtist(ALL)
    setCurrentSeries(SERIES_TYPES[0])
  }, [sheet])

  React.useEffect(() => {
    onFiltersChanged({ artist: currentArtist, streamOrRevenue: currentSeries})
  }, [currentSeries, currentArtist, onFiltersChanged])

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
      value={currentSeries}
      onChange={(e) => setCurrentSeries(e.target.value as string)}
      style={{padding: 6, margin: 6}}
    >
      {SERIES_TYPES.map((series) => {
        return <MenuItem key={series} value={series}>{series}</MenuItem>
      })}
    </Select>
  </Box>
}