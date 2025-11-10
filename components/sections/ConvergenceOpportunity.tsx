'use client'

import { Box, Flex, Heading, Text, SimpleGrid, Icon, useColorModeValue, Container } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaIndustry, FaPlane, FaHospital, FaTrophy } from 'react-icons/fa'

const MotionBox = motion(Box)

interface OpportunityCardProps {
  icon: any
  stat: string
  title: string
  description: string
  color: string
  delay: number
}

const OpportunityCard = ({ icon, stat, title, description, color, delay }: OpportunityCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const titleColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  
  return (
  <MotionBox
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    // @ts-ignore
    transition={{ duration: 0.6, delay }}
    bg={cardBg}
    bgGradient={useColorModeValue(
      `linear(to-br, white, ${color}.50)`, 
      `linear(to-br, gray.800, ${color}.900)`
    )}
    p={8}
    borderRadius="xl"
    boxShadow="2xl"
    _hover={{
      transform: 'translateY(-8px)',
      boxShadow: '2xl',
      bg: cardHoverBg,
    }}
    sx={{ transition: 'all 0.3s' }}
    border="1px"
    borderColor={borderColor}
  >
    <Flex direction="column" align="center" textAlign="center">
      <Icon 
        as={icon} 
        w={12} 
        h={12} 
        color={useColorModeValue(`${color}.600`, `${color}.400`)} 
        mb={4} 
      />
      <Text
        fontSize="4xl"
        fontWeight="bold"
        color={useColorModeValue(`${color}.700`, `${color}.300`)}
        mb={2}
      >
        {stat}
      </Text>
      <Heading
        as="h3"
        size="md"
        mb={4}
        color={titleColor}
      >
        {title}
      </Heading>
      <Text color={textColor} fontSize="sm" lineHeight="tall">
        {description}
      </Text>
    </Flex>
  </MotionBox>
  )
}

function ConvergenceOpportunity() {
  const sectionBg = useColorModeValue('gray.100', 'gray.900')
  const headingColor = useColorModeValue('gray.800', 'white')
  const subheadingColor = useColorModeValue('blue.600', 'blue.300')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const quoteColor = useColorModeValue('gray.500', 'gray.400')
  
  return (
    <Box id="convergence" bg={sectionBg} py={24}>
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
            STRATEGIC TIMING
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: '3xl', sm: '4xl', lg: '5xl' }}
            fontWeight="bold"
            color={headingColor}
            mb={6}
            lineHeight="tight"
          >
            The Convergence Opportunity
          </Heading>
          <Text 
            fontSize={{ base: 'md', lg: 'lg' }}
            lineHeight="relaxed" 
            color={textColor}
            maxW="2xl"
            mx="auto"
          >
            A unique alignment of infrastructure development, economic growth, and critical healthcare
            needs creates an unprecedented investment opportunity in Uganda's emerging oil region.
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <OpportunityCard
            icon={FaIndustry}
            stat="4,500+"
            title="Oil & Gas Boom"
            description="Expatriates arriving for Kingfisher & Tilenga projects, creating demand for world-class healthcare, hospitality, and recreation facilities."
            color="blue"
            delay={0.1}
          />
          <OpportunityCard
            icon={FaPlane}
            stat="2026"
            title="Infrastructure Development"
            description="Kabalega International Airport opening brings unprecedented tourism and business travel to the region, driving demand for premium services."
            color="green"
            delay={0.2}
          />
          <OpportunityCard
            icon={FaHospital}
            stat="4+ Hours"
            title="Healthcare Crisis"
            description="Nearest 100-bed hospital is 4+ hours away. Serving 150K city population and 400K+ district residents with zero large private healthcare facilities."
            color="red"
            delay={0.3}
          />
          <OpportunityCard
            icon={FaTrophy}
            stat="#1"
            title="First-Mover Advantage"
            description="Only planned large-scale private hospital in the region. Zero direct competition in category with a narrow timing window to capture market."
            color="yellow"
            delay={0.4}
          />
        </SimpleGrid>

        <Box mt={16} textAlign="center">
          <Text 
            fontSize="lg" 
            color={quoteColor} 
            fontStyle="italic"
            maxW="2xl"
            mx="auto"
            lineHeight="relaxed"
          >
            "When infrastructure, economic development, and critical needs converge,
            extraordinary investment opportunities emerge."
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default ConvergenceOpportunity
