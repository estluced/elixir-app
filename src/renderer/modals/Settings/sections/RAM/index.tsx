import { Paper, Slider, Typography, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import usePreload from '../../../../hooks/usePreload'
import { toggleSettingsModal } from '../../../../store/app/modalsSlice'

const RAMSettings = () => {
  const { bridge, localStore } = usePreload()
  const minRamFromStore = localStore.get('minRam')
  const maxRamFromStore = localStore.get('maxRam')
  const [value, setValue] = useState<number[]>([])
  const [ramRangeArray, setRamRangeArray] = useState<number[]>([])
  const [sliderMarks, setSliderMarks] = useState<
    {
      value: number
    }[]
  >([])
  const dispatch = useDispatch()

  useEffect(() => {
    bridge
      .sendMessage('helpers/get-ram-range-array')
      .on((ramRangeArray: number[]) => {
        setRamRangeArray(ramRangeArray)
        setValue(maxRamFromStore || ramRangeArray[1])
        setSliderMarks(ramRangeArray.map((ram) => ({ value: ram })))
      })
  }, [])

  const onChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number[])
  }

  const onSave = () => {
    localStore.set('minRam', minRamFromStore)
    localStore.set('maxRam', value)
    toast('Settings changes saved', {
      type: 'success',
    })
    dispatch(toggleSettingsModal())
  }

  return (
    <Paper
      sx={{
        padding: '30px 20px',
      }}
    >
      <Typography
        mb="40px"
        textAlign="center"
        p="0 20px"
        variant="h5"
        fontWeight={600}
      >
        Memory usage
      </Typography>
      <Box p="0 20px">
        <Slider
          aria-label="RAM"
          value={value}
          step={2000}
          onChange={onChange}
          marks={sliderMarks}
          min={ramRangeArray[0]}
          max={ramRangeArray[ramRangeArray.length - 1]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} MB`}
        />
      </Box>
      <Button
        variant="contained"
        sx={{
          marginTop: '20px',
          width: '100%',
        }}
        onClick={onSave}
        disabled={value[0] === minRamFromStore && value[1] === maxRamFromStore}
      >
        Save
      </Button>
    </Paper>
  )
}

export default RAMSettings
