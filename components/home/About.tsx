'use client'

import { Avatar, Box, Flex, Heading, Text, Container, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

function About() {
  const sectionBg = useColorModeValue('gray.50', 'gray.800')
  const headingColor = useColorModeValue('gray.800', 'white')
  const subheadingColor = useColorModeValue('blue.600', 'blue.300')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const avatarBg = useColorModeValue('gray.100', 'gray.700')
  
  return (
    <Box id="about" bg={sectionBg} py={20}>
      <Container maxW="7xl">
        <Flex mb={20} w="full" direction="column" textAlign="center">
          <Text 
            fontSize="xs" 
            fontWeight="medium" 
            letterSpacing="widest"
            color={subheadingColor}
            mb={2}
            textTransform="uppercase"
          >
            YMF
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}
            fontWeight="bold"
            color={headingColor}
            mb={6}
            lineHeight="tight"
          >
            About Us
          </Heading>
          <Text 
            fontSize={{ base: 'md', lg: 'lg' }}
            color={textColor}
            lineHeight="relaxed"
            maxW="4xl"
            mx="auto"
            px={{ base: 4, md: 0 }}
          >
            Our ultimate goal is to make use of the 2 square miles acquired by Mr
            Yesero Mugenyi for the undertaking of various projects, to create a
            production-satellite town with the capacity for commercial,
            industrial, nature reserve and other productions, distinct from that
            of the parent town, - a new Kikwite Town in Hoima District
          </Text>
        </Flex>
        <Flex direction="column" align="center">
          <Box w={{ base: 'full', lg: '4xl' }} mx="auto">
            <Box 
              h={64} 
              overflow="hidden" 
              borderRadius="lg"
              mb={10}
              boxShadow="xl"
            >
              <Image
                alt="YMF Foundation"
                width={1200}
                height={500}
                src="/images/bg2.jpeg"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Box>
            
            <Flex 
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'center', md: 'flex-start' }}
              gap={8}
              mt={10}
            >
              {/* Profile Section */}
              <Box 
                textAlign="center" 
                w={{ base: 'full', md: '300px' }}
                flexShrink={0}
              >
                <Box 
                  display="inline-flex" 
                  alignItems="center" 
                  justifyContent="center"
                  bg={avatarBg}
                  borderRadius="full"
                  p={2}
                  mb={4}
                >
                  <Avatar
                    size="xl"
                    name="Ada Mugenyi"
                    src="/images/team/mom1.jpeg"
                  />
                </Box>
                <Flex direction="column" align="center">
                  <Text 
                    fontSize="xl" 
                    fontWeight="semibold"
                    color={headingColor}
                    mb={2}
                  >
                    Ada Mugenyi
                  </Text>
                  <Box 
                    h={1} 
                    w={12} 
                    bg={subheadingColor}
                    borderRadius="full"
                    mb={4}
                  />
                  <Text 
                    fontSize="md" 
                    color={textColor}
                    fontWeight="medium"
                  >
                    Managing Director
                  </Text>
                </Flex>
              </Box>
              
              {/* Content Section */}
              <Box 
                flex={1}
                pt={{ base: 8, md: 0 }}
                pl={{ base: 0, md: 8 }}
                borderLeft={{ base: 'none', md: '1px solid' }}
                borderTop={{ base: '1px solid', md: 'none' }}
                borderColor={borderColor}
              >
                <Text 
                  fontSize={{ base: 'md', lg: 'lg' }}
                  lineHeight="relaxed"
                  color={textColor}
                  textAlign={{ base: 'center', md: 'left' }}
                >
                  This will be achieved by our undertaking of various projects,
                  some of which are already in motion, including building; a golf
                  course, hotel and accommodation, hospital and medical facilities,
                  game reserve and animal conservation facilities, shopping
                  centers, a sports arena, schools and universities etc. (Find
                  full project list further below)
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default About
