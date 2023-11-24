import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { PgUser } from '../entities'
import { getRepository } from 'typeorm'

export class PgUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } })
    if (pgUser != undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser?.name ?? undefined
      }
    }
  }
}
