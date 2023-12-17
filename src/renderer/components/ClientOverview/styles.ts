import { Box, styled, Button } from '@mui/material'

export const ClientOverviewContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '70px 50px',
})

export const PlayButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '10px',
  color: theme.palette.text.secondary,
  padding: '5px 17px 5px 10px',
  '&:hover': {
    backgroundColor: '#cecece',
  },
}))
