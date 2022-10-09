import { useState, useContext, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material'
import { RouteParams, UserDataContext } from '../contexts'
import { ILabel } from './label'
import { useSearchParams } from 'react-router-dom'
import ReleasesView from '../release/ReleasesView'

export default function LabelsView() {
  const [labels, setLabels] = useState<ILabel[]>([])
  const [labelId, setLabelId] = useState<null | string>()

  const { labelManager } = useContext(UserDataContext)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (!labelManager) return
    setLabels(Object.values(labelManager.allLabels))
  }, [labelManager])

  useEffect(() => {
    setLabelId(searchParams.get(RouteParams.Labels))
  }, [searchParams])

  async function createLabel(name: string) {
    if (!labelManager) return
    await labelManager.createLabel(name)
    setLabels(Object.values(labelManager.allLabels))
  }

  function goToLabel(id: string) {
    setSearchParams(`${RouteParams.Labels}=${id}`)
  }

  if (labelId) {
    return <LabelView labelId={labelId} />
  }

  return <Box>
    <Box padding={'10px'}>Labels are where we start. We'll group releases under labels.</Box>
    <Box><b>Current Labels</b></Box>
    {labels.map((label) => <Box key={label.id}><Button onClick={() => goToLabel(label.id)}>{label.name}</Button></Box>)}
    {labelManager && <LabelCreate createLabel={createLabel} />}
  </Box>
}

function LabelCreate({ createLabel }: { createLabel: (name: string) => unknown }) {
  const [name, setName] = useState('')

  return <Box padding={'20px'}>
    <Box>Create a new label:</Box>
    <Box>Name: <TextField value={name} onChange={({ target: { value }}) => setName(value)}></TextField></Box>
    <Box><Button onClick={() => createLabel(name)}>Create</Button></Box>
  </Box>
}

function LabelView({ labelId }: { labelId: string }) {
  const [label, setLabel] = useState<ILabel | undefined>()
  const { labelManager } = useContext(UserDataContext)

  useEffect(() => {
    if (!labelManager) return
    setLabel(labelManager.forId(labelId))
  }, [labelManager, labelId])

  if (!labelManager) {
    return <Box>Loading...</Box>
  }

  if (!label) return <Box>That's odd</Box>

  return <Box>
    <Box>Label: <b>{label.name}</b></Box>
    <ReleasesView label={label} />
  </Box>
}