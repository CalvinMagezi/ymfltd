import { Box, Flex, Heading, Text, Badge, SimpleGrid } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

function Team() {
  return (
    <Box id="members" className="body-font bg-gray-50" _dark={{ bg: 'gray.900' }} py={24}>
      <Box className="container mx-auto px-5">
        <Flex className="mb-20 w-full flex-col text-center">
          <Text className="title-font mb-2 text-xs font-medium tracking-widest text-blue-500">
            LEADERSHIP & GOVERNANCE
          </Text>
          <Heading
            as="h1"
            className="title-font mb-4 text-2xl font-medium tracking-widest sm:text-4xl"
          >
            Our Team
          </Heading>
          <Text className="mx-auto text-base leading-relaxed lg:w-2/3">
            Multi-generational commitment with legal, judicial, and business expertise.
            The Yesero Mugenyi Foundation is led by his family and grandchildren who have
            come together with all of their respective skill sets to form a powerful team
            of driven individuals committed to realizing this transformative vision.
          </Text>
        </Flex>
        {/* Leadership Section */}
        <Box mb={12}>
          <Heading size="md" mb={6} color="blue.600" _dark={{ color: 'blue.400' }}>
            Executive Leadership
          </Heading>
          <Flex className="-m-4 flex-wrap">
            <Member
              name="Yesero Mugenyi"
              position="Founder & Visionary"
              img="/images/team/grandpapa1.jpeg"
              category="leadership"
              role="Mubiito (Prince) - Royal Lineage"
              highlights={[
                "Acquired 1,280 acres for generational wealth creation",
                "Established foundation for multi-generational development",
                "Cultural heritage preservation through Museum project",
              ]}
            />
            <Member
              name="Ada Mugenyi"
              position="Managing Director"
              img="/images/team/mom1.jpeg"
              category="leadership"
              role="Leading Phase 1 Investor Outreach & Daily Operations"
              highlights={[
                "Driving Series A fundraising efforts",
                "Primary investor relations contact",
                "Overseeing project development strategy",
              ]}
            />
          </Flex>
        </Box>

        {/* Governance Section */}
        <Box mb={12}>
          <Heading size="md" mb={6} color="purple.600" _dark={{ color: 'purple.400' }}>
            Legal & Governance Oversight
          </Heading>
          <Flex className="-m-4 flex-wrap">
            <Member
              name="Ana Mugenyi"
              position="Judge of the High Court"
              img="/images/team/ana-mugenyi1.jpeg"
              category="governance"
              role="Legal Oversight & Governance"
            />
            <Member
              name="Ham Mugenyi"
              position="Lawyer / Chairman of Uganda Development Corporation Board"
              img="/images/team/ham-mugenyi1.png"
              category="governance"
              role="Corporate Governance & Strategic Advisory"
            />
            <Member
              name="Yese Mugenyi"
              position="Lawyer"
              img="/images/team/yese-mugenyi1.png"
              category="governance"
              role="Legal Affairs"
            />
            <Member
              name="Asa Mugenyi"
              position="Lawyer / Head of the Tax Tribunal"
              img="/images/team/asa-mugenyi1.png"
              category="governance"
              role="Tax & Regulatory Compliance"
            />
          </Flex>
        </Box>

        {/* Operations Section */}
        <Box>
          <Heading size="md" mb={6} color="green.600" _dark={{ color: 'green.400' }}>
            Operations & Development
          </Heading>
          <Flex className="-m-4 flex-wrap">
            <Member
              name="Mary Mugenyi"
              position="Director"
              img="/images/team/kaka1.jpeg"
              category="operations"
              role="Operational Oversight"
            />
          </Flex>
        </Box>

        {/* Future Advisory Note */}
        <Box mt={12} bg="blue.50" _dark={{ bg: 'blue.900' }} p={6} borderRadius="lg">
          <Heading size="sm" mb={3}>Strategic Partners & Future Additions</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontWeight="bold" mb={1}>Iproplan Leadership</Text>
              <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                Hospital design & construction lead | 40+ years healthcare facilities experience
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={1}>Medical Director (Planned Hire)</Text>
              <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                Recruitment planned Q4 2025 | International healthcare experience required
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  )
}

interface MemberProps {
  name: string
  position: string
  img: string
  role?: string
  category?: 'leadership' | 'governance' | 'operations'
  highlights?: string[]
}

const Member = ({ name, position, img, role, category, highlights }: MemberProps) => {
  const categoryColors = {
    leadership: 'blue',
    governance: 'purple',
    operations: 'green',
  }

  return (
    <Box className="p-4 lg:w-1/2">
      <Box
        className="h-full flex-col items-center justify-center text-center sm:flex-row sm:justify-start sm:text-left"
        bg="white"
        _dark={{ bg: 'gray.800' }}
        p={6}
        borderRadius="lg"
        boxShadow="md"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'xl',
        }}
        transition="all 0.3s"
        display="flex"
      >
        <Image
          alt="team"
          width="200"
          height="300"
          className="mb-4 flex-shrink-0 rounded-lg object-cover object-center sm:mb-0"
          src={img}
        />
        <Box className="flex-grow sm:pl-8">
          <Flex gap={2} mb={2} flexWrap="wrap" justify={{ base: 'center', sm: 'flex-start' }}>
            {category && (
              <Badge colorScheme={categoryColors[category]} fontSize="xs">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            )}
          </Flex>
          <Text className="title-font text-lg font-medium mb-1">{name}</Text>
          <Text className="mb-2 text-gray-600 font-semibold" _dark={{ color: 'gray.400' }}>
            {position}
          </Text>
          {role && (
            <Text className="text-sm text-blue-600 mb-2" _dark={{ color: 'blue.400' }}>
              {role}
            </Text>
          )}
          {highlights && highlights.length > 0 && (
            <Box mt={2}>
              {highlights.map((highlight, idx) => (
                <Text key={idx} fontSize="xs" color="gray.500" mb={1}>
                  • {highlight}
                </Text>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Team
