import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material'
import { ILabel } from '../label/label'
import { getReleaseManager, IRelease, ReleaseManager } from '../label/release'
import Create from './Create'
import Edit from './Edit'
import { useSearchParams } from 'react-router-dom'

export default function ReleasesView({ label }: { label: ILabel }) {
  const [releases, setReleases] = useState<IRelease[]>([])
  const [releaseManager, setReleaseManager] = useState<ReleaseManager>()
  const [showCreate, setShowCreate] = useState(false)
  const [editRelease, setEditRelease] = useState<IRelease | undefined>()

  const [, setSearchParams] = useSearchParams()

  useEffect(() => {
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

  function goToRelease(release: IRelease) {
    setSearchParams(`release=${release.id}`)
  }

  return <Box>
    <Box><b>Releases Associated With {label.name}</b></Box>
    {!releases.length && <Box>None</Box>}
    {releases.map((release) =>
      <Box key={release.id}>
        {release.name}
        <Button onClick={() => toggleEditRelease(release)}>edit</Button>
        <Button onClick={() => goToRelease(release)}>Go</Button>
      </Box>
    )}
    {showCreate && <Create createRelease={createRelease} />}
    {editRelease && <Edit release={editRelease} />}
    <Box><Button onClick={() => setShowCreate(!showCreate)}>Create New Release</Button></Box>
  </Box>
}
