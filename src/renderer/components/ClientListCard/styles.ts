import { Box, styled } from '@mui/material'
import { ClientStatus, ClientStatusEnum } from '../../../types/client'

export const ClientListCardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{
  status: ClientStatus
}>(({ theme, status }) => ({
  border: `2px solid ${
    status === ClientStatusEnum.LAUNCHED
      ? theme.palette.success.light
      : theme.palette.text.primary
  }`,
  borderRadius: '8px',
  padding: '6px',
  backdropFilter: 'blur(100px)',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  height: '75px',
  alignItems: 'center',
  cursor: 'pointer',
  transition: '0.1s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}))

export const ClientPosterContainer = styled(Box)(({ theme }) => ({
  height: '60px',
  width: '60px',
  overflow: 'hidden',
  borderRadius: '4px',
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}))

export const ClientTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}))
