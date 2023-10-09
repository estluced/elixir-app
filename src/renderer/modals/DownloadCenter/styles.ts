import { Box, styled } from '@mui/material'
import { motion } from 'framer-motion'

export const DownloadCenterContainer = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  right: '15px',
  top: '50px',
  display: 'flex',
  width: '350px',
  minHeight: '380px',
  zIndex: 1,
}))
