import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { IBackup, IMemoryDb, newDb } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.synchronize()
  return db
}

describe('pgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  afterAll(async () => {
    backup.restore()
    await getConnection().close()
  })

  beforeEach(() => {
    sut = new PgUserAccountRepository()
  })

  describe('load', () => {
    it('should return an user when called with valid email', async () => {
      const createdPgUser = pgUserRepo.create({ email: 'existing_email' })
      await pgUserRepo.save(createdPgUser)

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email not exists', async () => {
      const account = await sut.load({ email: 'new_email' })

      expect(account).toBe(undefined)
    })
  })
})
