'use client'

import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'
import { Box, Flex, Heading, Text, Button, Badge, SimpleGrid, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const MotionBox = motion(Box)
const MotionBadge = motion(Badge)

function Hero() {
  const overlayBg = useColorModeValue('blackAlpha.500', 'blackAlpha.600')
  const titleColor = useColorModeValue('white', 'white')
  const subtitleColor = useColorModeValue('blue.200', 'blue.300')
  const descriptionColor = useColorModeValue('gray.200', 'gray.300')
  
  // Badge colors for better visibility
  const badgeColors = {
    blue: useColorModeValue('blue.600', 'blue.500'),
    green: useColorModeValue('green.600', 'green.500'), 
    red: useColorModeValue('red.600', 'red.500'),
    yellow: useColorModeValue('yellow.600', 'yellow.500')
  }
  const badgeTextColor = useColorModeValue('white', 'white')
  
  return (
    <Box className="relative min-h-[90vh] overflow-hidden">
      {/* Background Carousel */}
      <Box className="absolute inset-0 z-0" style={{ height: '100%' }}>
        <Carousel
          showArrows={false}
          showStatus={false}
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={4000}
          showIndicators={false}
        >
          <div style={{ position: 'relative', height: '90vh' }}>
            <Image
              src="/images/bg1.jpeg"
              alt="Background 1"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div style={{ position: 'relative', height: '90vh' }}>
            <Image
              src="/images/bg2.jpeg"
              alt="Background 2"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div style={{ position: 'relative', height: '90vh' }}>
            <Image
              src="/images/bg3.jpeg"
              alt="Background 3"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Carousel>
      </Box>
      <Box 
        position="absolute" 
        inset={0} 
        zIndex={10} 
        bg={overlayBg}
      ></Box>
      <Flex className="relative z-20 min-h-[90vh] w-full items-center justify-center">
        <Box>
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
                fontSize={{ base: 'xs', md: 'sm' }}
                px={4}
                py={2}
                borderRadius="full"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                bg={badgeColors.blue}
                color={badgeTextColor}
                boxShadow="lg"
                border="1px solid"
                borderColor={useColorModeValue('blue.400', 'blue.600')}
              >
                <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }} color={badgeTextColor}>
                  4,500+
                </Text>
                <Text fontSize={{ base: '2xs', md: 'xs' }} color={badgeTextColor}>
                  Expatriates Arriving
                </Text>
              </MotionBadge>

              <MotionBadge
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={4}
                py={2}
                borderRadius="full"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                bg={badgeColors.green}
                color={badgeTextColor}
                boxShadow="lg"
                border="1px solid"
                borderColor={useColorModeValue('green.400', 'green.600')}
              >
                <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }} color={badgeTextColor}>
                  2026
                </Text>
                <Text fontSize={{ base: '2xs', md: 'xs' }} color={badgeTextColor}>
                  Airport Opening
                </Text>
              </MotionBadge>

              <MotionBadge
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={4}
                py={2}
                borderRadius="full"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                bg={badgeColors.red}
                color={badgeTextColor}
                boxShadow="lg"
                border="1px solid"
                borderColor={useColorModeValue('red.400', 'red.600')}
              >
                <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }} color={badgeTextColor}>
                  4+ Hours
                </Text>
                <Text fontSize={{ base: '2xs', md: 'xs' }} color={badgeTextColor}>
                  To Nearest Hospital
                </Text>
              </MotionBadge>

              <MotionBadge
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                fontSize={{ base: 'xs', md: 'sm' }}
                px={4}
                py={2}
                borderRadius="full"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                bg={badgeColors.yellow}
                color={badgeTextColor}
                boxShadow="lg"
                border="1px solid"
                borderColor={useColorModeValue('yellow.400', 'yellow.600')}
              >
                <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }} color={badgeTextColor}>
                  First
                </Text>
                <Text fontSize={{ base: '2xs', md: 'xs' }} color={badgeTextColor}>
                  Private Hospital
                </Text>
              </MotionBadge>
            </SimpleGrid>

            {/* Logo Section */}
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              mb={10}
              textAlign="center"
            >
              <Image
                src="/logo.png"
                width={200}
                height={160}
                alt="YMF Limited"
                className="mx-auto rounded-lg"
                style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
              />
            </MotionBox>
            <div className="w-full text-center lg:w-2/3">
              <Heading
                as="h1"
                fontSize={{ base: '3xl', sm: '5xl' }}
                fontWeight="medium"
                color={titleColor}
                mb={4}
                textAlign="center"
                lineHeight="tight"
              >
                Uganda's First Integrated Agro-Industrial Satellite Town
              </Heading>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color={subtitleColor}
                fontWeight="semibold"
                mb={4}
                textAlign="center"
              >
                Hoima's Strategic Development Opportunity
              </Text>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color={descriptionColor}
                mb={8}
                px={{ base: 4, md: 0 }}
                textAlign="center"
                lineHeight="relaxed"
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
                <Button
                  as={Link}
                  href="#investment"
                  size="lg"
                  colorScheme="blue"
                  px={8}
                  py={6}
                  fontSize={{ base: 'md', md: 'lg' }}
                  fontWeight="bold"
                  transition="all 0.3s"
                  boxShadow="xl"
                  _hover={{ transform: 'scale(1.05)' }}
                >
                  View Investment Opportunity
                </Button>
                <Button
                  as={Link}
                  href="#contact"
                  size="lg"
                  variant="outline"
                  borderColor={useColorModeValue('white', 'gray.300')}
                  color={useColorModeValue('white', 'gray.300')}
                  _hover={{ 
                    bg: useColorModeValue('whiteAlpha.200', 'whiteAlpha.300'), 
                    transform: 'scale(1.05)' 
                  }}
                  px={8}
                  py={6}
                  fontSize={{ base: 'md', md: 'lg' }}
                  fontWeight="bold"
                  transition="all 0.3s"
                >
                  Contact Us
                </Button>
              </Flex>
            </div>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default Hero
