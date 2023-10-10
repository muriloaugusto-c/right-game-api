import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Inventory from 'App/Models/Inventory'
import Product from 'App/Models/Product'
import SportsCenter from 'App/Models/SportsCenter'
import ProductValidator from 'App/Validators/ProductValidator'
import UpdateProductValidator from 'App/Validators/UpdateProductValidator'

export default class ProductsController {
  public async index({ request, response }: HttpContextContract) {
    const { text } = request.qs()
    const sportsCenterId = request.param('sportsCenterId') as number

    const sportsCenterQuery = this.filterByQueryString(text, sportsCenterId)
    const sportsCenter = await sportsCenterQuery

    return response.ok({ sportsCenter })
  }

  public async store({ request, response }: HttpContextContract) {
    const id = request.param('sportsCenterId') as number
    const productPayload = await request.validate(ProductValidator)

    const sportsCenter = await SportsCenter.findOrFail(id)

    await sportsCenter.load('inventory')
    const inventory = sportsCenter.inventory

    const product = await inventory.related('products').create(productPayload)

    response.created({ product })
  }

  public async update({ request, response }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const productId = request.param('productId') as number
    const productPayload = await request.validate(UpdateProductValidator)

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)
    await sportsCenter.load('inventory')
    const inventory = sportsCenter.inventory

    const product = await Product.findOrFail(productId)
    const updatedProduct = await product.merge(productPayload).save()

    response.ok({ product: updatedProduct })
  }

  public async delete({ request, response }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const productId = request.param('productId') as number

    const product = await Product.findOrFail(productId)
    await product.delete()

    response.ok({})
  }

  private filterByQueryString(text: string, sportsCenterId: number) {
    if (text && text) return this.filterByText(text, sportsCenterId)
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
