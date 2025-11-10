import { defineType } from 'sanity'

export default defineType({
  name: 'contact',
  type: 'document',
  title: 'Contacts',
  fields: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'phone',
      type: 'string',
    },
    {
      name: 'email',
      type: 'string',
    },
    {
      name: 'subject',
      type: 'string',
    },
    {
      name: 'message',
      type: 'text',
    },
  ],
})