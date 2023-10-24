import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Address from 'App/Models/Address'
import AuditLog from 'App/Models/AuditLog'
import Inventory from 'App/Models/Inventory'
import SportsCenter from 'App/Models/SportsCenter'
import CreateAddressValidator from 'App/Validators/CreateAddressValidator'
import CreateSportsCenterValidator from 'App/Validators/CreateSportsCenterValidator'
import UpdateAdressValidator from 'App/Validators/UpdateAdressValidator'
import UpdateSportsCenterValidator from 'App/Validators/UpdateSportsCenterValidator'

export default class SportsCentersController {
  private async auditLog(action: string, details: string, userId: number) {
    await AuditLog.create({
      action,
      details,
      userId,
    })
  }

  public async index({ request, response }: HttpContextContract) {
    const { text, ['sportsCenter']: sportsCenterId, owner } = request.qs()

    const sportsCenterQuery = this.filterByQueryString(text, sportsCenterId, owner)
    const sportsCenters = await sportsCenterQuery

    return response.ok({ sportsCenters })
  }

  public async store({ request, response, bouncer, auth }: HttpContextContract) {
    await bouncer.authorize('createSportsCenter')

    const sportsCenterPayload = await request.validate(CreateSportsCenterValidator)
    const addressPayload = await request.validate(CreateAddressValidator)

    const address = await Address.create(addressPayload)
    const sportsCenter = await address.related('sportsCenter').create(sportsCenterPayload)

    const inventory = await Inventory.create({ sportsCenterId: sportsCenter.id })

    await sportsCenter.related('inventory').save(inventory)

    const user = await auth.authenticate()
    await this.auditLog(
      'CREATE SPORTSCENTER',
      `User ${user.name} created a new Sports Center: ${sportsCenter.name}.`,
      user.id
    )

    response.created({ sportsCenter })
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    const id = request.param('sportsCenterId') as number
    const sportsCenterPayload = await request.validate(UpdateSportsCenterValidator)
    const addressPayload = await request.validate(UpdateAdressValidator)

    const sportsCenter = await SportsCenter.findOrFail(id)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    const updatedSportsCenter = await sportsCenter.merge(sportsCenterPayload).save()

    const addressId = sportsCenter.addressId

    const address = await Address.findOrFail(addressId)
    const updatedAddress = await address.merge(addressPayload).save()

    const user = await auth.authenticate()
    await this.auditLog(
      'UPDATE SPORTSCENTER',
      `User ${user.name} update a Sports Center: ${sportsCenter.name}.`,
      user.id
    )

    response.ok({ sportsCenter: updatedSportsCenter, address: updatedAddress })
  }

  public async destroy({ request, response, bouncer, auth }: HttpContextContract) {
    const id = request.param('sportsCenterId') as number

    const sportsCenter = await SportsCenter.findOrFail(id)
    const address = await Address.findOrFail(sportsCenter.addressId)

    await bouncer.authorize('manageSportsCenter', sportsCenter)

    const user = await auth.authenticate()
    await this.auditLog(
      'DELETE SPORTSCENTER',
      `User ${user.name} delete a Sports Center: ${sportsCenter.name}.`,
      user.id
    )

    await sportsCenter.delete()
    await address.delete()

    response.ok({})
  }

  private filterByQueryString(text: string, sportsCenterId: number, owner: string) {
    if (owner) return this.filterByOwner(owner)
    else if (sportsCenterId) return this.filterById(sportsCenterId)
    else if (text) return this.filterbyText(text)
    else return this.all()
  }

  private all() {
    return SportsCenter.query().preload('address').preload('ownerUser').preload('inventory')
  }

  private filterById(sportsCenterId: number) {
    return SportsCenter.query()
      .preload('address')
      .preload('ownerUser')
      .preload('inventory')
      .withScopes((scope) => scope.withId(sportsCenterId))
  }

  private filterbyText(text: string) {
    return SportsCenter.query()
      .preload('address')
      .preload('ownerUser')
      .preload('inventory')
      .withScopes((scope) => scope.withText(text))
  }

  private filterByOwner(owner: string) {
    return SportsCenter.query()
      .preload('address')
      .preload('ownerUser')
      .preload('inventory')
      .withScopes((scope) => scope.withOwner(owner))
  }
}
