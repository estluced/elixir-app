import { Box, Paper, Tooltip, Typography } from '@mui/material'
import { Gamepad } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  ProductButton,
  ProductNavigationContent,
  ProductNavigationWrapper,
} from './styles'
import { useProducts } from '../../providers/Products'

function ProductsNavigation() {
  const { clients, modifyClients } = useProducts()
  const navigate = useNavigate()

  const animationVariants = {
    hover: { scale: 1.2 },
    initial: { scale: 1 },
    tap: { scale: 0.9 },
  }

  const handleChangeNavigation = (manifestUrl: string) => {
    navigate({
      pathname: '/',
      search: `?manifestUrl=${manifestUrl}`,
    })
  }

  return (
    <ProductNavigationWrapper>
      <ProductNavigationContent>
        {!!clients.length && (
          <Tooltip
            id="product-nav-item-minecraft"
            placement="right"
            title="Minecraft"
          >
            <ProductButton
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={animationVariants}
              onClick={() => handleChangeNavigation('')}
            >
              <Gamepad
                sx={{
                  fontSize: '24px',
                }}
              />
            </ProductButton>
          </Tooltip>
        )}
        {modifyClients.map((product) => (
          <Tooltip
            id={`product-nav-item-${product.slug}`}
            placement="right"
            title={product.name}
          >
            <ProductButton
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={animationVariants}
              onClick={() => handleChangeNavigation(product.manifest)}
            >
              <Gamepad
                sx={{
                  fontSize: '24px',
                }}
              />
            </ProductButton>
          </Tooltip>
        ))}
      </ProductNavigationContent>
    </ProductNavigationWrapper>
  )
}

export default ProductsNavigation
