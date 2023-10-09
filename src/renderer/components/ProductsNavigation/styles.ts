import { Box, styled } from '@mui/material'
import { motion } from 'framer-motion'

export const ProductNavigationWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '0',
  zIndex: 1,
  height: '100%',
  display: 'grid',
  alignItems: 'center',
  left: '30px',
}))

export const ProductNavigationContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}))

export const ProductButton = styled(motion.div)(({ theme }) => ({
  border: `2px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50px',
  height: '50px',
  borderRadius: '10px',
}))
