import { urlFor } from '@/lib/sanity'
import { Box, Flex, Heading, Text, Badge, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Project } from 'typings'

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

  return (
    <Link href={`/projects/${slug}`}>
      <Box className="cursor-pointer p-4 md:w-1/2 xl:w-1/3">
        <Box
          className="rounded-lg bg-gray-800 bg-opacity-40 p-6 h-full"
          _hover={{
            transform: 'translateY(-8px)',
            boxShadow: '2xl',
            bg: 'gray.700',
          }}
          transition="all 0.3s"
          border="1px"
          borderColor="gray.700"
        >
          <Box position="relative">
            <Image
              width="720"
              height="400"
              className="mb-6 rounded object-cover object-center"
              src={img}
              alt="content"
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
              >
                ${investmentSize}
              </Badge>
            )}
          </Box>
          <Flex gap={2} mb={3} flexWrap="wrap">
            <Badge colorScheme={phaseColors[phase]} fontSize="xs">
              Phase {phase}
            </Badge>
            {partnership && (
              <Badge colorScheme="purple" fontSize="xs">
                {partnership}
              </Badge>
            )}
          </Flex>
          <Text className="title-font mb-2 text-lg font-medium ">{name}</Text>
          {marketData && (
            <Text className="text-sm text-blue-300 mb-2 font-semibold">
              📊 {marketData}
            </Text>
          )}
          <Text className="text-base leading-relaxed text-gray-400">{excerpt}</Text>
        </Box>
      </Box>
    </Link>
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

  const renderProjectGrid = (projectList: Project[]) => (
    <Flex className="-m-4 flex-wrap">
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
    <Box id="projects" className="body-font bg-gray-900 py-24">
      <Box className="container mx-auto px-5">
        <Flex className="mb-20 w-full flex-wrap">
          <Box className="mb-6 w-full lg:mb-0 lg:w-1/2">
            <Text className="title-font mb-2 text-xs font-medium tracking-widest text-blue-400">
              INTEGRATED DEVELOPMENT
            </Text>
            <Heading
              as="h1"
              className="title-font mb-2 text-2xl font-medium text-white sm:text-3xl"
            >
              Our Projects
            </Heading>
            <div className="h-1 w-20 rounded bg-blue-500"></div>
          </Box>
          <Text className="w-full leading-relaxed text-gray-300 lg:w-1/2">
            Through the undertaking of various projects and partnering with the most reliable service
            providers for each respective project, we intend to build our city as a self-sustainable,
            wealth-generating satellite town for its occupants and surrounding communities.
          </Text>
        </Flex>

        <Tabs variant="enclosed" colorScheme="blue">
          <TabList mb={8} flexWrap="wrap">
            <Tab _selected={{ color: 'white', bg: 'blue.600' }}>
              Anchor Projects (Phase 1)
            </Tab>
            <Tab _selected={{ color: 'white', bg: 'blue.600' }}>
              Revenue Assets (Phase 1B)
            </Tab>
            <Tab _selected={{ color: 'white', bg: 'blue.600' }}>
              Conservation & Tourism
            </Tab>
            <Tab _selected={{ color: 'white', bg: 'blue.600' }}>
              Agricultural Development
            </Tab>
            <Tab _selected={{ color: 'white', bg: 'blue.600' }}>
              All Projects
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Text color="gray.300" mb={6}>
                Investment-ready anchor projects forming the foundation of Phase 1 development.
                These projects are designed to generate immediate value and establish market presence.
              </Text>
              {renderProjectGrid(categorized.anchor.length > 0 ? categorized.anchor : projects.slice(0, 4))}
            </TabPanel>
            <TabPanel>
              <Text color="gray.300" mb={6}>
                Revenue-generating assets that complement anchor projects and diversify income streams.
              </Text>
              {renderProjectGrid(categorized.revenue.length > 0 ? categorized.revenue : projects.slice(4, 7))}
            </TabPanel>
            <TabPanel>
              <Text color="gray.300" mb={6}>
                Conservation and eco-tourism projects in partnership with Uganda Wildlife Authority.
              </Text>
              {renderProjectGrid(categorized.conservation.length > 0 ? categorized.conservation : projects.slice(7, 10))}
            </TabPanel>
            <TabPanel>
              <Text color="gray.300" mb={6}>
                Agricultural development projects leveraging our proven farming expertise.
              </Text>
              {renderProjectGrid(categorized.agriculture.length > 0 ? categorized.agriculture : projects.slice(10, 13))}
            </TabPanel>
            <TabPanel>
              <Text color="gray.300" mb={6}>
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
