import { Box } from '@chakra-ui/react'
import Hero from '@/components/home/Hero'
import About from '@/components/home/About'
import Hoima from '@/components/home/Hoima'
import Projects from '@/components/home/Projects'
import Team from '@/components/home/Team'
import Contact from '@/components/home/Contact'
import { sanityClient } from '@/lib/sanity'
import { Project } from 'typings'

interface IndexProps {
  projects: [Project]
}

export default function Home({ projects }: IndexProps) {
  console.log(projects)
  return (
    <Box className="w-full">
      <Hero />
      <About />
      <Hoima />
      <Projects projects={projects} />
      <Team />
      <Contact />
    </Box>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "project"]{
  _id,
  name,
  slug,
  mainImage,
  excerpt,
  description
}`

  const projects = await sanityClient.fetch(query)

  return {
    props: {
      projects,
    },
  }
}
