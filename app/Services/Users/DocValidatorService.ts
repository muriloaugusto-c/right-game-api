import BadRequestException from 'App/Exceptions/BadRequestException'
import { cpf, cnpj } from 'cpf-cnpj-validator'

export default class DocValidatorService {
  public async validateCpf(doc: string): Promise<boolean> {
    if (cpf.isValid(doc)) return true
    else throw new BadRequestException('CPF invalid', 409)
  }

  public async validateCnpj(doc: string): Promise<boolean> {
    if (cnpj.isValid(doc)) return true
    else throw new BadRequestException('CNPJ invalid', 409)
  }
}
