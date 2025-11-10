'use client'

import { Box, Flex, Heading, Text, SimpleGrid, Button, List, ListItem, ListIcon, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaHospital, FaGolfBall, FaHotel, FaHome } from 'react-icons/fa'
import Link from 'next/link'

const MotionBox = motion(Box)

function InvestmentOpportunity() {
  const sectionBg = useColorModeValue('linear(to-br, gray.100, blue.100)', 'linear(to-br, gray.900, blue.900)')
  const headingColor = useColorModeValue('gray.800', 'white')
  const subheadingColor = useColorModeValue('blue.600', 'blue.300')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  
  return (
    <Box
      id="investment"
      className="body-font py-24"
      bgGradient={sectionBg}
    >
      <Box className="container mx-auto px-5">
        <Flex className="mb-12 w-full flex-col text-center">
          <Text 
            fontSize="xs" 
            fontWeight="medium" 
            letterSpacing="widest"
            color={subheadingColor}
            mb={2}
            textTransform="uppercase"
          >
            SERIES A OPPORTUNITY
          </Text>
          <Heading
            as="h2"
            fontSize={{ base: '3xl', sm: '5xl' }}
            fontWeight="bold"
            color={headingColor}
            mb={4}
            lineHeight="tight"
          >
            Investment Opportunity
          </Heading>
          <Text 
            fontSize="lg" 
            lineHeight="relaxed" 
            color={textColor}
            maxW="2xl"
            mx="auto"
          >
            Join us in building Uganda's first integrated agro-industrial satellite town
            with exceptional returns and transformative social impact.
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={12}>
          {/* Investment Summary */}
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            bg="white"
            _dark={{ bg: 'gray.800' }}
            p={8}
            borderRadius="xl"
            boxShadow="2xl"
            border="2px"
            borderColor="blue.500"
          >
            <Heading as="h3" size="lg" mb={6} color="blue.600" _dark={{ color: 'blue.300' }}>
              Series A Investment Summary
            </Heading>
            <Box mb={6}>
              <Flex justify="space-between" mb={4} pb={4} borderBottom="1px" borderColor="gray.200" _dark={{ borderColor: 'gray.700' }}>
                <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>Target Raise:</Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600" _dark={{ color: 'blue.300' }}>$35 Million</Text>
              </Flex>
              <Flex justify="space-between" mb={4} pb={4} borderBottom="1px" borderColor="gray.200" _dark={{ borderColor: 'gray.700' }}>
                <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>Equity Stake:</Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600" _dark={{ color: 'blue.300' }}>30-35%</Text>
              </Flex>
              <Flex justify="space-between" mb={4} pb={4} borderBottom="1px" borderColor="gray.200" _dark={{ borderColor: 'gray.700' }}>
                <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>Use of Funds:</Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600" _dark={{ color: 'blue.300' }}>Phase 1</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>Timeline:</Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600" _dark={{ color: 'blue.300' }}>2025-2027</Text>
              </Flex>
            </Box>
            <Box bg="blue.50" _dark={{ bg: 'blue.900' }} p={4} borderRadius="md">
              <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.300' }}>
                <strong>Investment Window:</strong> Limited opportunity to participate in ground-floor
                development before oil & gas boom and airport opening drive valuations higher.
              </Text>
            </Box>
          </MotionBox>

          {/* Phase 1 Highlights */}
          <MotionBox
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            bg="white"
            _dark={{ bg: 'gray.800' }}
            p={8}
            borderRadius="xl"
            boxShadow="2xl"
          >
            <Heading as="h3" size="lg" mb={6} color="gray.900" _dark={{ color: 'white' }}>
              Phase 1 Development Highlights
            </Heading>
            <List spacing={4}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaHospital} color="blue.500" fontSize="xl" />
                <Box>
                  <Text fontWeight="bold">100-Bed Private Hospital</Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    $25M | 13 specialties | 150-170 staff | Opening 2027
                  </Text>
                </Box>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaGolfBall} color="green.500" fontSize="xl" />
                <Box>
                  <Text fontWeight="bold">18-Hole Championship Golf Course</Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    $10M | Par 72 | 18.1% IRR | 3.3x MOIC
                  </Text>
                </Box>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaHotel} color="purple.500" fontSize="xl" />
                <Box>
                  <Text fontWeight="bold">5-Star Hotel & Conference Center</Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    Luxury accommodation | Events | Business travel
                  </Text>
                </Box>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaHome} color="orange.500" fontSize="xl" />
                <Box>
                  <Text fontWeight="bold">Residential Condominiums</Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    Phase 1A | Mixed-use development
                  </Text>
                </Box>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaCheckCircle} color="teal.500" fontSize="xl" />
                <Box>
                  <Text fontWeight="bold">Supporting Infrastructure</Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    Roads | Utilities | Common areas
                  </Text>
                </Box>
              </ListItem>
            </List>
          </MotionBox>
        </SimpleGrid>

        {/* Returns Projection */}
        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          bg="blue.800"
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
          mb={12}
        >
          <Heading as="h3" size="lg" mb={6} color="white" textAlign="center">
            Projected Returns & Market Potential
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Box textAlign="center">
              <Text fontSize="4xl" fontWeight="bold" color="green.300">18.1%</Text>
              <Text color="gray.300" fontWeight="semibold">Golf Course IRR</Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Based on detailed financial model with conservative assumptions
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="4xl" fontWeight="bold" color="green.300">3.3x</Text>
              <Text color="gray.300" fontWeight="semibold">Golf Course MOIC</Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Multiple on invested capital over project lifecycle
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="4xl" fontWeight="bold" color="green.300">400K+</Text>
              <Text color="gray.300" fontWeight="semibold">Hospital Market</Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Potential patients in Hoima district with zero competition
              </Text>
            </Box>
          </SimpleGrid>
          <Box mt={8} textAlign="center">
            <Text color="gray.300" fontSize="sm">
              Mixed-use development creates diversified revenue streams: healthcare, hospitality,
              real estate, recreation, and agriculture. Risk mitigation through multiple income sources.
            </Text>
          </Box>
        </MotionBox>

        {/* CTA Buttons */}
        <Flex
          gap={6}
          justify="center"
          wrap="wrap"
          direction={{ base: 'column', md: 'row' }}
          align="center"
        >
          <Button
            size="lg"
            colorScheme="blue"
            bg="blue.500"
            _hover={{ bg: 'blue.600', transform: 'scale(1.05)' }}
            px={10}
            py={7}
            fontSize="lg"
            fontWeight="bold"
            boxShadow="xl"
            leftIcon={<FaCheckCircle />}
          >
            Download Investment Overview
          </Button>
          <Button
            as={Link}
            href="#contact"
            size="lg"
            colorScheme="green"
            bg="green.500"
            _hover={{ bg: 'green.600', transform: 'scale(1.05)' }}
            px={10}
            py={7}
            fontSize="lg"
            fontWeight="bold"
            boxShadow="xl"
          >
            Schedule Consultation
          </Button>
          <Button
            size="lg"
            variant="outline"
            borderColor="white"
            color="white"
            _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.05)' }}
            px={10}
            py={7}
            fontSize="lg"
            fontWeight="bold"
          >
            View Detailed Financials
          </Button>
        </Flex>

        <Box mt={12} textAlign="center">
          <Text fontSize="xs" color="gray.500">
            This website is for informational purposes only and does not constitute an offer to sell
            or a solicitation of an offer to buy any securities. Investment involves risk.
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default InvestmentOpportunity
