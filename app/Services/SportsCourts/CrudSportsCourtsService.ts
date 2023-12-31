import SportsCenter from 'App/Models/SportsCenter'
import SportsCourt from 'App/Models/SportsCourt'
import DuplicateNameService from './DuplicateNameService'
import ImagesService from '../Images/ImagesService'

const serviceNameDuplicate = new DuplicateNameService()
const uploadImage = new ImagesService()

export default class CrudSportsCourtsService {
  public async createSportsCourts(
    sportsCenter: SportsCenter,
    sportsCourtPayload,
    image
  ): Promise<SportsCourt> {
    await serviceNameDuplicate.nameDuplicate(sportsCourtPayload.name, sportsCenter.id)

    const photoUrl = await uploadImage.uploadImage(image)
    sportsCourtPayload.photoUrls = photoUrl

    const sportsCourt = await sportsCenter.related('sportsCourt').create(sportsCourtPayload)

    return sportsCourt
  }

  public async updateSportsCourts(sportsCourtId: number, sportsCourtPayload): Promise<SportsCourt> {
    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)
    await serviceNameDuplicate.nameDuplicate(sportsCourtPayload.name, sportsCourt.sportsCenterId)

    const updateSportsCourt = await sportsCourt.merge(sportsCourtPayload).save()

    return updateSportsCourt
  }

  public async deleteSportsCourts(sportsCourtId: number): Promise<string> {
    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)
    const name = sportsCourt.name

    await sportsCourt.delete()

    return name
  }

  public filterByQueryString(text: string, sportsCenterId: number, sportsCourtId: number) {
    if (text && sportsCenterId) return this.filterByText(text, sportsCenterId)
    else if (sportsCourtId) return this.filterById(sportsCourtId)
    else return this.all(sportsCenterId)
  }

  private all(sportsCenterId: number) {
    return SportsCourt.query().where('sports_center_id', sportsCenterId)
  }

  private filterById(sportsCourtId: number) {
    return SportsCourt.query().where('id', sportsCourtId)
  }

  private filterByText(text: string, sportsCenterId: number) {
    return SportsCourt.query().withScopes((scope) => scope.withText(text, sportsCenterId))
  }
}
