import React, { useEffect, useRef } from 'react'
import { SwiperSlide, Swiper } from 'swiper/react'
import {
  Grid,
  Mousewheel,
  Navigation,
  Pagination,
  Autoplay,
  Parallax,
  A11y,
} from 'swiper/modules'
import { ChevronRight, ChevronLeft } from '@mui/icons-material'
import { NavButton, NavigationContainer, CarouselWrapper } from './styles'

interface ResizeObserverComponentProps {
  children: React.ReactNode
  swiper: any
}

const ResizeObserverComponent: React.FC<ResizeObserverComponentProps> = ({
  children,
  swiper,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target instanceof HTMLElement) {
          swiper?.updateAutoHeight(500)
        }
      })
    })

    if (containerRef.current) {
      containerRef.current.childNodes.forEach((child) => {
        if (child instanceof HTMLElement) {
          resizeObserver.observe(child)
        }
      })
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [swiper])

  return <div ref={containerRef}>{children}</div>
}

interface CarouselProps {
  children: React.ReactNode
  slidesPerView: 'auto' | number
  navigation?: boolean
  navigationPosition?: 'bottom' | 'laterally' | 'inside'
  navigationsColor?: 'white' | 'black'
  pagination?: boolean
  spaceBetween?: number
  slidesPerGroup?: number
  vertical?: boolean
  loop?: boolean
  activeIndex?: number
  setCurrentSlide?: (index: number) => void
  setIsBeginning?: (isBeginning: boolean) => void
  grid?: boolean
  overflowHidden?: boolean
  centeredSlides?: boolean
  autoHeight?: boolean
  autoPlay?: boolean
  parallax?: boolean
  speed?: number
  allowTouchMove?: boolean
}

function Carousel({
  children,
  slidesPerView = 'auto',
  navigation = false,
  pagination = false,
  spaceBetween,
  slidesPerGroup = 1,
  vertical = false,
  loop = false,
  activeIndex = 0,
  setCurrentSlide,
  setIsBeginning,
  grid = false,
  overflowHidden = true,
  centeredSlides = false,
  autoHeight = false,
  navigationPosition = 'bottom',
  autoPlay = false,
  parallax = false,
  navigationsColor = 'black',
  speed = 300,
  allowTouchMove = false,
}: CarouselProps) {
  const navigationPrevRef = React.useRef<HTMLButtonElement>(null)
  const navigationNextRef = React.useRef<HTMLButtonElement>(null)
  const [swiper, setSwiper] = React.useState<any>()

  useEffect(() => {
    if (swiper) {
      if (navigation) {
        swiper.params.navigation.prevEl = navigationPrevRef.current
        swiper.params.navigation.nextEl = navigationNextRef.current
        swiper.params.navigation.disabledClass = 'carousel-hidden-nav-button'
      }
      swiper.navigation.init()
      swiper.navigation.update()
    }
  }, [navigation, swiper])

  useEffect(() => {
    if (swiper) {
      swiper.slideToLoop(activeIndex)
      swiper.activeIndex = activeIndex
    }
  }, [swiper, activeIndex])

  const handleSlideChange = (swipe: any) => {
    if (setCurrentSlide) setCurrentSlide(swipe.activeIndex)
    if (setIsBeginning) setIsBeginning(swipe.realIndex)
  }

  const handleApplyTouchMove = (swiperObject: any) => {
    // eslint-disable-next-line no-param-reassign
    swiperObject.allowTouchMove = allowTouchMove
    swiperObject.update()
  }

  return (
    <CarouselWrapper overflowHidden={overflowHidden} position="relative">
      <Swiper
        loop={loop}
        grid={
          grid
            ? {
                rows: 2,
                fill: 'row',
              }
            : undefined
        }
        shortSwipes={false}
        longSwipesRatio={0.1}
        autoplay={
          autoPlay
            ? {
                delay: 3000,
              }
            : undefined
        }
        parallax={parallax}
        longSwipesMs={100}
        modules={[
          Pagination,
          Navigation,
          Mousewheel,
          Grid,
          Autoplay,
          Parallax,
          A11y,
        ]}
        slidesPerGroup={slidesPerGroup}
        spaceBetween={spaceBetween}
        mousewheel={vertical}
        updateOnWindowResize
        speed={speed}
        freeMode
        centeredSlides={centeredSlides}
        slidesPerView={slidesPerView}
        pagination={pagination}
        autoHeight={autoHeight}
        onSlideChange={handleSlideChange}
        direction={vertical ? 'vertical' : 'horizontal'}
        onSwiper={setSwiper}
        onInit={handleApplyTouchMove}
        onResize={handleApplyTouchMove}
      >
        {React.Children.map(children, (child) => (
          <SwiperSlide
            style={{
              boxSizing: 'border-box',
              ...(vertical
                ? { maxHeight: '100vh', height: '100%' }
                : {
                    maxWidth: slidesPerView === 'auto' ? 'min-content' : 'auto',
                    height: 'auto',
                  }),
            }}
          >
            {autoHeight ? (
              <ResizeObserverComponent swiper={swiper}>
                {React.cloneElement(child as React.ReactElement)}
              </ResizeObserverComponent>
            ) : (
              <>{React.cloneElement(child as React.ReactElement)}</>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {navigation && React.Children.count(children) > 1 && (
        <NavigationContainer navigationPosition={navigationPosition}>
          <NavButton
            navigationsColor={navigationsColor}
            ref={navigationPrevRef}
            aria-label="carousel-navigation-back"
          >
            <ChevronLeft width="7px" />
          </NavButton>
          <NavButton
            navigationsColor={navigationsColor}
            ref={navigationNextRef}
            aria-label="carousel-navigation-next"
          >
            <ChevronRight width="7px" />
          </NavButton>
        </NavigationContainer>
      )}
    </CarouselWrapper>
  )
}

export { Carousel, type CarouselProps }
