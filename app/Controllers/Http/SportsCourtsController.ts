import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SportsCenter from 'App/Models/SportsCenter'
import SportsCourt from 'App/Models/SportsCourt'
import CreateSportsCourtValidator from 'App/Validators/CreateSportsCourtValidator'
import UptadeSportsCourtValidator from 'App/Validators/UptadeSportsCourtValidator'

export default class SportsCourtsController {
  public async index({ request, response }: HttpContextContract) {
    const { text, ['sportsCourt']: sportsCourtId } = request.qs()
    const sportsCenterId = request.param('sportsCenterId') as number

    const sportsCourtQuery = this.filterByQueryString(text, sportsCenterId, sportsCourtId)
    const sportsCourt = await sportsCourtQuery

    return response.ok({ sportsCourt })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const sportsCourtPayload = await request.validate(CreateSportsCourtValidator)

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    const sportsCourt = await sportsCenter.related('sportsCourt').create(sportsCourtPayload)

    response.created({ sportsCourt })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const sportsCourtId = request.param('sportsCourtId') as number
    const sportsCourtPayload = await request.validate(UptadeSportsCourtValidator)

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)

    const updatedSportsCourt = await sportsCourt.merge(sportsCourtPayload).save()

    response.ok({ sportsCourt: updatedSportsCourt })
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const sportsCourtId = request.param('sportsCourtId') as number

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)
    await sportsCourt.delete()
    response.ok({})
  }

  private filterByQueryString(text: string, sportsCenterId: number, sportsCourtId: number) {
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
