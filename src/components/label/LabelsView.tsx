import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import { UserDataContext } from '../contexts'
import { ILabel } from './label'

export default function LabelsView() {
  const [labels, setLabels] = React.useState<ILabel[]>([])

  const { labelManager } = React.useContext(UserDataContext)

  React.useEffect(() => {
    if (!labelManager) return
    setLabels(labelManager.allLabels)
  }, [labelManager])

  async function createLabel(name: string) {
    if (!labelManager) return
    await labelManager.createLabel(name)
    setLabels(labelManager.allLabels)
  }

  return <Box>
    <Box padding={'10px'}>Labels are where we start. We'll group releases under labels.</Box>
    <Box><b>Current Labels</b></Box>
    {labels.map((label) => <Box><Button>{label.name}</Button></Box>)}
    {labelManager && <LabelCreate createLabel={createLabel} />}
  </Box>
}

function LabelCreate({ createLabel }: { createLabel: (name: string) => unknown }) {
  const [name, setName] = React.useState('')

  return <Box padding={'20px'}>
    <Box>Create a new label:</Box>
    <Box>Name: <TextField value={name} onChange={({ target: { value }}) => setName(value)}></TextField></Box>
    <Box><Button onClick={() => createLabel(name)}>Create</Button></Box>
  </Box>
}
