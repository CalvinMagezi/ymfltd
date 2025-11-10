'use client'

import { Box, Flex, Heading, Text, useColorModeValue, Container } from '@chakra-ui/react'
import React from 'react'
import ContactForm from '../ContactForm'

function Contact() {
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const headingColor = useColorModeValue('gray.800', 'white')
  const subheadingColor = useColorModeValue('blue.600', 'blue.300')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const mapBg = useColorModeValue('gray.100', 'gray.800')
  
  return (
    <Box id="contact" bg={sectionBg} position="relative" py={24}>
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
            GET IN TOUCH
          </Text>
          <Heading 
            as="h1" 
            fontSize={{ base: '2xl', sm: '4xl' }}
            fontWeight="bold"
            color={headingColor}
            mb={4}
            lineHeight="tight"
          >
            Investor Contact
          </Heading>
          <Text 
            fontSize="md" 
            lineHeight="relaxed" 
            color={textColor}
            maxW="2xl"
            mx="auto"
          >
            Interested in learning more about this transformative investment opportunity?
            Reach out to discuss how you can be part of Uganda's most ambitious development project.
          </Text>
        </Flex>
        <Flex className="flex-wrap pb-10 sm:flex-nowrap">
          <Box 
            position="relative" 
            display="flex" 
            w="full" 
            flexGrow={1}
            alignItems="flex-end" 
            justifyContent="flex-start" 
            overflow="hidden" 
            borderRadius="lg" 
            bg={mapBg}
            p={10} 
            mr={{ base: 0, sm: 10 }}
            mb={{ base: 10, sm: 0 }}
          >
            <iframe
              width="100%"
              height="100%"
              title="map"
              className="absolute inset-0"
              frameBorder="0"
              scrolling="no"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31908.574741509892!2d31.33386599885666!3d1.432236133148158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sHoima%2C%20Uganda.%20Plot%2026%2C%20Old%20Toro%20Road!5e0!3m2!1sen!2sae!4v1644751737245!5m2!1sen!2sae"
              style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.16)' }}
            ></iframe>
            <Box 
              position="relative" 
              display="flex" 
              flexWrap="wrap" 
              borderRadius="md" 
              bg="gray.900" 
              py={6} 
              boxShadow="md"
            >
              <Box px={6} w={{ base: 'full', lg: '50%' }}>
                <Text 
                  fontSize="xs" 
                  fontWeight="semibold" 
                  letterSpacing="widest" 
                  color="white"
                  textTransform="uppercase"
                >
                  ADDRESS
                </Text>
                <Text mt={1} color="white">
                  Hoima, Uganda. Plot 26, Old Toro Road
                </Text>
              </Box>
              <Box mt={{ base: 4, lg: 0 }} px={6} w={{ base: 'full', lg: '50%' }}>
                <Text 
                  fontSize="xs" 
                  fontWeight="semibold" 
                  letterSpacing="widest" 
                  color="white"
                  textTransform="uppercase"
                >
                  INVESTOR RELATIONS
                </Text>
                <Text
                  as="a"
                  href="mailto:ada@ymfltd.com"
                  color={subheadingColor}
                  lineHeight="relaxed"
                  fontWeight="semibold"
                  _hover={{ textDecoration: 'underline' }}
                >
                  ada@ymfltd.com
                </Text>
                <Text 
                  fontSize="xs" 
                  fontWeight="semibold" 
                  letterSpacing="widest" 
                  color="white"
                  mt={4}
                  textTransform="uppercase"
                >
                  PHONE
                </Text>
                <Text
                  as="a"
                  href="tel:+256775599533"
                  color="white"
                  lineHeight="relaxed"
                  _hover={{ textDecoration: 'underline' }}
                >
                  +256 77 55 99 533
                </Text>
              </Box>
            </Box>
          </Box>
          <ContactForm />
        </Flex>
      </Container>
    </Box>
  )
}

export default Contact
