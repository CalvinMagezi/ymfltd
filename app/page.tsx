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
import { Project } from '../typings'

interface HomeProps {
  projects: Project[]
}

async function getProjects(): Promise<Project[]> {
  const query = `*[_type == "project"]{
    _id,
    name,
    slug,
    mainImage,
    excerpt,
    description
  }`

  try {
    const projects = await sanityClient.fetch(query)
    return projects || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export default async function Home() {
  const projects = await getProjects()

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
      <Projects projects={projects as [Project]} />
      <Team />
      <Contact />
    </Box>
  )
}
