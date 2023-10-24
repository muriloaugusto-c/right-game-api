import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class DuplicateService {
  public async emailDuplicate(email: string): Promise<boolean> {
    const user = await User.findBy('email', email)
    if (user) throw new BadRequestException('Email is already in use', 409)
    else return true
  }
  public async docDuplicate(doc: string): Promise<boolean> {
    const user = await User.findBy('doc', doc)
    if (user) throw new BadRequestException('Doc is already in use', 409)
    else return true
  }
}
