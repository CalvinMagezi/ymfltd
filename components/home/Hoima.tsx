import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

function Hoima() {
  return (
    <Box id="hoima" className="body-font ">
      <Flex className="container mx-auto flex-col items-center px-5 py-24 md:flex-row">
        <Flex className="mb-16 flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
          <Heading
            as="h1"
            className="title-font mb-4 text-3xl font-medium  sm:text-4xl"
          >
            Hoima District
          </Heading>
          <Text className="mb-8 leading-relaxed">
            The Yesero Mugenyi Foundation was founded by Mr Yesero Mugenyi, and
            shall be carried on by his descendants. Together we have committed
            to build an entirely self sufficient Satellite Town upon the 2
            square miles of land Mr Yesero Mugenyi labored so hard to aquire for
            the sake of his children and grandchildren.
          </Text>
          <Text className="mb-8 leading-relaxed">
            The Y.M.F is currently being pushed forward by Mr Yesero Mugenyi’s
            youngest daughter, Ms Ada Mugenyi. Alongside her siblings, her
            children, her nieces and nephews: we shall all be working hand in
            hand to accomplish launching all our projects by 2030.
          </Text>
        </Flex>
        <Box className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
          <Image
            className="rounded object-cover object-center"
            alt="hero"
            width="720"
            height="600"
            src="/images/hoima1.png"
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default Hoima
