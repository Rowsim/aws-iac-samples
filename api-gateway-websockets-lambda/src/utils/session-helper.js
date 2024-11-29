import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi"
import { BatchWriteItemCommand, DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

const apiGatewayClient = new ApiGatewayManagementApiClient({
    endpoint: process.env.API_GATEWAY_CONNECTIONS_URL
})
const dynamoClient = new DynamoDBClient()
const TableName = process.env.SESSION_TABLE_NAME

export const subscribeToTopic = async (connectionId, topic) => {
    await dynamoClient.send(new PutItemCommand({
        TableName,
        Item: marshall({
            connectionId,
            topic,
            ttl: Math.floor(Date.now() / 1000) + 60 * 60,
        })
    }))
}

const getSubscribedTopics = async (connectionId) => {
    console.info(`Querying subscribed topics for connectionId ${connectionId}`)
    const queryResult = await dynamoClient.send(new QueryCommand({
        TableName,
        ExpressionAttributeValues: {
            ':connectionId': marshall(connectionId)
        },
        KeyConditionExpression: 'connectionId = :connectionId',
        ProjectionExpression: 'connectionId, topic',
    }))

    if (!queryResult?.Items) return null
    return queryResult.Items.map(item => unmarshall(item))
}

export const unsubscribeFromAllTopics = async (connectionId) => {
    const topicSessions = await getSubscribedTopics(connectionId)
    if (!topicSessions) throw new Error('No subscribed topics found')
    if (topicSessions.length < 1) {
        console.warn(`No topic subscriptions found for ${connectionId}`)
        return
    }
    await dynamoClient.send(new BatchWriteItemCommand({
        RequestItems: {
            [TableName]: topicSessions.map(({ connectionId, topic }) => ({
                DeleteRequest: { Key: marshall({ connectionId, topic }) }
            }))
        }
    }))
}

const getConnectionsForTopic = async (topic) => {
    console.info(`Querying all connections for ${topic} topic`)
    const queryResult = await dynamoClient.send(new QueryCommand({
        TableName,
        IndexName: 'topic',
        ExpressionAttributeValues: {
            ':topic': marshall(topic)
        },
        KeyConditionExpression: 'topic = :topic',
        ProjectionExpression: 'connectionId',
    }))

    if (!queryResult?.Items) return null
    return queryResult.Items.map(item => unmarshall(item))
}

const sendMessageViaGateway = async (connectionId, message) => {
    await apiGatewayClient.send(new PostToConnectionCommand({
        Data: JSON.stringify(message),
        ConnectionId: connectionId
    }))
}

export const publishMessageForTopic = async (topic, message) => {
    const connections = await getConnectionsForTopic(topic)
    if (connections.length < 1) {
        console.warn(`No connections subscribed to topic: ${topic} skipping message`)
        return
    }

    const connectionIds = connections.map(connection => connection.connectionId)
    await Promise.all(connectionIds.map((id) => sendMessageViaGateway(id, message)))
}

export const initConnection = async (connectionId) => {
    await subscribeToTopic(connectionId, "INIT_CONNECTION")
}
