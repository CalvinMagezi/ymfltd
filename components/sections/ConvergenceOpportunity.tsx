import { Box, Flex, Heading, Text, SimpleGrid, Icon } from '@chakra-ui/react'
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

const OpportunityCard = ({ icon, stat, title, description, color, delay }: OpportunityCardProps) => (
  <MotionBox
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    // @ts-ignore
    transition={{ duration: 0.6, delay }}
    bg="gray.800"
    bgGradient={`linear(to-br, gray.800, ${color}.900)`}
    p={8}
    borderRadius="xl"
    boxShadow="2xl"
    _hover={{
      transform: 'translateY(-8px)',
      boxShadow: '2xl',
      bgGradient: `linear(to-br, gray.700, ${color}.800)`,
    }}
    sx={{ transition: 'all 0.3s' }}
    border="1px"
    borderColor="gray.700"
  >
    <Flex direction="column" align="center" textAlign="center">
      <Icon as={icon} w={12} h={12} color={`${color}.400`} mb={4} />
      <Text
        fontSize="4xl"
        fontWeight="bold"
        color={`${color}.300`}
        mb={2}
      >
        {stat}
      </Text>
      <Heading
        as="h3"
        size="md"
        mb={4}
        color="white"
      >
        {title}
      </Heading>
      <Text color="gray.300" fontSize="sm" lineHeight="tall">
        {description}
      </Text>
    </Flex>
  </MotionBox>
)

function ConvergenceOpportunity() {
  return (
    <Box id="convergence" className="body-font bg-gray-900 py-24">
      <Box className="container mx-auto px-5">
        <Flex className="mb-20 w-full flex-col text-center">
          <Text className="title-font mb-2 text-xs font-medium tracking-widest text-blue-400">
            STRATEGIC TIMING
          </Text>
          <Heading
            as="h2"
            className="title-font mb-4 text-3xl font-medium text-white sm:text-4xl"
          >
            The Convergence Opportunity
          </Heading>
          <Text className="mx-auto text-base leading-relaxed text-gray-300 lg:w-2/3">
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
          <Text fontSize="lg" color="gray.400" fontStyle="italic">
            "When infrastructure, economic development, and critical needs converge,
            extraordinary investment opportunities emerge."
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default ConvergenceOpportunity
