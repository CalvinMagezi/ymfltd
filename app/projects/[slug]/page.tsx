import { sanityClient, urlFor } from '@/lib/sanity'
import ProjectPageClient from '@/components/ProjectPageClient'
import { Project } from '../../../typings'

interface Props {
  params: Promise<{
    slug: string
  }>
}

async function getProject(slug: string): Promise<Project | null> {
  const query = `
    *[_type == "project" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        mainImage,
        excerpt,
        description
    }`

  try {
    const project = await sanityClient.fetch(query, { slug })
    return project || null
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return (
      <div className="container mx-auto px-5 py-24 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="mt-4 text-gray-600">
          The project you're looking for doesn't exist or may have been removed.
        </p>
        <a href="/" className="mt-6 inline-flex rounded border-0 bg-blue-500 py-2 px-6 text-lg text-white hover:bg-blue-600 focus:outline-none">
          Back to Home
        </a>
      </div>
    )
  }

  const imageUrl = urlFor(project.mainImage).url()!

  return <ProjectPageClient project={project} imageUrl={imageUrl} />
}

export async function generateStaticParams() {
  const query = `
    *[_type == "project"]{
        slug{
            current
        }
    }
    `
  try {
    const projects = await sanityClient.fetch(query)
    return projects.map((project: any) => ({
      slug: project.slug.current,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}