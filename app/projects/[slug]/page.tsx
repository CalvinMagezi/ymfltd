import { sanityClient, urlFor } from '@/lib/sanity'
import { Box, Flex } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
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
      <Box className="container mx-auto px-5 py-24 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link href="/">
          <button className="mt-4 inline-flex rounded border-0 bg-blue-500 py-2 px-6 text-lg text-white hover:bg-blue-600 focus:outline-none">
            Back to Home
          </button>
        </Link>
      </Box>
    )
  }

  return (
    <Box className="body-font">
      <Flex className="container mx-auto flex-col items-center justify-center px-5 py-24">
        <Image
          width={720}
          height={600}
          className="mb-10 rounded object-cover object-center"
          alt={project.name}
          src={urlFor(project.mainImage).url()!}
        />
        <div className="w-full text-center lg:w-2/3">
          <h1 className="title-font mb-4 text-3xl font-medium sm:text-4xl">
            {project.name}
          </h1>
          <div className="mb-8 leading-relaxed">
            <PortableText
              value={(project.description as any) || []}
              components={{
                block: {
                  h1: ({ children }) => (
                    <h1 className="my-5 text-2xl font-bold">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="my-5 text-xl font-bold">{children}</h2>
                  ),
                  normal: ({ children }) => (
                    <p className="my-4">{children}</p>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="my-4 ml-6 list-disc">{children}</ul>
                  ),
                },
                listItem: {
                  bullet: ({ children }) => (
                    <li className="my-1">{children}</li>
                  ),
                },
                marks: {
                  link: ({ children, value }) => (
                    <a 
                      href={value?.href} 
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          </div>
          <div className="flex justify-center">
            <Link href="/">
              <button className="inline-flex rounded border-0 bg-blue-500 py-2 px-6 text-lg text-white hover:bg-blue-600 focus:outline-none">
                Back
              </button>
            </Link>
          </div>
        </div>
      </Flex>
    </Box>
  )
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