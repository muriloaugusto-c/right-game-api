import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuditLog from 'App/Models/AuditLog'
import SportsCenter from 'App/Models/SportsCenter'
import CrudProductsService from 'App/Services/Products/CrudProductsService'
import CreateProductValidator from 'App/Validators/CreateProductValidator'
import UpdateProductValidator from 'App/Validators/UpdateProductValidator'

const service = new CrudProductsService()

export default class ProductsController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response }: HttpContextContract) {
    try {
      const { text, ['product']: productId } = request.qs()
      const sportsCenterId = request.param('sportsCenterId') as number

      const products = await service.filterByQueryString(text, sportsCenterId, productId)

      return response.ok({ products })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const id = request.param('sportsCenterId') as number

      const sportsCenter = await SportsCenter.findOrFail(id)

      await bouncer.authorize('manageSportsCenter', sportsCenter)
      const productPayload = await request.validate(CreateProductValidator)

      const product = await service.createProduct(sportsCenter, productPayload)

      await this.auditLog(
        'ADD PRODUCT',
        `User ${user.name} add a Product: ${product.name} at Sports Center: ${sportsCenter.name}.`,
        user.id
      )

      response.created({ product })
    } catch (error) {
      if (error.messages)
        response.status(error.status).send({ code: error.code, message: error.messages })
      else response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const sportsCenterId = request.param('sportsCenterId') as number
      const productId = request.param('productId') as number

      const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)
      await bouncer.authorize('manageSportsCenter', sportsCenter)

      const productPayload = await request.validate(UpdateProductValidator)

      const product = await service.updateProduct(productId, productPayload)

      await this.auditLog(
        'UPDATE PRODUCT',
        `User ${user.name} update a Product: ${product.name} at Sports Center: ${sportsCenter.name}.`,
        user.id
      )

      response.ok({ product })
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }

  public async destroy({ request, response, bouncer, auth }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const sportsCenterId = request.param('sportsCenterId') as number
      const productId = request.param('productId') as number

      const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)
      await bouncer.authorize('manageSportsCenter', sportsCenter)

      const productName = await service.deleteProduct(productId)

      await this.auditLog(
        'DELETE PRODUCT',
        `User ${user.name} delete a Product: ${productName} at Sports Center: ${sportsCenter.name}.`,
        user.id
      )

      response.ok({})
    } catch (error) {
      response.status(error.status).send({ code: error.code, message: error.message })
    }
  }
}
