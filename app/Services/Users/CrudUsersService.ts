import Address from 'App/Models/Address'
import User from 'App/Models/User'

import DocValidatorService from './DocValidatorService'
import DuplicateService from './DuplicateService'

const serviceValidDoc = new DocValidatorService()
const serviceDuplicate = new DuplicateService()

export default class CrudUsersService {
  public async createUser(userPayload, addressPayload): Promise<{ user: User; address: Address }> {
    await serviceDuplicate.emailDuplicate(userPayload.email)
    await serviceDuplicate.docDuplicate(userPayload.doc)
    await serviceValidDoc.validateCpf(userPayload.doc)

    const user = await User.create(userPayload)
    const address = await user.related('address').create(addressPayload)

    return { user, address }
  }

  public async createOwner(userPayload, addressPayload): Promise<{ user: User; address: Address }> {
    await serviceDuplicate.emailDuplicate(userPayload.email)
    await serviceDuplicate.docDuplicate(userPayload.doc)
    await serviceValidDoc.validateCnpj(userPayload.doc)

    const user = await User.create(userPayload)
    await user.merge({ type: 'OWNER' }).save()
    const address = await user.related('address').create(addressPayload)

    return { user, address }
  }

  public async updateUser(
    userId: number,
    userPayload,
    addressPayload
  ): Promise<{ user: User; address: Address }> {
    const user = await User.findOrFail(userId)
    const address = await Address.findByOrFail('userId', user.id)

    const updatedUser = await user.merge(userPayload).save()
    const updatedAddress = await address.merge(addressPayload).save()

    return { user: updatedUser, address: updatedAddress }
  }
  public async deleteUser(id: number): Promise<string> {
    const user = await User.findOrFail(id)
    const address = await Address.findByOrFail('userId', user.id)
    const name = user.name

    await user.delete()
    await address.delete()

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
