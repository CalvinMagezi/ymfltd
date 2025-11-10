'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ColorModeSwitcher } from './utils/ColorModeSwitcher'
import {
  Box,
  Flex,
  HStack,
  VStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Collapse,
  Text,
  Button
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import Image from 'next/image'

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  const linkColor = useColorModeValue('gray.700', 'gray.200')
  const hoverColor = useColorModeValue('blue.600', 'blue.300')
  
  return (
    <Button
      as={Link}
      href={href}
      variant="ghost"
      fontSize="md"
      fontWeight="semibold"
      color={linkColor}
      _hover={{
        color: hoverColor,
        transform: 'translateY(-1px)',
        textDecoration: 'none'
      }}
      transition="all 0.2s"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { isOpen, onToggle, onClose } = useDisclosure()
  
  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const logoFilter = useColorModeValue('none', 'brightness(1.1)')

  useEffect(() => {
    const scrollHandler = () => {
      setIsScrolled(window.pageYOffset > 10)
    }
    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [])

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000}
      bg={bgColor}
      borderBottom={isScrolled ? '1px solid' : 'none'}
      borderColor={borderColor}
      boxShadow={isScrolled ? 'md' : 'none'}
      transition="all 0.3s"
      backdropFilter="blur(10px)"
      backgroundColor={isScrolled ? useColorModeValue('rgba(255,255,255,0.95)', 'rgba(26,32,44,0.95)') : bgColor}
    >
      <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Link href="/">
            <Flex alignItems="center" cursor="pointer">
              <Image
                src="/logo.png"
                width={60}
                height={48}
                alt="YMF Limited"
                style={{ filter: logoFilter }}
              />
              <Text
                ml={3}
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="bold"
                color={useColorModeValue('gray.800', 'white')}
                display={{ base: 'none', sm: 'block' }}
              >
                YMF Limited
              </Text>
            </Flex>
          </Link>

          {/* Desktop Navigation */}
          <HStack spacing={8} alignItems="center" display={{ base: 'none', lg: 'flex' }}>
            <HStack spacing={6}>
              <NavLink href="/">Home</NavLink>
              <NavLink href="/#investment">Investment</NavLink>
              <NavLink href="/#partnerships">Partnerships</NavLink>
              <NavLink href="/#projects">Projects</NavLink>
              <NavLink href="/#members">Team</NavLink>
              <NavLink href="/#contact">Contact</NavLink>
            </HStack>
            <ColorModeSwitcher />
          </HStack>

          {/* Mobile menu button */}
          <Flex alignItems="center" display={{ base: 'flex', lg: 'none' }}>
            <ColorModeSwitcher mr={2} />
            <IconButton
              size="md"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label="Toggle navigation"
              onClick={onToggle}
              variant="ghost"
              color={useColorModeValue('gray.700', 'gray.200')}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700')
              }}
            />
          </Flex>
        </Flex>

        {/* Mobile Navigation */}
        <Collapse in={isOpen} animateOpacity>
          <Box
            pb={4}
            display={{ lg: 'none' }}
            bg={bgColor}
            borderRadius="md"
            mt={2}
          >
            <VStack spacing={2} alignItems="stretch">
              <NavLink href="/" onClick={onClose}>Home</NavLink>
              <NavLink href="/#investment" onClick={onClose}>Investment</NavLink>
              <NavLink href="/#partnerships" onClick={onClose}>Partnerships</NavLink>
              <NavLink href="/#projects" onClick={onClose}>Projects</NavLink>
              <NavLink href="/#members" onClick={onClose}>Team</NavLink>
              <NavLink href="/#contact" onClick={onClose}>Contact</NavLink>
            </VStack>
          </Box>
        </Collapse>
      </Box>
    </Box>
  )
}

export default Header
