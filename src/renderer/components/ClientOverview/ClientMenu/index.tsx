import { Grid, Menu, MenuItem } from '@mui/material'
import { useState, MouseEvent, ElementType } from 'react'
import { MoreHoriz, Folder, RotateLeft, Delete } from '@mui/icons-material'
import { PlayButton } from '../styles'

interface ClientMenuProps {
  menuItems: {
    icon: ElementType
    label: string
    onClick: () => void
    disabled?: boolean
  }[]
}

const ClientMenu = ({ menuItems }: ClientMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <PlayButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        sx={{
          padding: 0,
          minWidth: '34px',
        }}
        onClick={handleClick}
      >
        <MoreHoriz />
      </PlayButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menuItems?.map((item) => (
          <MenuItem
            component={Grid}
            disabled={item.disabled}
            container
            alignItems="center"
            alignContent="center"
            wrap="nowrap"
            gap="10px"
            key={`client-menu-${item.label}`}
            onClick={() => {
              item.onClick()
              handleClose()
            }}
          >
            <item.icon />
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ClientMenu
