import { Box, Paper, styled } from '@mui/material'

export const PickInstallationFolderField = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '8px',
  overflow: 'hidden',
  display: 'flex',
  padding: '8px',
  alignItems: 'center',
  gap: '15px',
  justifyContent: 'space-between',
  border: `2px solid ${theme.palette.divider}`,
  '.MuiTypography-root': {
    fontWeight: 600,
    marginLeft: '8px',
    maxWidth: '55%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}))
