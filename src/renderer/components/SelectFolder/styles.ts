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
  border: `2px solid ${theme.palette.background.default}`,
  '.MuiTypography-root': {
    fontWeight: 600,
    marginLeft: '8px',
    maxWidth: '55%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}))

export const StyledPaper = styled(Paper)({
  padding: '40px',
  width: '450px',
  display: 'grid',
  gap: '30px',
})
