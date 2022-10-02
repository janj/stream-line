import React from 'react'
import { Box, Button, MenuItem, Select, TextField } from '@mui/material'
import { ILabel } from './label'
import { getReleaseManager, IRelease, IReleaseIds, ReleaseIdType, ReleaseManager } from './release'

export default function ReleasesView({ label }: { label: ILabel }) {
  const [releases, setReleases] = React.useState<IRelease[]>([])
  const [releaseManager, setReleaseManager] = React.useState<ReleaseManager>()
  const [showCreate, setShowCreate] = React.useState(false)
  const [editRelease, setEditRelease] = React.useState<IRelease | undefined>()

  React.useEffect(() => {
    getReleaseManager(label).then((manager) => {
      setReleaseManager(manager)
      setReleases(manager.releases)
    })
  }, [label])

  async function createRelease(name: string) {
    if (!releaseManager) return
    const newRelease = await releaseManager.createRelease(name)
    setReleases([...releaseManager.releases])
    setShowCreate(false)
    setEditRelease(newRelease)
  }

  function toggleEditRelease(release: IRelease) {
    if (editRelease?.id === release.id) {
      setEditRelease(undefined)
    } else {
      setEditRelease(release)
    }
  }

  return <Box>
    <Box><b>Releases Associated With {label.name}</b></Box>
    {!releases.length && <Box>None</Box>}
    {releases.map((release) =>
      <Box key={release.id}>
        {release.name}
        <Button onClick={() => toggleEditRelease(release)}>edit</Button>
      </Box>
    )}
    {showCreate && <ReleaseCreate createRelease={createRelease} />}
    {editRelease && <ReleaseEdit release={editRelease} />}
    <Box><Button onClick={() => setShowCreate(!showCreate)}>Create New Release</Button></Box>
  </Box>
}

function ReleaseCreate({ createRelease }: { createRelease: (name: string) => unknown}) {
  const [name, setName] = React.useState('')

  return <Box padding={'20px'}>
    <Box>Name: <TextField value={name} onChange={({ target: { value }}) => setName(value)}></TextField></Box>
    <Box><Button onClick={() => createRelease(name)}>Create</Button></Box>
  </Box>
}

function ReleaseEdit({ release }: { release: IRelease }) {
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
