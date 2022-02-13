import { sanityClient, urlFor } from '@/lib/sanity'
import { Box, Flex } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PortableText from 'react-portable-text'
import { Project } from 'typings'

interface Props {
  project: Project
}

function ProjectPage({ project }: Props) {
  return (
    <Box className="body-font ">
      <Flex className="container mx-auto flex-col items-center justify-center px-5 py-24">
        <Image
          width="720"
          height="600"
          className="mb-10 rounded object-cover object-center "
          alt="hero"
          src={urlFor(project.mainImage).url()!}
        />
        <div className="w-full text-center lg:w-2/3">
          <h1 className="title-font mb-4 text-3xl font-medium  sm:text-4xl">
            {project.name}
          </h1>
          <p className="mb-8 leading-relaxed">
            <PortableText
              className=""
              serializers={{
                h1: (props: any) => (
                  <h1 className="my-5 text-2xl font-bold" {...props} />
                ),
                h2: (props: any) => (
                  <h1 className="my-5 text-xl font-bold" {...props} />
                ),
                li: ({ children }: any) => (
                  <li className="my-5 ml-4 font-bold">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
              content={project.description}
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            />
          </p>
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

export default ProjectPage

export const getStaticPaths = async () => {
  const query = `
    *[_type == "project"]{
        _id,
        slug{
            current
        }
    }
    `
  const projects = await sanityClient.fetch(query)

  const paths = projects.map((project: Project) => ({
    params: {
      slug: project.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type == "project" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        mainImage,
        excerpt,
        description
    }`

  const project = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      project,
    },
    revalidate: 60,
  }
}
