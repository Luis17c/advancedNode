import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { IBackup, newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, getRepository, Repository } from 'typeorm'

class PgUserAccountRepository {
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

@Entity({ name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name!: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId!: string
}

describe('pgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let connection: any
  let backup: IBackup

  beforeAll(async () => {
    const db = newDb()
    connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser]
    })
    await connection.synchronize()
    backup = db.backup()
    pgUserRepo = connection.getRepository(PgUser)
  })

  afterAll(async () => {
    backup.restore()
    connection.close()
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
