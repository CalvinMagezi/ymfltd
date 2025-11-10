'use client'

import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'

const MotionBox = motion(Box)

interface TimelineItemProps {
  year: string
  title: string
  description: string
  highlights: string[]
  delay: number
  isLast?: boolean
}

const TimelineItem = ({ year, title, description, highlights, delay, isLast = false }: TimelineItemProps) => (
  <MotionBox
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    position="relative"
    pl={{ base: 8, md: 12 }}
    pb={isLast ? 0 : 12}
  >
    {/* Timeline dot */}
    <Box
      position="absolute"
      left={{ base: 0, md: 2 }}
      top={2}
      w={6}
      h={6}
      borderRadius="full"
      bg="blue.500"
      border="4px"
      borderColor="white"
      _dark={{ borderColor: 'gray.900' }}
      boxShadow="lg"
      zIndex={2}
    />

    {/* Timeline line */}
    {!isLast && (
      <Box
        position="absolute"
        left={{ base: 2.5, md: 4.5 }}
        top={8}
        w="2px"
        h="calc(100% - 2rem)"
        bg="blue.300"
        _dark={{ bg: 'blue.700' }}
      />
    )}

    {/* Content */}
    <Box
      bg="white"
      _dark={{ bg: 'gray.800' }}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      _hover={{
        transform: 'translateX(8px)',
        boxShadow: 'xl',
      }}
      transition="all 0.3s"
    >
      <Flex align="center" mb={3}>
        <Text
          fontSize="2xl"
          fontWeight="black"
          color="blue.600"
          _dark={{ color: 'blue.400' }}
          mr={4}
        >
          {year}
        </Text>
        <Heading as="h3" size="md" color="gray.900" _dark={{ color: 'white' }}>
          {title}
        </Heading>
      </Flex>
      <Text color="gray.600" _dark={{ color: 'gray.300' }} mb={4}>
        {description}
      </Text>
      <Box>
        {highlights.map((highlight, index) => (
          <Flex key={index} align="start" mb={2}>
            <FaCheckCircle
              style={{ marginRight: '8px', marginTop: '4px', flexShrink: 0 }}
              color="#48BB78"
            />
            <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.400' }}>
              {highlight}
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  </MotionBox>
)

function TrackRecord() {
  return (
    <Box id="track-record" className="body-font py-24 bg-white" _dark={{ bg: 'gray.900' }}>
      <Box className="container mx-auto px-5">
        <Flex className="mb-20 w-full flex-col text-center">
          <Text className="title-font mb-2 text-xs font-medium tracking-widest text-blue.500">
            PROVEN EXECUTION
          </Text>
          <Heading
            as="h2"
            className="title-font mb-4 text-3xl font-medium sm:text-4xl"
          >
            Track Record of Success
          </Heading>
          <Text className="mx-auto text-base leading-relaxed text-gray.600 lg:w-2/3" _dark={{ color: 'gray.300' }}>
            From visionary land acquisition to operational success, our journey demonstrates
            the commitment and capability to execute on ambitious development projects.
          </Text>
        </Flex>

        <Box maxW="4xl" mx="auto">
          <TimelineItem
            year="2011"
            title="Foundation Established"
            description="The Yesero Mugenyi Foundation was officially incorporated with a bold vision to transform 1,280 acres into Uganda's premier integrated satellite town."
            highlights={[
              "Secured 1,280 acres of prime land southeast of Hoima town",
              "Established legal entity and governance structure",
              "Initiated long-term master planning and development strategy",
            ]}
            delay={0.1}
          />

          <TimelineItem
            year="2011-2024"
            title="Operational Dairy Farm"
            description="Demonstrated execution capability through successful operation of a 126-cow dairy farm, generating consistent revenue and proving land productivity."
            highlights={[
              "Built and operated 126-cow dairy facility",
              "Generated revenue continuously for 13+ years",
              "Established agricultural expertise and local relationships",
              "Proved land quality and agricultural viability",
            ]}
            delay={0.2}
          />

          <TimelineItem
            year="2024"
            title="Strategic Partnerships Secured"
            description="Formalized critical partnerships with world-class organizations and government entities to validate our vision and ensure project success."
            highlights={[
              "Signed MOU with Iproplan (German healthcare construction specialists)",
              "Secured Ministry of Health partnership and support",
              "Established National Medical Stores supply agreement",
              "Formed Uganda Wildlife Authority conservation collaboration",
            ]}
            delay={0.3}
          />

          <TimelineItem
            year="2025"
            title="Series A Investment Phase"
            description="Launching $35M Series A raise to fund Phase 1 anchor projects including 100-bed hospital, championship golf course, and 5-star hotel."
            highlights={[
              "Series A investment round opening Q1 2025",
              "Medical Director recruitment beginning Q4 2025",
              "Phase 1 development construction start planned",
              "Target completion: 2027 for anchor projects",
            ]}
            delay={0.4}
            isLast={true}
          />
        </Box>

        <Box mt={16} bg="blue.50" _dark={{ bg: 'blue.900' }} p={8} borderRadius="xl" textAlign="center">
          <Heading size="lg" mb={4} color="gray.900" _dark={{ color: 'white' }}>
            13+ Years of Commitment
          </Heading>
          <Text color="gray.700" _dark={{ color: 'gray.300' }} fontSize="lg" maxW="3xl" mx="auto">
            Our track record demonstrates unwavering commitment to the vision of Mr. Yesero Mugenyi.
            From land acquisition to operational success to strategic partnerships, we've proven
            our ability to execute on long-term, complex development projects. Now we're ready to
            scale with world-class investor partners.
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default TrackRecord
