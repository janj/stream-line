import { useState, useCallback, useEffect } from 'react';
import { Box, Button, MenuItem, Select } from '@mui/material'
import { IArtist } from './artist'
import { ArtistsManager, IArtistsByName, IMappingsByName } from './ArtistsManager'

export function ArtistsImport({manager, statementArtists}: {
  manager: ArtistsManager
  statementArtists: string[]
}) {
  const [mappings, setMappings] = useState<IMappingsByName>({})
  const [artists, setArtists] = useState<IArtistsByName>({})
  const [neither, setNeither] = useState<string[]>([])

  const artistSort = useCallback(() => {
    const {artists, mapped, neither} = manager.sortNames(statementArtists)
    setArtists(artists)
    setMappings(mapped)
    setNeither(neither)
  }, [manager, statementArtists])

  useEffect(() => {
    artistSort()
  }, [artistSort])

  return <Box>
    <UnknownArtists names={neither} manager={manager} onUpdate={artistSort}/>
    <ExistingArtists artists={artists} />
    <ExistingMappings mappings={mappings} />
  </Box>
}

function ExistingArtists({ artists }: { artists: IArtistsByName }) {
  return <Box border={'solid 1px'} padding={'5px'}>
    <Box><b>Artists</b></Box>
    <Box padding={'10px'}>{Object.values(artists).map((a, i) => <Box key={i}>{a.name}</Box>)}</Box>
  </Box>
}

function ExistingMappings({ mappings }: { mappings: IMappingsByName }) {
  if (!Object.keys(mappings).length) return null
  return <Box border={'solid 1px'} padding={'5px'}>
    <Box><b>Mappings</b></Box>
    <Box padding={'10px'}>{Object.values(mappings).map((m, i) => <Box key={i}>{m.name}<b>{' MAPPED TO: '}</b>{m.mappedTo.name}</Box>)}</Box>
  </Box>
}

function UnknownArtists({ names, manager, onUpdate }: { names: string[]; manager: ArtistsManager; onUpdate: () => void }) {
  if (!names.length) return null
  return <Box border={'solid 1px'} padding={'5px'}>
    <Box><b>Unknown Artists</b></Box>
    <Box padding={'10px'}>{names.map((name) => <ArtistImport manager={manager} name={name} onUpdate={onUpdate}/>)}</Box>
  </Box>
}

function ArtistImport({ name, manager, onUpdate }: {
  name: string
  manager: ArtistsManager
  onUpdate: () => void
}) {
  const [isMapping, setIsMapping] = useState(false)

  function doIt() {
    manager.createArtist({ name }).then(onUpdate)
  }

  function doMapping(mappedTo: IArtist) {
    manager.createMapping({ name, mappedTo }).then(onUpdate)
  }

  return <Box>
    <Box>
      {name}
      <Button onClick={doIt}>Import</Button>
      <Button onClick={() => setIsMapping(true)}>Map To Existing</Button>
    </Box>
    {isMapping && <GetArtist manager={manager} onSelect={doMapping} />}
  </Box>
}

function GetArtist({ manager, onSelect }: {
  manager: ArtistsManager
  onSelect: (artist: IArtist) => void
}) {
  const [selected, setSelected] = useState<string>()

  return <Box>
    <Select
      value={selected}
      onChange={(e) => setSelected(e.target.value as string)}
    >
      {Object.keys(manager.artistsByName).map((key) => <MenuItem key={key} value={key}>{key}</MenuItem>)}
    </Select>
    {selected && <Button onClick={() => onSelect(manager.artistForName(selected))}>Map It</Button>}
  </Box>
}
