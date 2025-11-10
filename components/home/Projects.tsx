'use client'

import { urlFor } from '@/lib/sanity'
import { Box, Flex, Heading, Text, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Project } from '../../typings'

interface SingleProject {
  name: string
  img: string
  excerpt: string
  slug: string
  investmentSize?: string
  phase?: number
  marketData?: string
  partnership?: string
}

const ProjectCard = ({ name, img, excerpt, slug, investmentSize, phase = 1, marketData, partnership }: SingleProject) => {
  const phaseColors: { [key: number]: string } = {
    1: 'green',
    2: 'blue',
    3: 'purple',
  }
  
  const cardBg = useColorModeValue('rgba(45, 55, 72, 0.6)', 'rgba(45, 55, 72, 0.8)')
  const cardHoverBg = useColorModeValue('gray.700', 'gray.600')
  const borderColor = useColorModeValue('gray.600', 'gray.500')
  const titleColor = useColorModeValue('white', 'white')
  const textColor = useColorModeValue('gray.300', 'gray.400')
  const marketDataColor = useColorModeValue('blue.300', 'blue.200')

  return (
    <Box w={{ base: 'full', md: '50%', xl: '33.333%' }} p={4}>
      <Link href={`/projects/${slug}`}>
        <Box
          bg={cardBg}
          borderRadius="lg"
          p={6}
          h="full"
          cursor="pointer"
          _hover={{
            transform: 'translateY(-8px)',
            boxShadow: '2xl',
            bg: cardHoverBg,
          }}
          transition="all 0.3s"
          border="1px solid"
          borderColor={borderColor}
          backdropFilter="blur(10px)"
        >
          <Box position="relative" mb={6}>
            <Image
              width={720}
              height={400}
              src={img}
              alt={name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            {investmentSize && (
              <Badge
                position="absolute"
                top={2}
                right={2}
                colorScheme="blue"
                fontSize="md"
                px={3}
                py={1}
                borderRadius="md"
                fontWeight="bold"
              >
                ${investmentSize}
              </Badge>
            )}
          </Box>
          <Flex gap={2} mb={3} flexWrap="wrap">
            <Badge colorScheme={phaseColors[phase]} fontSize="xs" px={2} py={1}>
              Phase {phase}
            </Badge>
            {partnership && (
              <Badge colorScheme="purple" fontSize="xs" px={2} py={1}>
                {partnership}
              </Badge>
            )}
          </Flex>
          <Text 
            fontSize="lg" 
            fontWeight="semibold" 
            color={titleColor}
            mb={2}
            lineHeight="tight"
          >
            {name}
          </Text>
          {marketData && (
            <Text 
              fontSize="sm" 
              color={marketDataColor}
              mb={2} 
              fontWeight="semibold"
            >
              📊 {marketData}
            </Text>
          )}
          <Text 
            fontSize="md" 
            color={textColor}
            lineHeight="relaxed"
          >
            {excerpt}
          </Text>
        </Box>
      </Link>
    </Box>
  )
}

interface ProjectProps {
  projects: [Project]
}

// Project categorization helper
const categorizeProjects = (projects: Project[]) => {
  const phase1Anchor = ['Hospital', 'Golf', 'Hotel', 'Housing', 'Apartments']
  const phase1B = ['Shopping', 'Sports', 'Arena', 'Motorcross', 'Education']
  const phase2Conservation = ['Game', 'Reserve', 'Conservation', 'Eco Tourism', 'Museum']
  const phase2Agriculture = ['Agri', 'Hemp', 'Bamboo']
  const phase3Community = ['Library', 'Technology']

  return {
    anchor: projects.filter(p => phase1Anchor.some(keyword => p.name.includes(keyword))),
    revenue: projects.filter(p => phase1B.some(keyword => p.name.includes(keyword))),
    conservation: projects.filter(p => phase2Conservation.some(keyword => p.name.includes(keyword))),
    agriculture: projects.filter(p => phase2Agriculture.some(keyword => p.name.includes(keyword))),
    community: projects.filter(p => phase3Community.some(keyword => p.name.includes(keyword))),
    other: projects.filter(p =>
      !phase1Anchor.some(k => p.name.includes(k)) &&
      !phase1B.some(k => p.name.includes(k)) &&
      !phase2Conservation.some(k => p.name.includes(k)) &&
      !phase2Agriculture.some(k => p.name.includes(k)) &&
      !phase3Community.some(k => p.name.includes(k))
    ),
  }
}

// Enhanced project data
const enhanceProject = (project: Project): SingleProject => {
  const baseProject = {
    slug: project.slug.current,
    name: project.name,
    img: urlFor(project.mainImage).url()!,
    excerpt: project.excerpt,
  }

  // Add investment size and market data based on project type
  if (project.name.toLowerCase().includes('hospital')) {
    return {
      ...baseProject,
      investmentSize: '25M',
      phase: 1,
      marketData: '400K+ potential patients',
      partnership: 'Iproplan Partner',
    }
  } else if (project.name.toLowerCase().includes('golf')) {
    return {
      ...baseProject,
      investmentSize: '10M',
      phase: 1,
      marketData: '4,500+ expat professionals',
    }
  } else if (project.name.toLowerCase().includes('hotel')) {
    return {
      ...baseProject,
      phase: 1,
      marketData: 'Airport opening 2026',
    }
  } else if (project.name.toLowerCase().includes('housing') || project.name.toLowerCase().includes('apartment')) {
    return {
      ...baseProject,
      phase: 1,
    }
  } else if (project.name.toLowerCase().includes('shopping') || project.name.toLowerCase().includes('sport')) {
    return {
      ...baseProject,
      phase: 1,
    }
  } else if (project.name.toLowerCase().includes('game') || project.name.toLowerCase().includes('conservation') || project.name.toLowerCase().includes('eco')) {
    return {
      ...baseProject,
      phase: 2,
      partnership: 'Wildlife Authority',
    }
  } else {
    return {
      ...baseProject,
      phase: 2,
    }
  }
}

function Projects({ projects }: ProjectProps) {
  const categorized = categorizeProjects(projects)
  
  const sectionBg = useColorModeValue('gray.900', 'gray.900')
  const headingColor = useColorModeValue('white', 'white')
  const subheadingColor = useColorModeValue('blue.400', 'blue.300')
  const textColor = useColorModeValue('gray.300', 'gray.400')
  const tabColor = useColorModeValue('gray.400', 'gray.500')
  const tabSelectedBg = useColorModeValue('blue.600', 'blue.500')

  const renderProjectGrid = (projectList: Project[]) => (
    <Flex flexWrap="wrap" mx={-4}>
      {projectList.map((project) => {
        const enhanced = enhanceProject(project)
        return (
          <ProjectCard
            key={project._id}
            {...enhanced}
          />
        )
      })}
    </Flex>
  )

  return (
    <Box 
      id="projects" 
      bg={sectionBg}
      py={24}
      minH="100vh"
    >
      <Box maxW="7xl" mx="auto" px={5}>
        <Flex mb={20} w="full" flexWrap="wrap" alignItems="center">
          <Box mb={{ base: 6, lg: 0 }} w={{ base: 'full', lg: '50%' }}>
            <Text 
              fontSize="xs" 
              fontWeight="medium" 
              letterSpacing="widest"
              color={subheadingColor}
              mb={2}
              textTransform="uppercase"
            >
              INTEGRATED DEVELOPMENT
            </Text>
            <Heading
              as="h1"
              fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}
              fontWeight="bold"
              color={headingColor}
              mb={4}
              lineHeight="tight"
            >
              Our Projects
            </Heading>
            <Box h={1} w={20} bg="blue.500" borderRadius="md" />
          </Box>
          <Text 
            w={{ base: 'full', lg: '50%' }}
            fontSize={{ base: 'md', lg: 'lg' }}
            lineHeight="relaxed" 
            color={textColor}
          >
            Through the undertaking of various projects and partnering with the most reliable service
            providers for each respective project, we intend to build our city as a self-sustainable,
            wealth-generating satellite town for its occupants and surrounding communities.
          </Text>
        </Flex>

        <Tabs variant="enclosed" colorScheme="blue" size="lg">
          <TabList mb={8} flexWrap="wrap" gap={2}>
            <Tab 
              _selected={{ color: 'white', bg: tabSelectedBg }}
              color={tabColor}
              fontWeight="semibold"
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 3 }}
            >
              Anchor Projects (Phase 1)
            </Tab>
            <Tab 
              _selected={{ color: 'white', bg: tabSelectedBg }}
              color={tabColor}
              fontWeight="semibold"
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 3 }}
            >
              Revenue Assets (Phase 1B)
            </Tab>
            <Tab 
              _selected={{ color: 'white', bg: tabSelectedBg }}
              color={tabColor}
              fontWeight="semibold"
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 3 }}
            >
              Conservation & Tourism
            </Tab>
            <Tab 
              _selected={{ color: 'white', bg: tabSelectedBg }}
              color={tabColor}
              fontWeight="semibold"
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 3 }}
            >
              Agricultural Development
            </Tab>
            <Tab 
              _selected={{ color: 'white', bg: tabSelectedBg }}
              color={tabColor}
              fontWeight="semibold"
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 3 }}
            >
              All Projects
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <Text 
                color={textColor} 
                mb={6} 
                fontSize={{ base: 'md', lg: 'lg' }}
                lineHeight="relaxed"
              >
                Investment-ready anchor projects forming the foundation of Phase 1 development.
                These projects are designed to generate immediate value and establish market presence.
              </Text>
              {renderProjectGrid(categorized.anchor.length > 0 ? categorized.anchor : projects.slice(0, 4))}
            </TabPanel>
            <TabPanel px={0}>
              <Text 
                color={textColor} 
                mb={6} 
                fontSize={{ base: 'md', lg: 'lg' }}
                lineHeight="relaxed"
              >
                Revenue-generating assets that complement anchor projects and diversify income streams.
              </Text>
              {renderProjectGrid(categorized.revenue.length > 0 ? categorized.revenue : projects.slice(4, 7))}
            </TabPanel>
            <TabPanel px={0}>
              <Text 
                color={textColor} 
                mb={6} 
                fontSize={{ base: 'md', lg: 'lg' }}
                lineHeight="relaxed"
              >
                Conservation and eco-tourism projects in partnership with Uganda Wildlife Authority.
              </Text>
              {renderProjectGrid(categorized.conservation.length > 0 ? categorized.conservation : projects.slice(7, 10))}
            </TabPanel>
            <TabPanel px={0}>
              <Text 
                color={textColor} 
                mb={6} 
                fontSize={{ base: 'md', lg: 'lg' }}
                lineHeight="relaxed"
              >
                Agricultural development projects leveraging our proven farming expertise.
              </Text>
              {renderProjectGrid(categorized.agriculture.length > 0 ? categorized.agriculture : projects.slice(10, 13))}
            </TabPanel>
            <TabPanel px={0}>
              <Text 
                color={textColor} 
                mb={6} 
                fontSize={{ base: 'md', lg: 'lg' }}
                lineHeight="relaxed"
              >
                Complete portfolio of 15+ integrated projects across all development phases.
              </Text>
              {renderProjectGrid(projects)}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}

export default Projects
