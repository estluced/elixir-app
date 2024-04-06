import { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material'
import SelectFolder from '../../components/SelectFolder'
import usePreload from '../../hooks/usePreload'
import SelectLanguage from '../../components/SelectLanguage'

const SetupPage = () => {
  const { installPath, lang } = usePreload()
  const [step, setStep] = useState<'select-folder' | 'select-language'>()

  useEffect(() => {
    if (!installPath?.length) {
      setStep('select-folder')
    } else if (!lang?.length) {
      setStep('select-language')
    }
  }, [])

  const onFinishSelectFolder = () => {
    if (!lang?.length) {
      setStep('select-language')
      return
    }
    window.location.reload()
  }

  const onFinishSelectLanguage = () => {
    if (!installPath?.length) {
      setStep('select-folder')
      return
    }
    window.location.reload()
  }

  return (
    <Grid
      component={Container}
      container
      height="100vh"
      justifyContent="center"
      alignContent="center"
    >
      {step === 'select-folder' && (
        <SelectFolder onFinish={onFinishSelectFolder} />
      )}
      {step === 'select-language' && (
        <SelectLanguage onFinish={onFinishSelectLanguage} />
      )}
    </Grid>
  )
}

export default SetupPage
