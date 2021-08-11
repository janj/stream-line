import React from 'react';
import { Button } from '@material-ui/core';

export default function FileSelector({ onLoad }: { onLoad: (data: any) => void }) {
  function loadFiles(toLoad: any[], loaded: {[key: string]: any} = {}) {
    if (!toLoad.length) {
      onLoad(loaded)
      return
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = e.target?.result;
      loaded[toLoad[0].name] = data
      loadFiles(toLoad.slice(1), loaded)
    }
    reader.onerror = function(ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(toLoad[0]);
  }

  function filesSelected(e: any) {
    const files = []
    for (let i=0; i<e.target.files.length; i++) {
      files.push(e.target.files[i])
    }
    loadFiles(files)
  }

  return <Button
    variant="contained"
    component="label"
  >
    Upload Files
    <input
      type="file"
      onChange={filesSelected}
      hidden
      multiple
    />
  </Button>
}
