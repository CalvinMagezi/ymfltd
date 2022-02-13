import { urlFor } from '@/lib/sanity'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Project } from 'typings'

interface SingleProject {
  name: string
  img: string
  excerpt: string
  slug: string
}

const Project = ({ name, img, excerpt, slug }: SingleProject) => (
  <Link href={`/projects/${slug}`}>
    <Box className="cursor-pointer p-4 md:w-1/2 xl:w-1/4">
      <Box className="rounded-lg bg-gray-800 bg-opacity-40 p-6">
        <Image
          width="720"
          height="400"
          className="mb-6 rounded object-cover object-center"
          src={img}
          alt="content"
        />
        <Text className="title-font text-xs font-medium tracking-widest text-blue-400">
          Ongoing
        </Text>
        <Text className="title-font mb-4 text-lg font-medium ">{name}</Text>
        <Text className="text-base leading-relaxed">{excerpt}</Text>
      </Box>
    </Box>
  </Link>
)

interface ProjectProps {
  projects: [Project]
}

function Projects({ projects }: ProjectProps) {
  return (
    <Box id="projects" className="body-font">
      <Box className="container mx-auto px-5 py-24">
        <Flex className="mb-20 w-full flex-wrap">
          <Box className="mb-6 w-full lg:mb-0 lg:w-1/2">
            <Heading
              as="h1"
              className="title-font mb-2 text-2xl font-medium  sm:text-3xl"
            >
              Our Projects
            </Heading>
            <div className="h-1 w-20 rounded bg-blue-500"></div>
          </Box>
          <Text className="w-full leading-relaxed  text-opacity-90 lg:w-1/2">
            Through the undertaking of various projects in and the goal of
            partnering with the most reliable service providers for each
            respective project, we intend to build our city as a self
            sustainable, wealth generating city for its occupants and
            surrounding cities. Click on each project to read more.
          </Text>
        </Flex>
        <Flex className="-m-4 flex-wrap">
          {projects.map((project) => (
            <Project
              slug={project.slug.current}
              name={project.name}
              img={urlFor(project.mainImage).url()!}
              excerpt={project.excerpt}
              key={project._id}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  )
}

export default Projects
