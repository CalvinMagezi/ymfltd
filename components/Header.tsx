import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { ColorModeSwitcher } from './utils/ColorModeSwitcher'
import { Box, Flex, Text } from '@chakra-ui/react'
import { BsFillLightningChargeFill } from 'react-icons/bs'
import Image from 'next/image'

const styles = {
  btn: `hover:scale-105 cursor-pointer font-bold text-lg transition duration-200 ease-in-out hover:underline hover:text-blue-500`,
}

function Header() {
  const [top, setTop] = useState(true)
  const [menu, setMenu] = useState(false)
  const toggleMenu = () => {
    if (menu) {
      setMenu(false)
    } else {
      setMenu(true)
    }
  }

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true)
    }
    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [top])
  return (
    <Box
      className={`sticky top-0 z-50 w-full bg-white pt-1 transition duration-300 ease-in-out md:bg-opacity-90 ${
        !top && 'bg-gray-300  shadow-lg'
      }`}
    >
      <Box className="sticky top-0 z-50 w-full shadow-md">
        <Box className="z-10 mx-auto max-w-7xl px-8  ">
          <Flex className="relative top-0 z-20 w-full flex-wrap items-center justify-between ">
            <Flex className="btn mr-6 flex-shrink-0 items-center text-white">
              <Link href="/">
                <Box>
                  <Image src="/logo.png" width="125" height="100" alt="YMF" />
                </Box>
              </Link>
            </Flex>
            <Box
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gray-100 lg:hidden"
              onClick={toggleMenu}
            >
              {menu ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.192 6.34399L11.949 10.586L7.70697 6.34399L6.29297 7.75799L10.535 12L6.29297 16.242L7.70697 17.656L11.949 13.414L16.192 17.656L17.606 16.242L13.364 12L17.606 7.75799L16.192 6.34399Z"
                    fill="black"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="fill-current text-gray-900"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6H20V8H4V6ZM4 11H20V13H4V11ZM4 16H20V18H4V16Z"></path>
                </svg>
              )}
            </Box>
            <Box
              className={`${
                menu ? 'z-50 block' : 'hidden'
              } relative z-50 w-full flex-grow text-black transition duration-300 lg:flex lg:w-auto lg:items-center ${
                top && 'text-black'
              }`}
            >
              <Flex className="w-full items-center space-x-4 pt-6 sm:max-w-md lg:w-1/4 lg:max-w-none lg:py-0 lg:pt-1 lg:pb-6 lg:pl-0 lg:pr-4">
                <Box className="cursor-pointer rounded border border-[whitesmoke] bg-gray-500 bg-opacity-30 px-1  text-xl font-bold outline-none transition  duration-200">
                  <ColorModeSwitcher />
                </Box>
              </Flex>
              <ul className="flex w-full flex-1 flex-col space-y-4 pt-10 pb-3 text-lg font-semibold sm:max-w-md lg:w-auto lg:max-w-none lg:flex-row lg:items-center lg:justify-center lg:space-y-0 lg:space-x-8 lg:p-0 lg:text-sm">
                <li className="navbarLink">
                  <Link href="/">
                    <p className={styles.btn} onClick={() => setMenu(false)}>
                      Home
                    </p>
                  </Link>
                </li>
                <li className="navbarLink">
                  <Link href="/#about">
                    <p className={styles.btn} onClick={() => setMenu(false)}>
                      About Us
                    </p>
                  </Link>
                </li>
                <li className="navbarLink">
                  <Link href="/#hoima">
                    <p className={styles.btn} onClick={() => setMenu(false)}>
                      Hoima District
                    </p>
                  </Link>
                </li>
                <li className="navbarLink">
                  <Link href="/#projects">
                    <p className={styles.btn} onClick={() => setMenu(false)}>
                      Projects
                    </p>
                  </Link>
                </li>
                <li className="navbarLink">
                  <Link href="/#members">
                    <p className={styles.btn} onClick={() => setMenu(false)}>
                      Members
                    </p>
                  </Link>
                </li>
                <li className="navbarLink">
                  <Link href="/#contact">
                    <p className={styles.btn} onClick={() => setMenu(false)}>
                      Contact Us
                    </p>
                  </Link>
                </li>
              </ul>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
