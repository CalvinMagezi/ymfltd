import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const { subject, name, email, message, phone } = await request.json()

    await sanityClient.create({
      _type: 'contact',
      subject,
      name,
      email,
      message,
      phone,
    })

    console.log('Contact Form Submitted')
    return NextResponse.json(
      { message: 'Contact Form successfully submitted' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json(
      { message: "Couldn't submit contact information", error: err },
      { status: 500 }
    )
  }
}