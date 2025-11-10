'use client'

import { Box, Button, Grid, GridItem, Input, Textarea, Select, Checkbox, Text, FormControl, FormLabel } from '@chakra-ui/react'
import React, { useState } from 'react'

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
  const [formData, setFormData] = useState<IForminput>({
    subject: '',
    name: '',
    email: '',
    message: '',
    phone: '',
    organization: '',
    investmentInterest: '',
    investmentSize: '',
    areasOfInterest: []
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      areasOfInterest: checked 
        ? [...(prev.areasOfInterest || []), value]
        : (prev.areasOfInterest || []).filter(item => item !== value)
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = formData
    fetch('/api/contact', {
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
        <form onSubmit={onSubmit} className="mx-auto max-w-5xl">
          <Grid className="my-5 gap-6" templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
            <GridItem>
              <label htmlFor="name" className="font-semibold">Name *</label>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="Full Name"
                mt={2}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </GridItem>
            <GridItem>
              <label htmlFor="email" className="font-semibold">Email *</label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="your.email@example.com"
                mt={2}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </GridItem>
            <GridItem>
              <label htmlFor="phone" className="font-semibold">Phone Number *</label>
              <Input
                name="phone"
                id="phone"
                type="text"
                placeholder="+256 XXX XXX XXX"
                mt={2}
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </GridItem>
            <GridItem>
              <label htmlFor="organization" className="font-semibold">Organization/Fund Name</label>
              <Input
                name="organization"
                id="organization"
                type="text"
                placeholder="Your Organization"
                mt={2}
                value={formData.organization}
                onChange={handleInputChange}
              />
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <label htmlFor="investmentInterest" className="font-semibold">Investment Interest Level</label>
              <Select
                name="investmentInterest"
                id="investmentInterest"
                placeholder="Select interest level"
                mt={2}
                value={formData.investmentInterest}
                onChange={handleInputChange}
              >
                <option value="exploratory">Exploratory - Learning More</option>
                <option value="serious">Serious Consideration</option>
                <option value="ready">Ready to Discuss Terms</option>
              </Select>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <label htmlFor="investmentSize" className="font-semibold">Investment Size Range (Optional)</label>
              <Select
                name="investmentSize"
                id="investmentSize"
                placeholder="Select range (optional)"
                mt={2}
                value={formData.investmentSize}
                onChange={handleInputChange}
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
                <Checkbox 
                  isChecked={formData.areasOfInterest?.includes('hospital')}
                  onChange={(e) => handleCheckboxChange('hospital', e.target.checked)}
                >
                  Hospital Project ($25M)
                </Checkbox>
                <Checkbox 
                  isChecked={formData.areasOfInterest?.includes('golf')}
                  onChange={(e) => handleCheckboxChange('golf', e.target.checked)}
                >
                  Golf Course ($10M)
                </Checkbox>
                <Checkbox 
                  isChecked={formData.areasOfInterest?.includes('hotel')}
                  onChange={(e) => handleCheckboxChange('hotel', e.target.checked)}
                >
                  5-Star Hotel
                </Checkbox>
                <Checkbox 
                  isChecked={formData.areasOfInterest?.includes('mixed-use')}
                  onChange={(e) => handleCheckboxChange('mixed-use', e.target.checked)}
                >
                  Mixed-Use Development
                </Checkbox>
                <Checkbox 
                  isChecked={formData.areasOfInterest?.includes('full')}
                  onChange={(e) => handleCheckboxChange('full', e.target.checked)}
                >
                  Full Integrated Project
                </Checkbox>
              </Grid>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <label htmlFor="subject" className="font-semibold">Subject *</label>
              <Input
                name="subject"
                id="subject"
                type="text"
                placeholder="Investment Inquiry / General Question"
                mt={2}
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <label htmlFor="message" className="font-semibold">Message / Questions *</label>
              <Textarea
                name="message"
                id="message"
                placeholder="Tell us about your investment interests, questions, or how we can help..."
                rows={6}
                mt={2}
                value={formData.message}
                onChange={handleInputChange}
                required
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
