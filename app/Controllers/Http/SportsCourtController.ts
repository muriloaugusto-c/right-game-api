import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SportsCourt from 'App/Models/SportsCourt'
import CreateSportsCourt from 'App/Validators/CreateSportsCourtValidator'

export default class SportsCourtController {
  public async store({ request, response }: HttpContextContract) {
    const sportsCourtPayload = await request.validate(CreateSportsCourt)
    const sportsCourt = await SportsCourt.create(sportsCourtPayload)

    response.created({ sportsCourt })
  }

  public async index({ response }: HttpContextContract) {
    const sportsCourts = await SportsCourt.query().preload('ownerUser')
    response.ok({ sportsCourts })
  }

  public async getAllQuadras({ response }: HttpContextContract) {
    const sportsCourts = await SportsCourt.query()
    response.ok({ sportsCourts })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('sportsCourtId') as number
    const sportsCourtPayload = request.all()

    const sportsCourt = await SportsCourt.findOrFail(id)

    const updatedSportsCourt = await sportsCourt.merge(sportsCourtPayload).save()

    response.ok({ sportsCourt: updatedSportsCourt })
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('sportsCourtId') as number
    const sportsCourt = await SportsCourt.findOrFail(id)
    console.log(request)
    await sportsCourt.delete()

    response.ok({})
  }

  public async show({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('sportsCourtId') as number
    const sportsCourt = await SportsCourt.findOrFail(id)

    response.ok({ sportsCourt })
  }
}
