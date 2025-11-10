import { Box } from '@chakra-ui/react'
import Hero from '@/components/home/Hero'
import ConvergenceOpportunity from '@/components/sections/ConvergenceOpportunity'
import StrategicPartnerships from '@/components/sections/StrategicPartnerships'
import InvestmentOpportunity from '@/components/sections/InvestmentOpportunity'
import MarketOpportunity from '@/components/sections/MarketOpportunity'
import TrackRecord from '@/components/sections/TrackRecord'
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
      <ConvergenceOpportunity />
      <StrategicPartnerships />
      <InvestmentOpportunity />
      <About />
      <Hoima />
      <MarketOpportunity />
      <TrackRecord />
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
