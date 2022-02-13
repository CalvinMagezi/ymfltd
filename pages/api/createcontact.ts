// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
}

const client = sanityClient(config)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { subject, name, email, message, phone } = JSON.parse(req.body)

  try {
    await client.create({
      _type: 'contact',
      subject,
      name,
      email,
      message,
      phone,
    })
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Couldn't submit contact information", err })
  }
  console.log('Contact Form Submitted')
  res.status(200).json({ message: 'Contact Form successfully submitted' })
}
