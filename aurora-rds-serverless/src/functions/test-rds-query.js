const { RDSDataClient, ExecuteStatementCommand } = require('@aws-sdk/client-rds-data');
const rdsClient = new RDSDataClient()

const handler = async (event) => {
    console.info('event::', event)

    const res = await rdsClient.send(new ExecuteStatementCommand({
        resourceArn: 'arn:aws:rds:eu-west-1:ACCOUNT_ID:cluster:aurora-sls-cluster',
        database: 'db1',
        includeResultMetadata: true,
        secretArn: 'REDACTED AWS SM CREDS',
        sql: "SELECT u.id, u.name, u.age, o.location FROM users u JOIN offices o ON u.officeID = o.officeID WHERE o.officeID = 'OfficeA'"
    }))

    console.debug('result', res)
    console.debug('records', res.records)
    console.debug('formattedRecords', res.formattedRecords)
    console.debug('res string', JSON.stringify(res, null, 2))
}

module.exports = {
    handler
}