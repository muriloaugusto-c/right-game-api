import Inventory from 'App/Models/Inventory'
import Product from 'App/Models/Product'
import SportsCenter from 'App/Models/SportsCenter'
import DuplicateNameService from './DuplicateNameService'

const serviceDuplicateName = new DuplicateNameService()

export default class CrudProductsService {
  public async createProduct(sportsCenter: SportsCenter, productPayload): Promise<Product> {
    await sportsCenter.load('inventory')
    const inventory = sportsCenter.inventory
    await serviceDuplicateName.nameDuplicate(productPayload.name)
    const product = await inventory.related('products').create(productPayload)

    return product
  }

  public async updateProduct(productId: number, productPayload): Promise<Product> {
    const product = await Product.findOrFail(productId)
    if (productPayload.name) await serviceDuplicateName.nameDuplicate(productPayload.name)
    const productUpdate = await product.merge(productPayload).save()

    return productUpdate
  }

  public async deleteProduct(productId: number): Promise<string> {
    const product = await Product.findOrFail(productId)
    const name = product.name

    await product.delete()

    return name
  }

  public filterByQueryString(text: string, sportsCenterId: number, productId: number) {
    if (text && sportsCenterId) return this.filterByText(text, sportsCenterId)
    else if (productId) return this.filterByProductId(productId)
    else return this.all(sportsCenterId)
  }

  private all(sportsCenterId: number) {
    return Inventory.query().preload('products').where('sports_center_id', sportsCenterId)
  }

  private filterByProductId(productId: number) {
    return Product.query().where('id', productId)
  }

  private filterByText(text: string, sportsCenterId: number) {
    return Product.query()
      .preload('inventory')
      .withScopes((scope) => scope.withText(text, sportsCenterId))
  }
}
