import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee"
import { Office } from "../entity/Office";
/*
typeorm needs this patch in PostgresQueryRunner:
`('"' || "udt_schema" || '"."' || "udt_name" || '"')::"text" AS "regtype", pg_catalog.format_type("col_attr"."atttypid", "col_attr"."atttypmod") AS "format_type" ` +
https://github.com/ArsenyYankovsky/typeorm-aurora-data-api-driver/issues/164#issuecomment-2305214788
*/
export const handler = async (event: any) => {
    console.info('event::', event)

    AppDataSource.initialize().then(async () => {
        console.log('AppDataSource initialized')

        const officeRepository = AppDataSource.getRepository(Office);
        officeRepository.save(officeRepository.create({
            name: 'Brickhouse',
            capacity: 85
        })).then((storedOffice) => {
            console.log('Saved new office', storedOffice)

            const employeeRepository = AppDataSource.getRepository(Employee);
            employeeRepository.save(employeeRepository.create({
                name: 'John Doe',
                age: 44,
                office: storedOffice
            })).then(async storedEmployee => {
                        console.log('Saved new employee', storedEmployee)
            })
        })
        // TODO figure out why using await is causing transaction errors and remove promise chains
        // await employeeRepository.save(employeeRepository.create({
        //     name: 'John Doe',
        //     age: 44,
        //     office: storedOffice
        // }))

        // const allOffices = await officeRepository.find()
        // console.log("All offices from the db: ", allOffices)
        const employeeRepository = AppDataSource.getRepository(Employee);
        const allEmployees = await employeeRepository.find({ relations: ['office'] })
        console.log("All employees from the db: ", allEmployees)
    }).catch(e => {
        console.error(e)
    });
}