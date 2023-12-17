import { Avatar, Grid, Button, Menu, MenuItem, Box } from '@mui/material'
import { useState, MouseEvent } from 'react'
import usePreload from '../../../hooks/usePreload'

const AccountMenu = () => {
  const { account } = usePreload()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { localStore } = usePreload()

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStore.set('account', null)
    localStore.set('_jwt', null)
    window.location.reload()
    handleClose()
  }

  return account ? (
    <>
      <Button
        sx={{
          color: 'text.primary',
        }}
        onClick={handleClick}
      >
        <Grid
          container
          alignItems="center"
          sx={{
            width: 'auto',
          }}
        >
          <Avatar
            sx={{
              width: '25px',
              height: '25px',
              fontSize: '14px',
              borderRadius: '50%',
            }}
          >
            {account.username.slice(0, 1).toUpperCase()}
          </Avatar>
        </Grid>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  ) : (
    <Box />
  )
}

export default AccountMenu
