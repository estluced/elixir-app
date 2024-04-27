import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { AuthContainer } from './styles'
import { login } from '../../../api/auth'
import usePreload from '../../hooks/usePreload'

const AuthPage = () => {
  const { localStore } = usePreload()
  const [nickname, setNickname] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = () => {
    if (nickname?.length < 3 || password?.length < 3) {
      return setError('Nickname or password must be at least 3 characters long')
    }
    setLoading(true)
    login({
      identifier: nickname,
      password,
    })
      .then((res) => {
        if (res.error) {
          setError('Something went wrong, please try again')
          return
        }
        const { user } = res
        localStore.set('_jwt', res.jwt)
        localStore.set('userName', user.username)
        localStore.set('userEmail', user.email)
        localStore.set('userId', user.id)
        localStore.set('userBlocked', user.blocked)

        window.location.reload()
      })
      .finally(() => {
        setLoading(false)
      })
    return null
  }

  return (
    <AuthContainer container alignContent="center" justifyContent="center">
      <Grid
        container
        component={Paper}
        direction="column"
        wrap="nowrap"
        sx={{
          maxWidth: '400px',
          padding: '50px 40px',
        }}
        gap="20px"
        onKeyDown={(e: { key: string }) => {
          if (e.key === 'Enter') {
            handleSubmit()
          }
        }}
      >
        <Typography
          variant="h3"
          mb="22px"
          fontWeight={700}
          sx={{
            textAlign: 'center',
          }}
        >
          Login
        </Typography>
        <TextField
          error={!!error.length}
          label="Nickname"
          onChange={handleNicknameChange}
          variant="outlined"
        />
        <TextField
          error={!!error.length}
          type="password"
          label="Password"
          helperText={error}
          onChange={handlePasswordChange}
          variant="outlined"
        />
        <Button
          onClick={handleSubmit}
          sx={{
            width: '200px',
            borderRadius: '12px',
            margin: '0 auto',
          }}
          variant="contained"
        >
          {loading ? (
            <CircularProgress
              sx={{
                color: '#222',
              }}
              size={20}
            />
          ) : (
            <Typography fontWeight={600}>Submit</Typography>
          )}
        </Button>
      </Grid>
    </AuthContainer>
  )
}

export default AuthPage
