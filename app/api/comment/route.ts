import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const { _id, name, email, comment } = await request.json()

    await sanityClient.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    })

    console.log('Comment Submitted')
    return NextResponse.json(
      { message: 'Comment successfully submitted' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Comment submission error:', err)
    return NextResponse.json(
      { message: "Couldn't submit comment", error: err },
      { status: 500 }
    )
  }
}