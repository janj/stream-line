import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material'

export default function Create({ createRelease }: { createRelease: (name: string) => unknown}) {
  const [name, setName] = useState('')

  return <Box padding={'20px'}>
    <Box>Name: <TextField value={name} onChange={({ target: { value }}) => setName(value)}></TextField></Box>
    <Box><Button onClick={() => createRelease(name)}>Create</Button></Box>
  </Box>
}
