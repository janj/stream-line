import React from 'react';
import { Box, Button, MenuItem, Select } from '@material-ui/core'
import { IArtist } from './artist'
import { ArtistsManager, IArtistsByName, IMappingsByName } from './ArtistsManager'

export function ArtistsImport({manager, statementArtists}: {
  manager: ArtistsManager
  statementArtists: string[]
}) {
  const [mappings, setMappings] = React.useState<IMappingsByName>({})
  const [artists, setArtists] = React.useState<IArtistsByName>({})
  const [neither, setNeither] = React.useState<string[]>([])

  const artistSort = React.useCallback(() => {
    const {artists, mapped, neither} = manager.sortNames(statementArtists)
    setArtists(artists)
    setMappings(mapped)
    setNeither(neither)
  }, [manager, statementArtists])

  React.useEffect(() => {
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
  return <Box border={'solid 1px'} padding={'5px'}>
    <Box><b>Mappings</b></Box>
    <Box padding={'10px'}>{Object.values(mappings).map((m, i) => <Box key={i}>{m.name}<b>{' MAPPED TO: '}</b>{m.mappedTo.name}</Box>)}</Box>
  </Box>
}

function UnknownArtists({ names, manager, onUpdate }: { names: string[]; manager: ArtistsManager; onUpdate: () => void }) {
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
  const [isMapping, setIsMapping] = React.useState(false)

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
  const [selected, setSelected] = React.useState<string>()

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
