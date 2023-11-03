import BadRequestException from 'App/Exceptions/BadRequestException'
import Product from 'App/Models/Product'

export default class DuplicateNameService {
  public async nameDuplicate(name: string): Promise<boolean> {
    const product = await Product.findBy('name', name)
    if (product) throw new BadRequestException('Name is already in use', 409)
    else return true
  }
}
