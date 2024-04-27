import { Grid, Paper, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import usePreload from '../../../../hooks/usePreload'

const AccountSettings = () => {
  const { localStore } = usePreload()
  const userName = localStore.get('userName')
  const userEmail = localStore.get('userEmail')

  return (
    <Paper
      component={Grid}
      container
      gap="20px"
      direction="column"
      p="25px 20px"
    >
      <Typography textAlign="center" p="0 20px" variant="h5" fontWeight={600}>
        Account
      </Typography>
      <TextField value={userName} label="Username" disabled />
      <TextField value={userEmail} label="Email" disabled />
      <TextField value="12345678" label="Password" type="password" disabled />
      <Button variant="contained" disabled>
        Save
      </Button>
    </Paper>
  )
}

export default AccountSettings
