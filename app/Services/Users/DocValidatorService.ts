import BadRequestException from 'App/Exceptions/BadRequestException'
import { cpf, cnpj } from 'cpf-cnpj-validator'

export default class DocValidatorService {
  public async validateDoc(doc: string): Promise<boolean> {
    if (cpf.isValid(doc) || cnpj.isValid(doc)) return true
    else throw new BadRequestException('Doc invalid', 409)
  }
}
