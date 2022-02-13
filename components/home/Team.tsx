import { Box, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

function Team() {
  return (
    <Box id="members" className="body-font ">
      <Box className="container mx-auto px-5 py-24">
        <Flex className="mb-20 w-full flex-col text-center">
          <Heading
            as="h1"
            className="title-font mb-4 text-2xl font-medium tracking-widest "
          >
            OUR TEAM
          </Heading>
          <Text className="mx-auto text-base leading-relaxed lg:w-2/3">
            The Yesero Mugenyi Foundation is currently being lead by his family
            and grand children who have come together with all of their
            respective skill sets to form a powerful team of driven individuals
          </Text>
        </Flex>
        <Flex className="-m-4 flex-wrap">
          <Member
            name="Yesero Mugenyi"
            position="Founder"
            img="/images/team/grandpapa1.jpeg"
          />
          <Member
            name="Mary Mugenyi"
            position="Director"
            img="/images/team/kaka1.jpeg"
          />
          <Member
            name="Ada Mugenyi"
            position="Managing Director"
            img="/images/team/mom1.jpeg"
          />
          <Member
            name="Ana Mugenyi"
            position="Judge Of The High Court"
            img="/images/team/ana-mugenyi1.jpeg"
          />
          <Member
            name="Ham Mugenyi"
            position="Lawyer / Chairman Of The Uganda Development Corporation Board"
            img="/images/team/ham-mugenyi1.png"
          />
          <Member
            name="Yese Mugenyi"
            position="Lawyer"
            img="/images/team/yese-mugenyi1.png"
          />
          <Member
            name="Asa Mugenyi"
            position="Lawyer / Head of the Tax Tribunal"
            img="/images/team/asa-mugenyi1.png"
          />
        </Flex>
      </Box>
    </Box>
  )
}

interface MemberProps {
  name: string
  position: string
  img: string
}

const Member = ({ name, position, img }: MemberProps) => (
  <Box className="p-4 lg:w-1/2">
    <Flex className=" h-full flex-col items-center justify-center text-center sm:flex-row sm:justify-start sm:text-left">
      <Image
        alt="team"
        width="200"
        height="300"
        className="mb-4  flex-shrink-0 rounded-lg object-cover object-center sm:mb-0"
        src={img}
      />
      <Box className="flex-grow sm:pl-8">
        <Text className="title-font text-lg font-medium ">{name}</Text>
        <Text className="mb-3 text-gray-500">{position}</Text>
      </Box>
    </Flex>
  </Box>
)

export default Team
