import React from 'react';
import { Box, Button } from '@material-ui/core'
import { FileData, loadFiles } from './statements/utility'
import { StatementRow } from '../Types'
import { loadStatementFile } from './Helpers'

function FileSelector({ label, onLoad }: { label?: string; onLoad: (data: FileData) => void }) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])

  function filesSelected(e: any) {
    setSelectedFiles(Array.from(e.target.files))
  }

  function processFiles() {
    loadFiles(selectedFiles).then(onLoad)
  }

  return <Box><Button
    variant="contained"
    component="label"
  >
    Select Files
    <input
      type="file"
      onChange={filesSelected}
      hidden
      multiple
    />
  </Button>
    {!!selectedFiles.length && <Box>
      {selectedFiles.map((file, i) => <Box key={i}>{file.name}</Box>)}
      <Box><Button onClick={processFiles}>{label || 'DoIt'}</Button></Box>
    </Box>}
  </Box>
}

export function StatementsSelector({onStatementsSelect, label}: {label?: string, onStatementsSelect: (rows: StatementRow[]) => void}) {
  function onSelect(data: FileData) {
    const asRows = Object.values(data).reduce((acc: StatementRow[], sheetData) => {
      acc.push(...loadStatementFile(sheetData))
      return acc
    }, [])
    console.log('setting', asRows)
    onStatementsSelect(asRows)
  }

  return <FileSelector onLoad={onSelect} label={label} />
}
