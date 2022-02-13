import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

function About() {
  return (
    <Box id="about" className="body-font ">
      <Flex className="mb-20 w-full flex-col text-center">
        <Text className="title-font mb-1 text-xs font-medium tracking-widest text-blue-400">
          YMF
        </Text>
        <Heading
          as="h1"
          className="title-font mb-4 text-2xl font-medium sm:text-3xl"
        >
          About Us
        </Heading>
        <Text className="mx-auto text-base leading-relaxed lg:w-2/3">
          Our ultimate goal is to make use of the 2 square miles acquired by Mr
          Yesero Mugenyi for the undertaking of various projects, to create a
          production-satellite town with the capacity for commercial,
          industrial, nature reserve and other productions, distinct from that
          of the parent town, - a new Kikwite Town in Hoima District
        </Text>
      </Flex>
      <Flex className="container mx-auto flex-col px-5 ">
        <Box className="mx-auto lg:w-4/6">
          <Box className="h-64 overflow-hidden rounded-lg">
            <Image
              alt="content"
              width="1200"
              height="500"
              className="object-cover object-center"
              src="/images/bg2.jpeg"
            />
          </Box>
          <Flex className="mt-10 flex-col sm:flex-row">
            <Box className="text-center sm:w-1/3 sm:py-8 sm:pr-8">
              <Box className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-800 text-gray-600">
                <Avatar
                  size="xl"
                  name="Ada Mugenyi"
                  src="/images/team/mom1.jpeg"
                />
              </Box>
              <Flex className=" flex-col items-center justify-center text-center">
                <Text className="title-font mt-4 text-lg font-medium ">
                  Ada Mugenyi
                </Text>
                <div className="mt-2 mb-4 h-1 w-12 rounded bg-blue-500"></div>
                <Text className="text-base text-gray-400">
                  Managing Director
                </Text>
              </Flex>
            </Box>
            <Box className="mt-4 border-t border-gray-800 pt-4 text-center sm:mt-0 sm:w-2/3 sm:border-l sm:border-t-0 sm:py-8 sm:pl-8 sm:text-left">
              <Text className="mb-4 text-lg leading-relaxed">
                This will be achieved by our undertaking of various projects,
                some of which are already in motion, including building; a golf
                course, hotel and accomodation, hospital and medical facilities,
                game reserve and animal conservation facilities, shopping
                centers, a sports arena, schools and universities etc. (Find
                full project list further below)
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default About
