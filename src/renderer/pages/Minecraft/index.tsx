import { Container, Grid, Typography } from '@mui/material'
import MinecraftLogo from '../../assets/minecraft-logo.png'

const MinecraftPage = () => {
  return (
    <Grid
      container
      component={Container}
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <img src={MinecraftLogo} width="500" alt="Minecraft Logo" />
      <Typography variant="h5" mt="30px" fontWeight={600}>
        Coming soon...
      </Typography>
    </Grid>
  )
}

export default MinecraftPage
