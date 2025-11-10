import { Box, Flex, Heading, Text, SimpleGrid, Badge } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaHandshake, FaHospitalAlt, FaPills, FaPaw, FaSeedling, FaMapMarkedAlt } from 'react-icons/fa'
import { Icon } from '@chakra-ui/react'

const MotionBox = motion(Box)

interface PartnerCardProps {
  icon: any
  title: string
  description: string
  status: string
  statusColor: string
  delay: number
}

const PartnerCard = ({ icon, title, description, status, statusColor, delay }: PartnerCardProps) => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    // @ts-ignore
    transition={{ duration: 0.5, delay }}
    bg="white"
    _dark={{ bg: 'gray.800' }}
    p={6}
    borderRadius="lg"
    boxShadow="lg"
    _hover={{
      transform: 'translateY(-4px)',
      boxShadow: '2xl',
    }}
    sx={{ transition: 'all 0.3s' }}
    border="1px"
    borderColor="gray.200"
    _darkBorder={{ borderColor: 'gray.700' }}
    position="relative"
    overflow="hidden"
  >
    <Badge
      position="absolute"
      top={4}
      right={4}
      colorScheme={statusColor}
      fontSize="xs"
      px={3}
      py={1}
      borderRadius="full"
    >
      {status}
    </Badge>
    <Flex direction="column" h="full">
      <Icon as={icon} w={10} h={10} color="blue.500" mb={4} />
      <Heading
        as="h3"
        size="md"
        mb={3}
        color="gray.900"
        _dark={{ color: 'white' }}
      >
        {title}
      </Heading>
      <Text color="gray.600" _dark={{ color: 'gray.300' }} fontSize="sm" lineHeight="tall">
        {description}
      </Text>
    </Flex>
  </MotionBox>
)

function StrategicPartnerships() {
  return (
    <Box id="partnerships" className="body-font py-24 bg-gray-50" _dark={{ bg: 'gray.900' }}>
      <Box className="container mx-auto px-5">
        <Flex className="mb-20 w-full flex-col text-center">
          <Text className="title-font mb-2 text-xs font-medium tracking-widest text-blue-500">
            CREDIBILITY & VALIDATION
          </Text>
          <Heading
            as="h2"
            className="title-font mb-4 text-3xl font-medium sm:text-4xl"
          >
            Strategic Partnerships
          </Heading>
          <Text className="mx-auto text-base leading-relaxed text-gray-600 lg:w-2/3" _dark={{ color: 'gray.300' }}>
            Established relationships with world-class organizations and government entities
            validate our vision and ensure successful project execution.
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <PartnerCard
            icon={FaHandshake}
            title="Iproplan | German Healthcare Construction"
            description="Medical facility design and construction specialists with 40+ years of experience in healthcare infrastructure across Europe and Africa."
            status="MOU Signed"
            statusColor="green"
            delay={0.1}
          />
          <PartnerCard
            icon={FaHospitalAlt}
            title="Uganda Ministry of Health"
            description="Official government partnership for healthcare development, ensuring regulatory compliance and alignment with national health priorities."
            status="MOU Secured"
            statusColor="green"
            delay={0.2}
          />
          <PartnerCard
            icon={FaPills}
            title="National Medical Stores"
            description="Strategic pharmaceutical supply partnership ensuring reliable access to quality medicines and medical supplies for our healthcare facilities."
            status="Partnership Established"
            statusColor="green"
            delay={0.3}
          />
          <PartnerCard
            icon={FaPaw}
            title="Uganda Wildlife Authority"
            description="Conservation and eco-tourism collaboration for sustainable wildlife management and nature reserve development on the property."
            status="Active Partnership"
            statusColor="blue"
            delay={0.4}
          />
          <PartnerCard
            icon={FaSeedling}
            title="Operational Since 2011"
            description="126-cow dairy farm generating revenue since 2011, demonstrating proven execution capability and long-term commitment to the project."
            status="Operational"
            statusColor="purple"
            delay={0.5}
          />
          <PartnerCard
            icon={FaMapMarkedAlt}
            title="1,280 Acres Secured"
            description="Prime location southeast of Hoima town, legally secured and owned since 2011. Strategic positioning for all planned developments."
            status="Land Secured"
            statusColor="purple"
            delay={0.6}
          />
        </SimpleGrid>

        <Box mt={16} bg="blue.50" _dark={{ bg: 'blue.900' }} p={8} borderRadius="xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <Box mb={{ base: 4, md: 0 }}>
              <Heading size="md" mb={2}>Ready to Learn More?</Heading>
              <Text color="gray.600" _dark={{ color: 'gray.300' }}>
                Discover how our partnerships create a foundation for success.
              </Text>
            </Box>
            <a href="#investment">
              <Box
                as="button"
                bg="blue.600"
                color="white"
                px={8}
                py={3}
                borderRadius="md"
                fontWeight="bold"
                _hover={{ bg: 'blue.700', transform: 'scale(1.05)' }}
                transition="all 0.3s"
              >
                View Investment Details
              </Box>
            </a>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

export default StrategicPartnerships
