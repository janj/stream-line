import { useState, useEffect } from 'react';
import { Box, MenuItem, Select } from '@mui/material'
import { ITransactionData } from '../types/Types'

export const ALL = 'all'
const SERIES_TYPES = ['streams', 'revenue']

export interface IFilters {
  artist: string
  streamOrRevenue: string
}

export default function Filters({ sheet, onFiltersChanged }: {
  sheet: ITransactionData[]
  onFiltersChanged: (filters: IFilters) => void}
) {
  const [currentArtist, setCurrentArtist] = useState('')
  const [currentSeries, setCurrentSeries] = useState('')
  const [allArtists, setAllArtists] = useState<string[]>([])

  useEffect(() => {
    const artists: string[] = []
    sheet.forEach((row) => {
      if (row.artistName && !artists.includes(row.artistName)) {
        artists.push(row.artistName)
      }
    })
    setAllArtists(artists)
    setCurrentArtist(ALL)
    setCurrentSeries(SERIES_TYPES[0])
  }, [sheet])

  useEffect(() => {
    onFiltersChanged({ artist: currentArtist, streamOrRevenue: currentSeries})
  }, [currentSeries, currentArtist, onFiltersChanged])

  return <Box>
    <Select
      value={currentArtist}
      onChange={({ target: { value }}) => setCurrentArtist(value)}
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