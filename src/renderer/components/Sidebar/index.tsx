import { Grid, SxProps } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { Home, Settings, CodeOff } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { SidebarButton, SidebarContainer } from './styles'
import { toggleSettingsModal } from '../../store/app/modalsSlice'
import { RootState } from '../../store'

const SidebarNavButton = ({
  href,
  icon,
  sx,
  onClick,
}: {
  href?: string
  icon: ReactNode
  sx?: SxProps
  onClick?: () => void
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const onNavigate = () => {
    if (href) {
      navigate(href)
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <SidebarButton
      sx={sx}
      disableRipple
      active={location.pathname === href}
      onClick={onNavigate}
    >
      {icon}
    </SidebarButton>
  )
}

const Sidebar = () => {
  const settingsModalIsOpen = useSelector(
    (state: RootState) => state.modals.settings,
  )
  const dispatch = useDispatch()

  const navItems = [
    {
      href: '/',
      icon: <Home />,
    },
    {
      href: '/minecraft',
      icon: <CodeOff />,
    },
  ]

  const handleToggleSettingsModal = () => dispatch(toggleSettingsModal())

  const handleHideSettingsModal = () =>
    settingsModalIsOpen && dispatch(toggleSettingsModal())

  return (
    <SidebarContainer>
      <Grid
        container
        direction="column"
        wrap="nowrap"
        justifyContent="space-between"
        height="100%"
      >
        <Grid
          container
          direction="column"
          wrap="nowrap"
          gap="10px"
          m="5px"
          width="auto"
        >
          {navItems.map((item) => (
            <SidebarNavButton
              onClick={handleHideSettingsModal}
              key={item.href}
              {...item}
            />
          ))}
        </Grid>
        <SidebarNavButton
          sx={{
            margin: '5px',
          }}
          onClick={handleToggleSettingsModal}
          icon={<Settings />}
        />
      </Grid>
    </SidebarContainer>
  )
}

export default Sidebar
