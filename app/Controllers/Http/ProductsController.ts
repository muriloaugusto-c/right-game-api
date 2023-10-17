import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuditLog from 'App/Models/AuditLog'
import Inventory from 'App/Models/Inventory'
import Product from 'App/Models/Product'
import SportsCenter from 'App/Models/SportsCenter'
import ProductValidator from 'App/Validators/ProductValidator'
import UpdateProductValidator from 'App/Validators/UpdateProductValidator'

export default class ProductsController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response }: HttpContextContract) {
    const { text } = request.qs()
    const sportsCenterId = request.param('sportsCenterId') as number

    const productsQuery = this.filterByQueryString(text, sportsCenterId)
    const products = await productsQuery

    return response.ok({ products })
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    const id = request.param('sportsCenterId') as number
    const productPayload = await request.validate(ProductValidator)

    const sportsCenter = await SportsCenter.findOrFail(id)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    await sportsCenter.load('inventory')
    const inventory = sportsCenter.inventory

    const product = await inventory.related('products').create(productPayload)

    const user = await auth.authenticate()
    await this.auditLog(
      'ADD PRODUCT',
      `User ${user.name} add a Product: ${product.name} at Sports Center: ${sportsCenter.name}.`,
      user.id
    )

    response.created({ product })
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const productId = request.param('productId') as number
    const productPayload = await request.validate(UpdateProductValidator)

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    const product = await Product.findOrFail(productId)
    const updatedProduct = await product.merge(productPayload).save()

    const user = await auth.authenticate()
    await this.auditLog(
      'UPDATE PRODUCT',
      `User ${user.name} update a Product: ${product.name} at Sports Center: ${sportsCenter.name}.`,
      user.id
    )

    response.ok({ product: updatedProduct })
  }

  public async destroy({ request, response, bouncer, auth }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const productId = request.param('productId') as number

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    const product = await Product.findOrFail(productId)

    const user = await auth.authenticate()
    await this.auditLog(
      'DELETE PRODUCT',
      `User ${user.name} delete a Product: ${product.name} at Sports Center: ${sportsCenter.name}.`,
      user.id
    )

    await product.delete()

    response.ok({})
  }

  private filterByQueryString(text: string, sportsCenterId: number) {
    if (text && sportsCenterId) return this.filterByText(text, sportsCenterId)
    else return this.all(sportsCenterId)
  }

  private all(sportsCenterId: number) {
    return Inventory.query().preload('products').where('sports_center_id', sportsCenterId)
  }

  private filterByText(text: string, sportsCenterId: number) {
    return Product.query()
      .preload('inventory')
      .withScopes((scope) => scope.withText(text, sportsCenterId))
  }
}
