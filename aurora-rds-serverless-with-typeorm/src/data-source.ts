import "reflect-metadata"
import {
    DataSource
} from "typeorm"
import { Employee } from "./entity/Employee"
import { Office } from "./entity/Office"

export const AppDataSource = new DataSource({
    type: 'aurora-postgres',
    database: 'postgres',
    resourceArn: process.env.RDS_DB_CLUSTER_ARN,
    secretArn: process.env.RDS_DB_SECRET_ARN,
    region: 'eu-west-1',
    entities: [Office, Employee],
    synchronize: true,
    dropSchema: true,
    logging: true,
})
