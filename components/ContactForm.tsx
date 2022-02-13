import { Box, Button, Grid, GridItem, Input, Textarea } from '@chakra-ui/react'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface IForminput {
  subject: string
  name: string
  email: string
  message: string
  phone: string
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
        <div className="mx-auto flex flex-col bg-green-500 py-10 text-white ">
          <h3 className="text-3xl font-bold">Thank you for contacting us</h3>
          <p>
            We shall get back to you shortly, check your inbox or expect our
            call.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl">
          <Grid className="my-5 grid-cols-1 gap-6 ">
            <GridItem>
              <label htmlFor="name">Name</label>
              <Input
                {...register('name', { required: true })}
                id="name"
                type="text"
                placeholder="eg. John Doe"
              />
            </GridItem>
            <GridItem>
              <label htmlFor="email">Email</label>
              <Input
                {...register('email', { required: true })}
                id="email"
                type="email"
                placeholder="eg. johndoe@mail.com"
              />
            </GridItem>
            <GridItem>
              <label htmlFor="phone">Phone Number</label>
              <Input
                {...register('phone', { required: true })}
                id="phone"
                type="text"
                placeholder="eg +971xxxxxxx"
              />
            </GridItem>
            <GridItem>
              <label htmlFor="subject">Subject</label>
              <Input
                {...register('subject', { required: true })}
                id="subject"
                type="text"
                placeholder="eg Enquiry About...."
              />
            </GridItem>
            <GridItem>
              <label htmlFor="message">Message</label>
              <Textarea
                {...register('message', { required: true })}
                id="message"
                placeholder="The body of your message should go here..."
              />
            </GridItem>
          </Grid>
          <Button type="submit" colorScheme="green" className="my-5">
            Submit
          </Button>
        </form>
      )}
    </Box>
  )
}

export default ContactForm
