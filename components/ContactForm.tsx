import { Box, Button, Grid, GridItem, Input, Textarea, Select, Checkbox, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface IForminput {
  subject: string
  name: string
  email: string
  message: string
  phone: string
  organization?: string
  investmentInterest?: string
  investmentSize?: string
  areasOfInterest?: string[]
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForminput>()

  const onSubmit: SubmitHandler<IForminput> = async (data) => {
    fetch('/api/createcontact', {
      method: 'Post',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }

  return (
    <Box className="w-full">
      {submitted ? (
        <Box className="mx-auto flex flex-col bg-green-500 py-10 px-8 text-white rounded-lg">
          <h3 className="text-3xl font-bold mb-4">Thank You for Your Interest!</h3>
          <p className="text-lg">
            We appreciate your inquiry about the Yesero Mugenyi Foundation investment opportunity.
            Our team will review your submission and get back to you within 24-48 hours.
          </p>
          <p className="mt-4">
            For urgent inquiries, please contact Ada Mugenyi directly at{' '}
            <a href="mailto:ada@ymfltd.com" className="underline font-bold">ada@ymfltd.com</a>
          </p>
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl">
          <Grid className="my-5 gap-6" templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
            <GridItem>
              <label htmlFor="name" className="font-semibold">Name *</label>
              <Input
                {...register('name', { required: true })}
                id="name"
                type="text"
                placeholder="Full Name"
                mt={2}
              />
            </GridItem>
            <GridItem>
              <label htmlFor="email" className="font-semibold">Email *</label>
              <Input
                {...register('email', { required: true })}
                id="email"
                type="email"
                placeholder="your.email@example.com"
                mt={2}
              />
            </GridItem>
            <GridItem>
              <label htmlFor="phone" className="font-semibold">Phone Number *</label>
              <Input
                {...register('phone', { required: true })}
                id="phone"
                type="text"
                placeholder="+256 XXX XXX XXX"
                mt={2}
              />
            </GridItem>
            <GridItem>
              <label htmlFor="organization" className="font-semibold">Organization/Fund Name</label>
              <Input
                {...register('organization')}
                id="organization"
                type="text"
                placeholder="Your Organization"
                mt={2}
              />
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <label htmlFor="investmentInterest" className="font-semibold">Investment Interest Level</label>
              <Select
                {...register('investmentInterest')}
                id="investmentInterest"
                placeholder="Select interest level"
                mt={2}
              >
                <option value="exploratory">Exploratory - Learning More</option>
                <option value="serious">Serious Consideration</option>
                <option value="ready">Ready to Discuss Terms</option>
              </Select>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <label htmlFor="investmentSize" className="font-semibold">Investment Size Range (Optional)</label>
              <Select
                {...register('investmentSize')}
                id="investmentSize"
                placeholder="Select range (optional)"
                mt={2}
              >
                <option value="1-5M">$1M - $5M</option>
                <option value="5-15M">$5M - $15M</option>
                <option value="15M+">$15M+</option>
                <option value="discuss">Prefer to Discuss</option>
              </Select>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <label className="font-semibold block mb-2">Areas of Interest (Check all that apply)</label>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={2}>
                <Checkbox {...register('areasOfInterest')} value="hospital">
                  Hospital Project ($25M)
                </Checkbox>
                <Checkbox {...register('areasOfInterest')} value="golf">
                  Golf Course ($10M)
                </Checkbox>
                <Checkbox {...register('areasOfInterest')} value="hotel">
                  5-Star Hotel
                </Checkbox>
                <Checkbox {...register('areasOfInterest')} value="mixed-use">
                  Mixed-Use Development
                </Checkbox>
                <Checkbox {...register('areasOfInterest')} value="full">
                  Full Integrated Project
                </Checkbox>
              </Grid>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <label htmlFor="subject" className="font-semibold">Subject *</label>
              <Input
                {...register('subject', { required: true })}
                id="subject"
                type="text"
                placeholder="Investment Inquiry / General Question"
                mt={2}
              />
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <label htmlFor="message" className="font-semibold">Message / Questions *</label>
              <Textarea
                {...register('message', { required: true })}
                id="message"
                placeholder="Tell us about your investment interests, questions, or how we can help..."
                rows={6}
                mt={2}
              />
            </GridItem>
          </Grid>
          <Text fontSize="xs" color="gray.500" mt={4} mb={4}>
            * Required fields. Your information is confidential and used only for investment discussions.
            We respect your privacy and will never share your data with third parties.
          </Text>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            className="my-5"
            px={12}
            py={6}
            fontWeight="bold"
          >
            Submit Investment Inquiry
          </Button>
        </form>
      )}
    </Box>
  )
}

export default ContactForm
