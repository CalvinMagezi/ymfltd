import { Box, Flex, Heading, Text, SimpleGrid } from '@chakra-ui/react'
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
  return (
    <Box id="market-data" className="body-font py-24 bg-gray.50" _dark={{ bg: 'gray.900' }}>
      <Box className="container mx-auto px-5">
        <Flex className="mb-20 w-full flex-col text-center">
          <Text className="title-font mb-2 text-xs font-medium tracking-widest text-blue.500">
            DATA-DRIVEN INSIGHTS
          </Text>
          <Heading
            as="h2"
            className="title-font mb-4 text-3xl font-medium sm:text-4xl"
          >
            Market Opportunity by Numbers
          </Heading>
          <Text className="mx-auto text-base leading-relaxed text-gray.600 lg:w-2/3" _dark={{ color: 'gray.300' }}>
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

        <Box mt={16} bg="blue.600" p={8} borderRadius="xl" color="white" textAlign="center">
          <Heading size="lg" mb={4}>
            Why Now? The Perfect Storm of Opportunity
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={8}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" mb={2}>🛢️ Oil Discovery</Text>
              <Text fontSize="sm">
                Largest oil discovery in sub-Saharan Africa bringing massive infrastructure investment
              </Text>
            </Box>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" mb={2}>✈️ Airport Opening</Text>
              <Text fontSize="sm">
                International airport transforms regional accessibility and tourism potential
              </Text>
            </Box>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" mb={2}>🏥 Healthcare Gap</Text>
              <Text fontSize="sm">
                Critical shortage of quality healthcare creates captive market with zero competition
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  )
}

export default MarketOpportunity
