import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import ContactForm from '../ContactForm'

function Contact() {
  return (
    <Box id="contact" className="body-font relative py-24 bg-gray-50" _dark={{ bg: 'gray.900' }}>
      <Box className="container mx-auto px-5">
        <Flex className="mb-20 w-full flex-col text-center">
          <Text className="title-font mb-2 text-xs font-medium tracking-widest text-blue-500">
            GET IN TOUCH
          </Text>
          <Heading as="h1" className="title-font mb-4 text-2xl font-medium sm:text-4xl">
            Investor Contact
          </Heading>
          <Text className="mx-auto text-base leading-relaxed lg:w-2/3">
            Interested in learning more about this transformative investment opportunity?
            Reach out to discuss how you can be part of Uganda's most ambitious development project.
          </Text>
        </Flex>
        <Flex className="flex-wrap pb-10 sm:flex-nowrap">
          <div className="relative flex w-full flex-grow items-end justify-start overflow-hidden rounded-lg bg-gray-900 p-10 sm:mr-10">
            <iframe
              width="100%"
              height="100%"
              title="map"
              className="absolute inset-0"
              frameBorder="0"
              scrolling="no"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31908.574741509892!2d31.33386599885666!3d1.432236133148158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sHoima%2C%20Uganda.%20Plot%2026%2C%20Old%20Toro%20Road!5e0!3m2!1sen!2sae!4v1644751737245!5m2!1sen!2sae"
              style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.16)' }}
            ></iframe>
            <div className="relative flex flex-wrap rounded bg-gray-900 py-6 shadow-md">
              <div className="px-6 lg:w-1/2">
                <Text className="title-font text-xs font-semibold tracking-widest text-white">
                  ADDRESS
                </Text>
                <Text className="mt-1 text-white">
                  Hoima, Uganda. Plot 26, Old Toro Road
                </Text>
              </div>
              <div className="mt-4 px-6 lg:mt-0 lg:w-1/2">
                <Text className="title-font text-xs font-semibold tracking-widest text-white">
                  INVESTOR RELATIONS
                </Text>
                <a
                  href="mailto:ada@ymfltd.com"
                  className="leading-relaxed text-blue-400 font-semibold"
                >
                  ada@ymfltd.com
                </a>
                <Text className="title-font mt-4 text-xs font-semibold tracking-widest text-white">
                  PHONE
                </Text>
                <a
                  href="tel:+256775599533"
                  className="leading-relaxed text-white"
                >
                  +256 77 55 99 533
                </a>
              </div>
            </div>
          </div>
          <ContactForm />
        </Flex>
      </Box>
    </Box>
  )
}

export default Contact
