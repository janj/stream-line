import React from 'react';
import { Box, Button, MenuItem, Select } from '@material-ui/core'
import { IArtist } from './artist'
import { ArtistsManager } from './ArtistsManager'
import { IArtistMapping } from './artistMapping'

export function ArtistsImport({manager, statementArtists}: {
  manager: ArtistsManager
  statementArtists: string[]
}) {
  return <Box>
    {statementArtists.map((artist) => <ArtistImport
      key={artist}
      name={artist}
      manager={manager}
    />)}
  </Box>
}

function ExistingArtist({ artist }: { artist: IArtist }) {
  return <Box>{artist.name}</Box>
}

function ExistingMapping({ mapping }: { mapping: IArtistMapping }) {
  return <Box>{`${mapping.name} MAPPED TO: ${mapping.mappedTo.name}`}</Box>
}

function ArtistImport({ name, manager }: {
  name: string
  manager: ArtistsManager
}) {
  const [isMapping, setIsMapping] = React.useState(false)
  const [existingArtist, setExistingArtist] = React.useState<IArtist>()
  const [existingMapping, setExistingMapping] = React.useState<IArtistMapping>()

  React.useEffect(() => {
    setExistingArtist(manager.artistForName(name))
  }, [name, manager])

  function doIt() {
    manager.createArtist({ name }).then(setExistingArtist)
  }

  function doMapping(mappedTo: IArtist) {
    manager.createMapping({ name, mappedTo }).then(setExistingMapping)
  }

  if (existingArtist) return <ExistingArtist artist={existingArtist} />

  if (existingMapping) return <ExistingMapping mapping={existingMapping} />

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
