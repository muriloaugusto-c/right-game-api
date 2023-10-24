import User from 'App/Models/User'
import Address from 'App/Models/Address'
import DocValidatorService from './DocValidatorService'
import DuplicateService from './DuplicateService'

export default class CrudUsersService {
  public async createUser(userPayload, addressPayload): Promise<{ user: User; address: Address }> {
    const serviceValidDoc = new DocValidatorService()
    const serviceDuplicate = new DuplicateService()

    await serviceDuplicate.emailDuplicate(userPayload.email)
    await serviceDuplicate.docDuplicate(userPayload.doc)
    await serviceValidDoc.validateDoc(userPayload.doc)

    const user = await User.create(userPayload)
    const address = await user.related('address').create(addressPayload)

    return { user, address }
  }

  public async updateUser(
    id: number,
    userPayload,
    addressPayload
  ): Promise<{ user: User; address: Address }> {
    const user = await User.findOrFail(id)
    const address = await Address.findByOrFail('userId', user.id)

    const updatedUser = await user.merge(userPayload).save()
    const updatedAddress = await address.merge(addressPayload).save()

    return { user: updatedUser, address: updatedAddress }
  }
  public async deleteUser(id: number): Promise<string> {
    const user = await User.findOrFail(id)
    const name = user.name

    await user.delete()
    return name
  }

  public async filterByQueryString(text: string, userId: number) {
    if (userId) return this.filterByUser(userId)
    else if (text) return this.filterbyText(text)
    else return this.all()
  }

  private all() {
    return User.query().preload('address')
  }

  private filterByUser(userId: number) {
    return User.query()
      .preload('address')
      .withScopes((scope) => scope.withId(userId))
  }

  private filterbyText(text: string) {
    return User.query()
      .preload('address')
      .withScopes((scope) => scope.withText(text))
  }
}
