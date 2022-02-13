import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import { Box, Flex, Heading } from '@chakra-ui/react'

function Hero() {
  return (
    <Box
      className="relative"
      style={{
        backgroundImage: 'url(' + '/images/bg1.jpeg ' + ')',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box className="absolute h-full w-full bg-black bg-opacity-60"></Box>
      <Flex className="relative z-10 min-h-[80vh] w-full items-center justify-center">
        <Box className="body-font text-gray-400">
          <Flex className="container mx-auto flex-col items-center justify-center px-5">
            <img
              className="mb-10 w-5/6 rounded object-cover object-center md:w-3/6 lg:w-2/6"
              alt="hero"
              src="/logo.png"
            />
            <div className="w-full text-center lg:w-2/3">
              <Heading
                as="h1"
                className="title-font mb-4 text-3xl font-medium text-white sm:text-4xl"
              >
                The Yesero Mugenyi Foundation
              </Heading>
            </div>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default Hero
