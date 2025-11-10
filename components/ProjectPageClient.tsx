'use client'

import { 
  Box, 
  Flex, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Badge, 
  Grid, 
  GridItem,
  Icon,
  useColorModeValue,
  VStack,
  HStack
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaMapMarkerAlt, FaDollarSign, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import { Project } from '../typings'

const MotionBox = motion(Box)
const MotionContainer = motion(Container)

interface ProjectPageClientProps {
  project: Project
  imageUrl: string
}

// Enhanced project data helper
const getProjectEnhancements = (projectName: string) => {
  const name = projectName.toLowerCase()
  
  if (name.includes('hospital')) {
    return {
      phase: 1,
      investmentSize: '$25M',
      timeline: '2024-2027',
      category: 'Healthcare Infrastructure',
      location: 'Hoima District, Uganda',
      marketData: '400K+ potential patients',
      keyFeatures: ['100-bed facility', 'Emergency services', 'Specialist consultations', 'Medical imaging'],
      partnership: 'Iproplan Partner'
    }
  } else if (name.includes('golf')) {
    return {
      phase: 1,
      investmentSize: '$10M',
      timeline: '2024-2026',
      category: 'Recreation & Sports',
      location: 'YMF Satellite Town',
      marketData: '4,500+ expat professionals',
      keyFeatures: ['18-hole championship course', 'Clubhouse', 'Training facilities', 'Pro shop']
    }
  } else if (name.includes('hotel')) {
    return {
      phase: 1,
      timeline: '2025-2027',
      category: 'Hospitality',
      location: 'Near Kabalega Airport',
      marketData: 'Airport opening 2026',
      keyFeatures: ['Luxury accommodation', 'Conference facilities', 'Restaurant', 'Spa services']
    }
  } else if (name.includes('housing') || name.includes('apartment')) {
    return {
      phase: 1,
      timeline: '2024-2026',
      category: 'Residential Development',
      location: 'YMF Satellite Town',
      keyFeatures: ['Modern housing units', 'Community amenities', 'Green spaces', 'Security features']
    }
  } else if (name.includes('shopping')) {
    return {
      phase: 1,
      timeline: '2025-2026',
      category: 'Commercial Development',
      location: 'Town Center',
      keyFeatures: ['Retail spaces', 'Food court', 'Entertainment zone', 'Parking facilities']
    }
  } else if (name.includes('game') || name.includes('conservation')) {
    return {
      phase: 2,
      timeline: '2027-2030',
      category: 'Conservation & Tourism',
      location: 'Protected Area',
      partnership: 'Uganda Wildlife Authority',
      keyFeatures: ['Wildlife protection', 'Eco-tourism', 'Research facilities', 'Community engagement']
    }
  }
  
  return {
    phase: 2,
    timeline: '2026-2030',
    category: 'Development Project',
    location: 'YMF Territory'
  }
}

export default function ProjectPageClient({ project, imageUrl }: ProjectPageClientProps) {
  const bg = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('blue.600', 'blue.400')

  const enhancements = getProjectEnhancements(project.name)

  return (
    <Box bg={bg} minH="100vh">
      {/* Hero Section */}
      <Box position="relative" h={{ base: '60vh', lg: '70vh' }} overflow="hidden">
        <Image
          src={imageUrl}
          alt={project.name}
          fill
          style={{ objectFit: 'cover' }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          display="flex"
          alignItems="end"
        >
          <Container maxW="7xl" pb={12}>
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <HStack mb={4} spacing={3} flexWrap="wrap">
                <Badge colorScheme="blue" px={3} py={1} fontSize="sm">
                  Phase {enhancements.phase}
                </Badge>
                <Badge colorScheme="green" px={3} py={1} fontSize="sm">
                  {enhancements.category}
                </Badge>
                {enhancements.partnership && (
                  <Badge colorScheme="purple" px={3} py={1} fontSize="sm">
                    {enhancements.partnership}
                  </Badge>
                )}
              </HStack>
              <Heading
                size={{ base: '2xl', lg: '4xl' }}
                color="white"
                fontWeight="bold"
                lineHeight="tight"
                mb={4}
              >
                {project.name}
              </Heading>
              <Text
                fontSize={{ base: 'lg', lg: 'xl' }}
                color="gray.200"
                maxW="3xl"
                lineHeight="relaxed"
              >
                {project.excerpt}
              </Text>
            </MotionBox>
          </Container>
        </Box>
      </Box>

      {/* Main Content */}
      <MotionContainer
        maxW="7xl"
        py={16}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={12}>
          {/* Project Details */}
          <GridItem>
            <VStack align="stretch" spacing={8}>
              {/* Navigation */}
              <Box>
                <Link href="/#projects">
                  <Button variant="ghost" leftIcon={<FaArrowLeft />} size="sm">
                    Back to Projects
                  </Button>
                </Link>
              </Box>

              {/* Description */}
              <Box bg={cardBg} p={8} borderRadius="xl" border="1px" borderColor={borderColor}>
                <Heading size="lg" color={headingColor} mb={6}>
                  Project Overview
                </Heading>
                <Box color={textColor}>
                  <PortableText
                    value={(project.description as any) || []}
                    components={{
                      block: {
                        h1: ({ children }) => (
                          <Heading as="h1" size="lg" my={6} color={headingColor}>
                            {children}
                          </Heading>
                        ),
                        h2: ({ children }) => (
                          <Heading as="h2" size="md" my={5} color={headingColor}>
                            {children}
                          </Heading>
                        ),
                        normal: ({ children }) => (
                          <Text my={4} lineHeight="tall">
                            {children}
                          </Text>
                        ),
                      },
                      list: {
                        bullet: ({ children }) => (
                          <Box as="ul" ml={6} my={4} sx={{ listStyle: 'disc' }}>
                            {children}
                          </Box>
                        ),
                      },
                      listItem: {
                        bullet: ({ children }) => (
                          <Box as="li" my={2}>
                            {children}
                          </Box>
                        ),
                      },
                      marks: {
                        link: ({ children, value }) => (
                          <Text 
                            as="a"
                            href={value?.href} 
                            color={accentColor}
                            textDecoration="underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            _hover={{ color: 'blue.500' }}
                          >
                            {children}
                          </Text>
                        ),
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Key Features */}
              {enhancements.keyFeatures && (
                <Box bg={cardBg} p={8} borderRadius="xl" border="1px" borderColor={borderColor}>
                  <Heading size="lg" color={headingColor} mb={6}>
                    Key Features
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    {enhancements.keyFeatures.map((feature, index) => (
                      <Box key={index} p={4} bg={bg} borderRadius="md" border="1px" borderColor={borderColor}>
                        <Text fontWeight="medium" color={headingColor}>
                          {feature}
                        </Text>
                      </Box>
                    ))}
                  </Grid>
                </Box>
              )}
            </VStack>
          </GridItem>

          {/* Project Info Sidebar */}
          <GridItem>
            <Box position="sticky" top={8}>
              <VStack spacing={6}>
                {/* Project Stats */}
                <Box bg={cardBg} p={6} borderRadius="xl" border="1px" borderColor={borderColor} w="full">
                  <Heading size="md" color={headingColor} mb={6}>
                    Project Information
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    {enhancements.investmentSize && (
                      <HStack>
                        <Icon as={FaDollarSign} color={accentColor} />
                        <Box>
                          <Text fontSize="sm" color={textColor}>Investment Size</Text>
                          <Text fontWeight="bold" color={headingColor}>{enhancements.investmentSize}</Text>
                        </Box>
                      </HStack>
                    )}
                    
                    <HStack>
                      <Icon as={FaMapMarkerAlt} color={accentColor} />
                      <Box>
                        <Text fontSize="sm" color={textColor}>Location</Text>
                        <Text fontWeight="bold" color={headingColor}>{enhancements.location}</Text>
                      </Box>
                    </HStack>

                    <HStack>
                      <Icon as={FaCalendarAlt} color={accentColor} />
                      <Box>
                        <Text fontSize="sm" color={textColor}>Timeline</Text>
                        <Text fontWeight="bold" color={headingColor}>{enhancements.timeline}</Text>
                      </Box>
                    </HStack>

                    {enhancements.marketData && (
                      <HStack>
                        <Icon as={FaUsers} color={accentColor} />
                        <Box>
                          <Text fontSize="sm" color={textColor}>Market Data</Text>
                          <Text fontWeight="bold" color={headingColor}>{enhancements.marketData}</Text>
                        </Box>
                      </HStack>
                    )}
                  </VStack>
                </Box>

                {/* CTA Section */}
                <Box bg={cardBg} p={6} borderRadius="xl" border="1px" borderColor={borderColor} w="full">
                  <Heading size="md" color={headingColor} mb={4}>
                    Investment Opportunity
                  </Heading>
                  <Text color={textColor} mb={6}>
                    Interested in learning more about this project? Get in touch with our investment team.
                  </Text>
                  <VStack spacing={3}>
                    <Button colorScheme="blue" size="lg" w="full">
                      Request Information
                    </Button>
                    <Button variant="outline" size="lg" w="full">
                      Schedule Consultation
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </MotionContainer>
    </Box>
  )
}