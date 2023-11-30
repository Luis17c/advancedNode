import { ConnectionOptions } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'motty.db.elephantsql.com',
  port: 5432,
  username: 'ucmklnot',
  password: 'POZeeqQvb1AFqLTiX1rtm1MiPLt1pAlk',
  database: 'ucmklnot',
  entities: [PgUser],
  synchronize: true
}
