import { Grid, IconButton, Menu, MenuItem, Paper } from '@mui/material'
import ReactSkinView3d from 'react-skinview3d'
import { WalkingAnimation } from 'skinview3d'
import Button from '@mui/material/Button'
import { ChangeEvent, useEffect, useState, MouseEvent } from 'react'
import { Edit, Delete } from '@mui/icons-material'
import { toast } from 'react-toastify'
import DefaultSkin from '../../assets/default-skin.png'
import DefaultCape from '../../assets/default-cape.png'
import usePreload from '../../hooks/usePreload'
import { clearSkinData, uploadSkinData } from '../../../api/uploadSkin'

const UploadButton = ({
  type,
  onChange,
  label,
}: {
  type: 'skin' | 'cape'
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  label: string
}) => (
  <Button
    sx={{
      width: '100%',
    }}
  >
    <input
      type="file"
      onChange={onChange}
      id={`upload-${type}-btn`}
      hidden
      accept=".png"
    />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor={`upload-${type}-btn`}>{label}</label>
  </Button>
)

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

interface SkinEditorProps {
  width?: number
}

const SkinEditor = ({ width = 200 }: SkinEditorProps) => {
  const { bridge, account } = usePreload()

  const [currentSkin, setCurrentSkin] = useState<string | undefined>(
    DefaultSkin,
  )

  const [currentCape, setCurrentCape] = useState<string | undefined>(
    DefaultCape,
  )

  const [skinUrl, setSkinUrl] = useState<string | undefined>(DefaultSkin)
  const [capeUrl, setCapeUrl] = useState<string | undefined>(DefaultCape)

  const [skinFile, setSkinFile] = useState<File | undefined>(undefined)
  const [capeFile, setCapeFile] = useState<File | undefined>(undefined)

  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  )

  const open = Boolean(editMenuAnchorEl)

  const handleOpenEditMenu = (event: MouseEvent<HTMLElement>) => {
    setEditMenuAnchorEl(event.currentTarget)
  }

  const handleCloseEditMenu = () => {
    setEditMenuAnchorEl(null)
  }

  useEffect(() => {
    bridge
      .sendMessage('helpers/account/skin')
      .on(
        (skinInfo: { skin: string | undefined; cape: string | undefined }) => {
          if (skinInfo.skin?.length) {
            setSkinUrl(skinInfo.skin)
            setCurrentSkin(skinInfo.skin)
          }
          if (skinInfo.cape?.length) {
            setCapeUrl(skinInfo.cape)
            setCurrentCape(skinInfo.cape)
          }
        },
      )
  }, [])

  const onChangeSkin = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSkinUrl(URL.createObjectURL(file))
      setSkinFile(file)
    }
    handleCloseEditMenu()
  }

  const onChangeCape = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log(file)
      setCapeUrl(URL.createObjectURL(file))
      setCapeFile(file)
    }
    handleCloseEditMenu()
  }

  const onReset = () => {
    clearSkinData(account.username)
      .then(() => {
        setCurrentSkin(DefaultSkin)
        setCurrentCape(DefaultCape)
      })
      .then(() => {
        setSkinUrl(DefaultSkin)
        setCapeUrl(DefaultCape)
        setSkinFile(undefined)
        setCapeFile(undefined)
        toast('Skin cleared successfully', { type: 'success' })
      })
      .catch(() => {
        toast('Failed to clear skin', { type: 'error' })
      })
  }

  const onSave = () => {
    console.log(capeFile)
    uploadSkinData(account.username, {
      skin: skinFile,
      cape: capeFile,
    })
      .then(() => {
        setCurrentSkin(skinUrl)
        setCurrentCape(capeUrl)
        toast('Skin saved successfully', { type: 'success' })
      })
      .catch(() => {
        toast('Failed to save skin', { type: 'error' })
      })
  }

  return (
    <Grid maxWidth={`${width}px`}>
      <Paper
        sx={{
          height: '310px',
          width: `${width}px`,
          position: 'relative',
        }}
      >
        <ReactSkinView3d
          skinUrl={skinUrl}
          capeUrl={capeUrl}
          width={width}
          height={315}
          options={{
            zoom: 0.8,
          }}
          onReady={({ viewer }) => {
            viewer.animation = new WalkingAnimation()
            viewer.autoRotate = true
            viewer.autoRotateSpeed = 0.3
          }}
        />
        {(skinUrl !== DefaultSkin || capeUrl !== DefaultCape) && (
          <IconButton
            sx={{
              position: 'absolute',
              top: '10px',
              left: '10px',
            }}
            onClick={onReset}
          >
            <Delete
              sx={{
                color: 'text.primary',
              }}
            />
          </IconButton>
        )}
        <IconButton
          id="edit-menu-button"
          aria-controls={open ? 'edit-menu-button' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
          }}
          onClick={handleOpenEditMenu}
        >
          <Edit
            sx={{
              color: 'text.primary',
            }}
          />
        </IconButton>
        <Menu
          open={open}
          anchorEl={editMenuAnchorEl}
          onClose={handleCloseEditMenu}
          id="edit-menu"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          aria-labelledby="edit-menu-button"
        >
          <MenuItem
            sx={{
              padding: 0,
            }}
          >
            <UploadButton
              label="Change skin"
              type="skin"
              onChange={onChangeSkin}
            />
          </MenuItem>
          <MenuItem
            sx={{
              padding: 0,
            }}
          >
            <UploadButton
              label="Change cape"
              type="cape"
              onChange={onChangeCape}
            />
          </MenuItem>
        </Menu>
        {(currentSkin !== skinUrl || currentCape !== capeUrl) && (
          <Button
            onClick={onSave}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '40px',
              bottom: 0,
            }}
          >
            Save
          </Button>
        )}
      </Paper>
    </Grid>
  )
}

export default SkinEditor
