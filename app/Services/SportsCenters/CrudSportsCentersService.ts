import Address from 'App/Models/Address'
import SportsCenter from 'App/Models/SportsCenter'
import User from 'App/Models/User'

import DuplicateNameService from './DuplicateNameService'
import ImagesService from '../Images/ImagesService'

const uploadImage = new ImagesService()

export default class CrudSportsCentersService {
  public async createSportsCenter(
    sportsCenterPayload,
    addressPayload,
    user: User,
    image
  ): Promise<{ sportsCenter: SportsCenter; address: Address }> {
    const serviceNameDuplicate = new DuplicateNameService()
    await serviceNameDuplicate.nameDuplicate(sportsCenterPayload.name)

    const photoUrl = await uploadImage.uploadImage(image)
    sportsCenterPayload.photoUrls = photoUrl

    const sportsCenter = await SportsCenter.create(sportsCenterPayload)
    await sportsCenter.related('owner').associate(user)

    const address = await sportsCenter.related('address').create(addressPayload)
    await sportsCenter.related('inventory').create({})

    return { sportsCenter, address }
  }

  public async updateSportsCenter(
    sportsCenterId: number,
    sportsCenterPayload,
    addressPayload
  ): Promise<{ sportsCenter: SportsCenter; address: Address }> {
    const serviceNameDuplicate = new DuplicateNameService()
    await serviceNameDuplicate.nameDuplicate(sportsCenterPayload.name)

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)
    const address = await Address.findByOrFail('sportsCenterId', sportsCenterId)

    const updatedSportsCenter = await sportsCenter.merge(sportsCenterPayload).save()
    const updatedAddress = await address.merge(addressPayload).save()

    return { sportsCenter: updatedSportsCenter, address: updatedAddress }
  }

  public async deleteSportsCenter(sportsCenterId: number): Promise<string> {
    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)
    const address = await Address.findByOrFail('sportsCenterId', sportsCenterId)
    const name = sportsCenter.name

    await sportsCenter.delete()
    await address.delete()

    return name
  }

  public async filterByQueryString(text: string, sportsCenterId: number, owner: number) {
    if (owner) return this.filterByOwner(owner)
    else if (sportsCenterId) return this.filterById(sportsCenterId)
    else if (text) return this.filterbyText(text)
    else return this.all()
  }

  private all() {
    return SportsCenter.query().preload('address').preload('owner').preload('inventory')
  }

  private filterById(sportsCenterId: number) {
    return SportsCenter.query()
      .preload('address')
      .preload('owner')
      .preload('inventory')
      .withScopes((scope) => scope.withId(sportsCenterId))
  }

  private filterbyText(text: string) {
    return SportsCenter.query()
      .preload('address')
      .preload('owner')
      .preload('inventory')
      .withScopes((scope) => scope.withText(text))
  }

  private filterByOwner(owner: number) {
    return SportsCenter.query()
      .preload('address')
      .preload('owner')
      .preload('inventory')
      .withScopes((scope) => scope.withOwner(owner))
  }
}
