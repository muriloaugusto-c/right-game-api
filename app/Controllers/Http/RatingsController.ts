import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SportsCourt from 'App/Models/SportsCourt'
import User from 'App/Models/User'
import CreateRatingValidator from 'App/Validators/CreateRatingValidator'

export default class RatingsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const sportsCourtId = request.param('sportsCourtId') as number
    const ratingPayload = await request.validate(CreateRatingValidator)

    const sportsCourt = await SportsCourt.findOrFail(sportsCourtId)
    const user = await auth.authenticate()

    const reservationCheck = await

    const rating = await sportsCourt.related('rating').create(ratingPayload)

    response.created({ rating })
  }
}
