import { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
// import { AppError } from '../utils/AppError'

export async function productsRoute(app: FastifyInstance) {
  // List all products
  app.get('/products', async (request, reply) => {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gt: 0,
        },
      },
      orderBy: {
        price: 'asc',
      },
    })

    return reply.send(products)
  })

  // Create a new product
  app.post('/products', async (request, response) => {
    try {
      console.log(request.body)

      const createProductSchema = z.object({
        name: z.string().min(3),
        description: z.string().min(15),
        price: z.string().transform(parseFloat),
        image: z.string(),
      })

      const { name, description, price, image } = createProductSchema.parse(
        request.body,
      )

      const product = await prisma.product.create({
        data: {
          userId: request.user.id,
          name,
          description,
          price,
          image,
        },
      })

      return response.send(product)
    } catch (error) {
      console.error('Validation error:', error)
    }
  })

  // Update an existing product
  // app.put('/products/:id', async (request, reply) => {
  //   const idSchema = z.object({
  //     id: z.string(),
  //   })

  //   const { id } = idSchema.parse(request.params)

  //   const updateProductSchema = z.object({
  //     name: z.string().min(3).optional(),
  //     description: z.string().min(5).optional(),
  //     price: z.number().positive().optional(),
  //     image: z.string().url().optional(),
  //   })

  //   const { name, description, price, image } = updateProductSchema.parse(
  //     request.body,
  //   )

  //   const updatedProduct = await prisma.product.update({
  //     where: {
  //       id: parseInt(id),
  //     },
  //     data: {
  //       name,
  //       description,
  //       price,
  //       image,
  //     },
  //   })

  //   return reply.send(updatedProduct)
  // })

  // Search by name
  // app.get('/products/search', async (request, reply) => {
  //   const createProductSchema = z.object({
  //     name: z.string().min(3),
  //   })

  //   const { name } = createProductSchema.parse(request.body)

  //   const products = await prisma.product.findMany({
  //     where: {
  //       name: {
  //         contains: name,
  //       },
  //     },
  //   })

  //   return reply.send(products)
  // })

  // Delete product
  // app.delete('/products/:id', async (request, reply) => {
  //   const idSchema = z.object({
  //     id: z.string(),
  //   })

  //   const { id } = idSchema.parse(request.params)

  //   await prisma.product.delete({
  //     where: {
  //       id: parseInt(id),
  //     },
  //   })

  //   return reply.send({ message: 'Product deleted successfully' })
  // })
}
