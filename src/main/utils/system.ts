import { totalmem } from 'os'

export const getRAMRange = () => {
  const totalMemoryMB = Math.floor(totalmem() / 1024 / 1024)

  const start = 2024
  const end = totalMemoryMB % 2 === 0 ? totalMemoryMB : totalMemoryMB - 1
  const step = 2000

  const rangeArray = []

  for (let i = start; i <= end; i += step) {
    if (i % 2 === 0) {
      rangeArray.push(i)
    }
  }

  return rangeArray
}
