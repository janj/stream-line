import React from 'react'
import { Box, Button, MenuItem, Select, TextField } from '@mui/material'
import { ILabel } from './label'
import { getReleaseManager, IRelease, ReleaseManager } from './release'

export default function ReleasesView({ label }: { label: ILabel }) {
  const [releases, setReleases] = React.useState<IRelease[]>([])
  const [releaseManager, setReleaseManager] = React.useState<ReleaseManager>()
  const [showCreate, setShowCreate] = React.useState(false)

  React.useEffect(() => {
    getReleaseManager(label).then((manager) => {
      setReleaseManager(manager)
      setReleases(manager.releases)
    })
  }, [label])

  async function createRelease(name: string) {
    if (!releaseManager) return
    await releaseManager.createRelease(name)
    setReleases([...releaseManager.releases])
    setShowCreate(false)
  }

  return <Box>
    <Box><b>Releases Associated With {label.name}</b></Box>
    {!releases.length && <Box>None</Box>}
    {releases.map((release) => <Box key={release.id}>{release.name}</Box>)}
    <Box><Button onClick={() => setShowCreate(!showCreate)}>Create New Release</Button></Box>
    {showCreate && <ReleaseCreate createRelease={createRelease} />}
  </Box>
}

function ReleaseCreate({ createRelease }: { createRelease: (name: string) => unknown}) {
  const [name, setName] = React.useState('')

  return <Box padding={'20px'}>
    <Box>Name: <TextField value={name} onChange={({ target: { value }}) => setName(value)}></TextField></Box>
    <Box><Button onClick={() => createRelease(name)}>Create</Button></Box>
  </Box>
}

enum ReleaseIdType {
  ISRC = 'isrc',
  UPC = 'upc'
}

function ReleaseEdit({ release }: { release: IRelease }) {
  const [idType, setIdType] = React.useState('isrc')
  return <Box>
    <Box>{release.name}</Box>
    <Select
      value={idType}
      onChange={({ target: { value }}) => setIdType(value)}
      >
      {Object.entries(ReleaseIdType).map(([label, idType]) => {
        return <MenuItem key={label} value={idType}>{label}</MenuItem>
      })}
    </Select>
  </Box>
}
