'use client'

import { Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

function Hoima() {
  const bg = useColorModeValue('gray.50', 'gray.900')
  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  
  return (
    <Box id="hoima" bg={bg} py={24}>
      <Flex 
        maxW="7xl" 
        mx="auto" 
        px={8} 
        direction={{ base: 'column', lg: 'row' }} 
        align="center" 
        gap={12}
      >
        <Box flex={1} maxW={{ base: 'full', lg: '50%' }}>
          <Heading
            as="h2"
            size={{ base: 'xl', md: '2xl' }}
            color={headingColor}
            mb={6}
            lineHeight="tight"
          >
            Hoima District
          </Heading>
          <Text 
            fontSize={{ base: 'md', lg: 'lg' }}
            color={textColor}
            mb={6}
            lineHeight="relaxed"
          >
            The Yesero Mugenyi Foundation was founded by Mr Yesero Mugenyi, and
            shall be carried on by his descendants. Together we have committed
            to build an entirely self sufficient Satellite Town upon the 2
            square miles of land Mr Yesero Mugenyi labored so hard to acquire for
            the sake of his children and grandchildren.
          </Text>
          <Text 
            fontSize={{ base: 'md', lg: 'lg' }}
            color={textColor}
            lineHeight="relaxed"
          >
            The Y.M.F is currently being pushed forward by Mr Yesero Mugenyi's
            youngest daughter, Ms Ada Mugenyi. Alongside her siblings, her
            children, her nieces and nephews: we shall all be working hand in
            hand to accomplish launching all our projects by 2030.
          </Text>
        </Box>
        <Box 
          flex={1} 
          maxW={{ base: 'full', lg: '50%' }}
          display="flex"
          justifyContent="center"
        >
          <Image
            className="rounded-lg shadow-xl object-cover"
            alt="Hoima District - Yesero Mugenyi Foundation"
            width={600}
            height={450}
            src="/images/hoima1.png"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default Hoima
