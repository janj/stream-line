import { IRelease, IReleaseIds, ReleaseIdType } from '../label/release'
import React from 'react'
import { Box, Button, MenuItem, Select, TextField } from '@mui/material'

export default function Edit({ release }: { release: IRelease }) {
  const [idType, setIdType] = React.useState<ReleaseIdType>(ReleaseIdType.ISRC)
  const [idValue, setIdValue] = React.useState('')
  const [releaseIds, setReleaseIds] = React.useState<IReleaseIds | undefined>()

  React.useEffect(() => {
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

  return <Box>
    <Box>{release.name}</Box>
    {releaseIds && Object.entries(releaseIds).map(([idType, ids]) => {
      if (!ids.length) return null
      return <Box key={idType}>
        <Box><b>{idType}</b></Box>
        {ids.map((rid: string, i: number) => <Box onClick={() => removeId(idType as ReleaseIdType, rid)} key={i}>{rid}<Button>X</Button></Box>)}
      </Box>
    })}
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
}
