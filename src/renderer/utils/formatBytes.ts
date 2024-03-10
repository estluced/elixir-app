const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes.toFixed(0)} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default formatBytes
