import { defineType } from 'sanity'

export default defineType({
  name: 'project',
  type: 'document',
  title: 'Projects',
  fields: [
    {
      name: 'name',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'excerpt',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Project Description',
      type: 'blockContent',
    },
  ],
})