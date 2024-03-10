import { Grid, Paper, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import SkinEditor from '../../../../components/SkinEditor'
import usePreload from '../../../../hooks/usePreload'
import { Account } from '../../../../../types/account'

const AccountSettings = () => {
  const { localStore } = usePreload()
  const account: Account = JSON.parse(localStore.get('account') || '{}')

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
      <TextField value={account?.username} label="Username" disabled />
      <TextField value={account?.email} label="Email" disabled />
      <TextField value="12345678" label="Password" type="password" disabled />
      <Button variant="contained" disabled>
        Save
      </Button>
    </Paper>
  )
}

export default AccountSettings
