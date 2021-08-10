import React from 'react';
import { Button } from '@material-ui/core';

export default function FileSelector({ onLoad }: { onLoad: (data: any) => void }) {
  const [fileName, setFileName] = React.useState('')

  function filesSelected(e: any) {
    const file = e.target.files[0]
    setFileName(file.name)
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = e.target?.result;
      onLoad(data)
    }
    reader.onerror = function(ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
  }

  return <Button
    variant="contained"
    component="label"
  >
    {fileName || 'Upload File'}
    <input
      type="file"
      onChange={filesSelected}
      hidden
    />
  </Button>
}
