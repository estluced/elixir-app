import { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import Button from '@mui/material/Button'
import getLocales from '../../../api/getLocales'
import { Locale } from '../../../types/strapi'
import UnitedKingdomFlag from '../../assets/flags/united-kingdom.svg'
import UkraineFlag from '../../assets/flags/ukraine.svg'
import usePreload from '../../hooks/usePreload'

interface SelectLanguageProps {
  onFinish?: () => void
}

const SelectLanguage = ({ onFinish }: SelectLanguageProps) => {
  const { localStore } = usePreload()
  const [localesList, setLocalesList] = useState<Locale[]>([])
  const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null)

  useEffect(() => {
    getLocales().then((locales) => {
      setLocalesList(locales)
      setSelectedLocale(locales.find((locale) => locale.code === 'en'))
    })
  }, [])

  const getFlagForLocale = (locale: string) => {
    switch (locale) {
      case 'en':
        return UnitedKingdomFlag
      case 'uk':
        return UkraineFlag
      default:
        return null
    }
  }

  const onSelectLocale = (locale: Locale) => {
    setSelectedLocale(locale)
  }

  const onSave = () => {
    localStore.set('language', selectedLocale.code)
    if (onFinish) onFinish()
  }

  return (
    <Grid
      component={Paper}
      container
      sx={{
        padding: '40px',
        width: '450px',
      }}
      direction="column"
      gap="20px"
    >
      <Typography textAlign="center" p="0 20px" variant="h5" fontWeight={600}>
        Select language
      </Typography>
      <Grid container direction="column" gap="10px">
        {localesList.map((locale) => (
          <Grid
            key={locale.id}
            container
            component={Paper}
            sx={{
              cursor: 'pointer',
            }}
            direction="row"
            wrap="nowrap"
            justifyContent="space-between"
            p="10px 15px"
            alignItems="center"
            onClick={() => onSelectLocale(locale)}
          >
            <Grid container alignContent="center" gap="10px">
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  position: 'relative',
                }}
              >
                <img
                  src={getFlagForLocale(locale.code)}
                  alt={locale.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              </Box>
              <Typography fontWeight={600}>{locale.name}</Typography>
            </Grid>
            {locale.code === selectedLocale.code && <CheckCircle />}
          </Grid>
        ))}
      </Grid>
      <Button onClick={onSave} variant="contained" fullWidth>
        Save
      </Button>
    </Grid>
  )
}

export default SelectLanguage
