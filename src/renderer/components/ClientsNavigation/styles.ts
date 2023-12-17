import { Box, styled } from '@mui/material'

export const ClientsNavigationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '60px 20px',
  position: 'sticky',
  top: 0,
  height: '100vh',
}))
