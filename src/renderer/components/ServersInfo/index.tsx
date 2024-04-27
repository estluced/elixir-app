import { useEffect, useState } from 'react'
import { Chip, Grid, Paper, Typography } from '@mui/material'

interface ServersInfoProps {
  servers: string[]
}

interface ServerStatus {
  players?: {
    online: number
    max: number
  }
  online: boolean
  motd?: {
    clean: string[]
    raw: string[]
    html: string[]
  }
}

const ServersInfo = ({ servers }: ServersInfoProps) => {
  const [serversStatuses, setServersStatuses] = useState<ServerStatus[]>([])
  const [serversOnline, setServersOnline] = useState(true)

  const getServersStatuses = (): Promise<ServerStatus[]> => {
    const statusesPromises = servers.map((serverIp) => {
      return fetch(`https://api.mcsrvstat.us/3/${serverIp}`).then((res) =>
        res.json(),
      )
    })
    return Promise.all(statusesPromises)
  }

  useEffect(() => {
    getServersStatuses().then((statuses) => {
      setServersStatuses(statuses)
      setServersOnline(statuses.some((status) => status.online))
    })
  }, [])

  return (
    <Grid container direction="column" gap="10px">
      {serversOnline ? (
        serversStatuses.map((status) => (
          <Grid
            key={`server-status-${status.motd?.clean[0]}`}
            component={Paper}
            container
            justifyContent="space-between"
            p="10px 20px"
            wrap="nowrap"
            width="100%"
          >
            <Typography fontWeight={600}>{status?.motd?.clean[0]}</Typography>
            <Grid
              alignItems="center"
              container
              wrap="nowrap"
              width="auto"
              gap="10px"
            >
              <Typography fontSize="14px">
                {status?.players.online}/{status?.players.max}
              </Typography>
              <Chip label="Online" color="success" variant="outlined" />
            </Grid>
          </Grid>
        ))
      ) : (
        <Paper
          sx={{
            textAlign: 'center',
            padding: '10px 20px',
          }}
        >
          <Typography fontWeight={600}>Servers are offline</Typography>
        </Paper>
      )}
    </Grid>
  )
}

export default ServersInfo
