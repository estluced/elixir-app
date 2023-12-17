import { Grid, TextField, Button } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { AuthContainer } from './styles'
import { login } from '../../../api/auth'
import usePreload from '../../hooks/usePreload'

const AuthPage = () => {
  const { localStore } = usePreload()
  const [nickname, setNickname] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = () => {
    if (nickname?.length < 3 || password?.length < 3) {
      return
    }
    login({
      identifier: nickname,
      password,
    }).then((res) => {
      localStore.set('_jwt', res.jwt)
      localStore.set('account', JSON.stringify(res.user))
      window.location.reload()
    })
  }

  return (
    <AuthContainer>
      <Grid
        container
        direction="column"
        sx={{
          maxWidth: '400px',
        }}
        gap="20px"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit()
          }
        }}
      >
        <h1>Auth</h1>
        <TextField
          label="Nickname"
          onChange={handleNicknameChange}
          variant="filled"
        />
        <TextField
          label="Password"
          onChange={handlePasswordChange}
          variant="filled"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Grid>
    </AuthContainer>
  )
}

export default AuthPage
