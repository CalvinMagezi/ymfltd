import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import { Box, Flex, Heading, Text, Button, Badge, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const MotionBox = motion(Box)
const MotionBadge = motion(Badge)

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
      <Box className="absolute h-full w-full bg-black bg-opacity-70"></Box>
      <Flex className="relative z-10 min-h-[90vh] w-full items-center justify-center">
        <Box className="body-font text-gray-400">
          <Flex className="container mx-auto flex-col items-center justify-center px-5 py-12">
            {/* Strategic Timing Badges */}
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              spacing={4}
              className="mb-8 w-full max-w-4xl"
            >
              <MotionBadge
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                colorScheme="blue"
                fontSize={{ base: 'xs', md: 'sm' }}
                px={4}
                py={2}
                borderRadius="full"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                bg="blue.600"
                color="white"
              >
                <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>4,500+</Text>
                <Text fontSize={{ base: '2xs', md: 'xs' }}>Expatriates Arriving</Text>
              </MotionBadge>

              <MotionBadge
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                colorScheme="green"
                fontSize={{ base: 'xs', md: 'sm' }}
                px={4}
                py={2}
                borderRadius="full"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                bg="green.600"
                color="white"
              >
                <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>2026</Text>
                <Text fontSize={{ base: '2xs', md: 'xs' }}>Airport Opening</Text>
              </MotionBadge>

              <MotionBadge
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                colorScheme="red"
                fontSize={{ base: 'xs', md: 'sm' }}
                px={4}
                py={2}
                borderRadius="full"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                bg="red.600"
                color="white"
              >
                <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>4+ Hours</Text>
                <Text fontSize={{ base: '2xs', md: 'xs' }}>To Nearest Hospital</Text>
              </MotionBadge>

              <MotionBadge
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                colorScheme="yellow"
                fontSize={{ base: 'xs', md: 'sm' }}
                px={4}
                py={2}
                borderRadius="full"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                bg="yellow.600"
                color="white"
              >
                <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>First</Text>
                <Text fontSize={{ base: '2xs', md: 'xs' }}>Private Hospital</Text>
              </MotionBadge>
            </SimpleGrid>

            <img
              className="mb-10 w-5/6 rounded object-cover object-center md:w-3/6 lg:w-2/6"
              alt="hero"
              src="/logo.png"
            />
            <div className="w-full text-center lg:w-2/3">
              <Heading
                as="h1"
                className="title-font mb-4 text-3xl font-medium text-white sm:text-5xl"
              >
                Uganda's First Integrated Agro-Industrial Satellite Town
              </Heading>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color="blue.200"
                fontWeight="semibold"
                mb={4}
              >
                Hoima's Strategic Development Opportunity
              </Text>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="gray.300"
                mb={8}
                px={{ base: 4, md: 0 }}
              >
                Our ultimate goal is to make use of the 2 square miles acquired by Mr. Yesero Mugenyi
                for the undertaking of various projects, to create a production-satellite town with the
                capacity for commercial, industrial, nature reserve and other productions, distinct from
                that of the parent town - a new Kikwite Town in Hoima District.
              </Text>

              {/* Investment CTA */}
              <Flex
                gap={4}
                justify="center"
                wrap="wrap"
                mt={8}
              >
                <Link href="#investment" passHref>
                  <Button
                    as="a"
                    size="lg"
                    colorScheme="blue"
                    bg="blue.600"
                    _hover={{ bg: 'blue.700', transform: 'scale(1.05)' }}
                    _active={{ bg: 'blue.800' }}
                    px={8}
                    py={6}
                    fontSize={{ base: 'md', md: 'lg' }}
                    fontWeight="bold"
                    transition="all 0.3s"
                    boxShadow="xl"
                  >
                    View Investment Opportunity
                  </Button>
                </Link>
                <Link href="#contact" passHref>
                  <Button
                    as="a"
                    size="lg"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.05)' }}
                    px={8}
                    py={6}
                    fontSize={{ base: 'md', md: 'lg' }}
                    fontWeight="bold"
                    transition="all 0.3s"
                  >
                    Contact Us
                  </Button>
                </Link>
              </Flex>
            </div>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default Hero
