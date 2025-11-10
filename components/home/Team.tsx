'use client'

import { Box, Flex, Heading, Text, Badge, SimpleGrid, useColorModeValue, Container, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

function Team() {
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const headingColor = useColorModeValue('gray.800', 'white')
  const subheadingColor = useColorModeValue('blue.600', 'blue.300')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.700')
  
  return (
    <Box id="members" bg={sectionBg} py={24}>
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
            LEADERSHIP & GOVERNANCE
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: '2xl', sm: '4xl' }}
            fontWeight="bold"
            color={headingColor}
            mb={4}
            letterSpacing="wide"
            lineHeight="tight"
          >
            Our Team
          </Heading>
          <Text 
            fontSize="md" 
            lineHeight="relaxed" 
            color={textColor}
            maxW="2xl"
            mx="auto"
          >
            Multi-generational commitment with legal, judicial, and business expertise.
            The Yesero Mugenyi Foundation is led by his family and grandchildren who have
            come together with all of their respective skill sets to form a powerful team
            of driven individuals committed to realizing this transformative vision.
          </Text>
        </Flex>
        {/* Leadership Section */}
        <Box mb={12}>
          <Heading 
            size="md" 
            mb={6} 
            color={subheadingColor}
            textAlign="center"
          >
            Executive Leadership
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
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
            <Member
              name="Mary Mugenyi"
              position="Director"
              img="/images/team/kaka1.jpeg"
              category="leadership"
              role="Strategic Operations & Family Coordination"
              highlights={[
                "Coordinating multi-generational family involvement",
                "Strategic operations oversight",
                "Key stakeholder in project development",
              ]}
            />
          </SimpleGrid>
        </Box>

        {/* Governance Section */}
        <Box mb={12}>
          <Heading 
            size="md" 
            mb={6} 
            color="purple.600" 
            _dark={{ color: 'purple.400' }}
            textAlign="center"
          >
            Legal & Governance Oversight
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
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
          </SimpleGrid>
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
      </Container>
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
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const nameColor = useColorModeValue('gray.800', 'white')
  const positionColor = useColorModeValue('gray.600', 'gray.400')
  const roleColor = useColorModeValue('blue.600', 'blue.300')
  const highlightColor = useColorModeValue('gray.500', 'gray.400')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      border="1px"
      borderColor={borderColor}
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: '2xl',
      }}
      transition="all 0.3s"
      h="full"
    >
      <Flex 
        direction={{ base: 'column', md: category === 'leadership' ? 'row' : 'column' }}
        align="center"
        gap={6}
        h="full"
      >
        {/* Profile Image */}
        <Box 
          flexShrink={0}
          textAlign="center"
        >
          <Box
            position="relative"
            w={{ base: '120px', md: category === 'leadership' ? '140px' : '120px' }}
            h={{ base: '120px', md: category === 'leadership' ? '140px' : '120px' }}
            mx="auto"
            mb={4}
          >
            <Image
              src={img}
              alt={name}
              width={200}
              height={200}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          </Box>
          
          {/* Category Badge */}
          {category && (
            <Badge 
              colorScheme={categoryColors[category]} 
              fontSize="xs"
              px={3}
              py={1}
              borderRadius="full"
              mb={2}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          )}
        </Box>

        {/* Content */}
        <Box 
          flex={1}
          textAlign={{ base: 'center', md: category === 'leadership' ? 'left' : 'center' }}
        >
          <Heading
            as="h3"
            size="md"
            color={nameColor}
            mb={2}
            lineHeight="tight"
          >
            {name}
          </Heading>
          
          <Text
            fontSize="md"
            fontWeight="semibold"
            color={positionColor}
            mb={3}
          >
            {position}
          </Text>
          
          {role && (
            <Text 
              fontSize="sm" 
              color={roleColor}
              fontStyle="italic"
              mb={4}
              lineHeight="relaxed"
            >
              {role}
            </Text>
          )}
          
          {/* Highlights */}
          {highlights && highlights.length > 0 && (
            <Box>
              <Text 
                fontSize="xs" 
                fontWeight="bold" 
                color={positionColor}
                mb={2}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Key Highlights
              </Text>
              <VStack spacing={1} align={category === 'leadership' ? 'flex-start' : 'center'}>
                {highlights.map((highlight, idx) => (
                  <Text 
                    key={idx} 
                    fontSize="xs" 
                    color={highlightColor}
                    lineHeight="relaxed"
                  >
                    • {highlight}
                  </Text>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export default Team
