'use client'

import { Box, Flex, Heading, Text, SimpleGrid, useColorModeValue, Container } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const MotionBox = motion(Box)

interface StatCardProps {
  number: string
  label: string
  context: string
  source: string
  color: string
  delay: number
  isNumber?: boolean
}

const StatCard = ({ number, label, context, source, color, delay, isNumber = true }: StatCardProps) => {
  const [count, setCount] = useState(0)
  const targetNumber = isNumber ? parseInt(number.replace(/,/g, '')) : 0

  useEffect(() => {
    if (!isNumber) return

    let start = 0
    const duration = 2000 // 2 seconds
    const increment = targetNumber / (duration / 16) // 60fps

    const timer = setInterval(() => {
      start += increment
      if (start >= targetNumber) {
        setCount(targetNumber)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [targetNumber, isNumber])

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      // @ts-ignore
      transition={{ duration: 0.5, delay }}
      bg="white"
      _dark={{ bg: 'gray.800' }}
      p={8}
      borderRadius="xl"
      boxShadow="xl"
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: '2xl',
      }}
      sx={{ transition: 'all 0.3s' }}
      borderTop="4px"
      borderColor={`${color}.500`}
      textAlign="center"
    >
      <Text
        fontSize="6xl"
        fontWeight="black"
        color={`${color}.600`}
        _dark={{ color: `${color}.400` }}
        lineHeight="1"
        mb={2}
      >
        {isNumber ? count.toLocaleString() : number}
      </Text>
      <Heading
        as="h3"
        size="md"
        mb={3}
        color="gray.900"
        _dark={{ color: 'white' }}
        fontWeight="bold"
      >
        {label}
      </Heading>
      <Text
        color="gray.600"
        _dark={{ color: 'gray.400' }}
        fontSize="sm"
        mb={3}
        fontWeight="semibold"
      >
        {context}
      </Text>
      <Text
        color="gray.500"
        _dark={{ color: 'gray.500' }}
        fontSize="xs"
        fontStyle="italic"
      >
        Source: {source}
      </Text>
    </MotionBox>
  )
}

function MarketOpportunity() {
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const headingColor = useColorModeValue('gray.800', 'white')
  const subheadingColor = useColorModeValue('blue.600', 'blue.300')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const calloutBg = useColorModeValue('blue.600', 'blue.700')
  const calloutText = useColorModeValue('white', 'white')
  
  return (
    <Box id="market-data" bg={sectionBg} py={24}>
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
            DATA-DRIVEN INSIGHTS
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
            fontWeight="bold"
            color={headingColor}
            mb={6}
            lineHeight="tight"
          >
            Market Opportunity by Numbers
          </Heading>
          <Text 
            fontSize={{ base: 'md', lg: 'lg' }}
            lineHeight="relaxed" 
            color={textColor}
            maxW="2xl"
            mx="auto"
          >
            Comprehensive market analysis reveals unprecedented opportunity in Uganda's
            fastest-growing region with strong fundamentals and minimal competition.
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <StatCard
            number="150,000"
            label="Hoima City Population"
            context="400,000+ in district"
            source="Uganda Bureau of Statistics"
            color="blue"
            delay={0.1}
          />
          <StatCard
            number="0"
            label="Large Private Hospitals in Region"
            context="Nearest 100-bed: 4+ hours away"
            source="Ministry of Health mapping"
            color="red"
            delay={0.2}
          />
          <StatCard
            number="4,500+"
            label="Expatriates Arriving"
            context="High-income oil & gas professionals"
            source="Petroleum Authority of Uganda"
            color="green"
            delay={0.3}
          />
          <StatCard
            number="1,280"
            label="Acres Secured"
            context="Prime location, legally owned"
            source="Land secured since 2011"
            color="purple"
            delay={0.4}
          />
          <StatCard
            number="15"
            label="Integrated Components"
            context="Multi-revenue stream model"
            source="YMF Project Portfolio"
            color="orange"
            delay={0.5}
          />
          <StatCard
            number="2027"
            label="Phase 1 Target Completion"
            context="Anchor projects operational"
            source="Project Timeline"
            color="teal"
            delay={0.6}
            isNumber={false}
          />
        </SimpleGrid>

        <Box 
          mt={16} 
          bg={calloutBg}
          p={8} 
          borderRadius="xl" 
          color={calloutText} 
          textAlign="center"
          boxShadow="2xl"
        >
          <Heading 
            size="lg" 
            mb={4}
            color={calloutText}
            fontSize={{ base: '2xl', md: '3xl' }}
          >
            Why Now? The Perfect Storm of Opportunity
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={8}>
            <Box>
              <Text 
                fontSize="2xl" 
                fontWeight="bold" 
                mb={2}
                color={calloutText}
              >
                🛢️ Oil Discovery
              </Text>
              <Text 
                fontSize="sm"
                color={calloutText}
                opacity={0.9}
              >
                Largest oil discovery in sub-Saharan Africa bringing massive infrastructure investment
              </Text>
            </Box>
            <Box>
              <Text 
                fontSize="2xl" 
                fontWeight="bold" 
                mb={2}
                color={calloutText}
              >
                ✈️ Airport Opening
              </Text>
              <Text 
                fontSize="sm"
                color={calloutText}
                opacity={0.9}
              >
                International airport transforms regional accessibility and tourism potential
              </Text>
            </Box>
            <Box>
              <Text 
                fontSize="2xl" 
                fontWeight="bold" 
                mb={2}
                color={calloutText}
              >
                🏥 Healthcare Gap
              </Text>
              <Text 
                fontSize="sm"
                color={calloutText}
                opacity={0.9}
              >
                Critical shortage of quality healthcare creates captive market with zero competition
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  )
}

export default MarketOpportunity
