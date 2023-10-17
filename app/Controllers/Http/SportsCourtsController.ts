import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuditLog from 'App/Models/AuditLog'
import SportsCenter from 'App/Models/SportsCenter'
import SportsCourt from 'App/Models/SportsCourt'
import CreateSportsCourtValidator from 'App/Validators/CreateSportsCourtValidator'
import UptadeSportsCourtValidator from 'App/Validators/UptadeSportsCourtValidator'

export default class SportsCourtsController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response }: HttpContextContract) {
    const { text, ['sportsCourt']: sportsCourtId } = request.qs()
    const sportsCenterId = request.param('sportsCenterId') as number

    const sportsCourtQuery = this.filterByQueryString(text, sportsCenterId, sportsCourtId)
    const sportsCourts = await sportsCourtQuery

    return response.ok({ sportsCourts })
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const sportsCourtPayload = await request.validate(CreateSportsCourtValidator)

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    const sportsCourt = await sportsCenter.related('sportsCourt').create(sportsCourtPayload)

    const user = await auth.authenticate()
    await this.auditLog(
      'CREATE SPORTSCOURT',
      `User ${user.name} create a Sports Court: ${sportsCourt.name} at Sports Center: ${sportsCenter.name}.`,
      user.id
    )

    response.created({ sportsCourt })
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const sportsCourtId = request.param('sportsCourtId') as number
    const sportsCourtPayload = await request.validate(UptadeSportsCourtValidator)

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)

    const updatedSportsCourt = await sportsCourt.merge(sportsCourtPayload).save()

    const user = await auth.authenticate()
    await this.auditLog(
      'UPDATE SPORTSCOURT',
      `User ${user.name} update a Sports Court: ${sportsCourt.name} at Sports Center: ${sportsCenter.name}.`,
      user.id
    )

    response.ok({ sportsCourt: updatedSportsCourt })
  }

  public async destroy({ request, response, bouncer, auth }: HttpContextContract) {
    const sportsCenterId = request.param('sportsCenterId') as number
    const sportsCourtId = request.param('sportsCourtId') as number

    const sportsCenter = await SportsCenter.findOrFail(sportsCenterId)

    await bouncer.authorize('manageSportsCenter', sportsCenter)
    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)

    const user = await auth.authenticate()
    await this.auditLog(
      'DELETE SPORTSCOURT',
      `User ${user.name} delete a Sports Court: ${sportsCourt.name} at Sports Center: ${sportsCenter.name}.`,
      user.id
    )

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
