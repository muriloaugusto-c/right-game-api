import BadRequestException from 'App/Exceptions/BadRequestException'
import SportsCourt from 'App/Models/SportsCourt'

export default class DuplicateNameService {
  public async nameDuplicate(name: string): Promise<boolean> {
    const user = await SportsCourt.findBy('name', name)
    if (user) throw new BadRequestException('Name is already in use', 409)
    else return true
  }
}
