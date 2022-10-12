import { IRelease, IReleaseIds, ReleaseIdType } from '../label/release'
import { useState, useEffect } from 'react';
import { Box, Button, MenuItem, Select, TextField } from '@mui/material'
import { ConfirmCommitButton } from '../utility/ConfirmCommitButton'
import { IArtist } from '../artists/artist'

export default function Edit({
  release,
  artists
}: {
  release: IRelease
  artists?: {[key: string]: IArtist }
}) {
  const [idType, setIdType] = useState<ReleaseIdType>(ReleaseIdType.ISRC)
  const [idValue, setIdValue] = useState('')
  const [releaseIds, setReleaseIds] = useState<IReleaseIds | undefined>()
  const [releaseName, setReleaseName] = useState(release.name)
  const [existingArtists, setExistingArtists] = useState<IArtist[]>([])

  useEffect(() => {
    release.artists().then(setExistingArtists)
    setReleaseIds(release.releaseIds)
  }, [release])

  function addId() {
    if (!idValue) return
    release.addReleaseId(idType, idValue)
      .then((ids) => setReleaseIds({...ids}))
  }

  function removeId(type: ReleaseIdType, value: string) {
    release.removeReleaseId(type, value)
      .then((ids) => setReleaseIds({...ids}))
  }

  async function updateReleaseName() {
    await release.updateName(releaseName)
  }

  async function addArtist(artist: IArtist) {
    await release.addArtist(artist)
  }

  return <Box>
    <Box>{release.name}</Box>
    <Box>
      <TextField value={releaseName} onChange={({ target: { value }}) => setReleaseName(value)}/>
      <Button onClick={updateReleaseName}>Update</Button>
    </Box>
    {releaseIds && Object.entries(releaseIds).map(([idType, ids]) => {
      if (!ids.length) return null
      return <Box key={idType}>
        <Box><b>{idType}</b></Box>
        {ids.map((rid: string, i: number) => <Box key={i}>{rid}<ConfirmCommitButton onClick={() => removeId(idType as ReleaseIdType, rid)}>X</ConfirmCommitButton></Box>)}
      </Box>
    })}
    <Box>
      <Select
        value={idType}
        onChange={({ target: { value }}) => setIdType(value as ReleaseIdType)}
      >
        {Object.entries(ReleaseIdType).map(([label, idType]) => {
          return <MenuItem key={label} value={idType}>{label}</MenuItem>
        })}
      </Select>
      <TextField value={idValue} onChange={({ target: { value }}) => setIdValue(value)} />
      <Button onClick={addId}>Add</Button>
    </Box>
    <Box>{existingArtists.map((a) => a.name).join(', ')}</Box>
    {artists && Object.entries(artists).map(([id, artist]) => <Box key={id}><Button onClick={() => addArtist(artist)}>{artist.name}</Button></Box>)}
  </Box>
}
