import { StatementRow } from '../../Types'

export type FileData = {
  [fileName: string]: string
}

export async function loadFile(file: File): Promise<{name: string, data: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result as string
      resolve({ name: file.name, data })
    }
    reader.onerror = reject
    reader.readAsBinaryString(file)
  })
}

export async function loadFiles(files: File[]) {
  return files.reduce((acc: Promise<FileData>, file) => {
    return acc.then((fileData) => {
      return loadFile(file).then(({name, data}) => {
        fileData[name] = data
        return fileData
      })
    })
  }, Promise.resolve({}))
}

export function artistsFromSheetData(data: StatementRow[]) {
  return Array.from(new Set(data.map((d) => d.Artist)))
}
