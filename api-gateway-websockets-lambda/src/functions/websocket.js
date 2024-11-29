import { initConnection, unsubscribeFromAllTopics, subscribeToTopic, publishMessageForTopic } from "../utils/session-helper";

export const handler = async (event) => {
    try {
        const { connectionId, routeKey } = event.requestContext
        console.info(`received connectionId: ${connectionId} and routeKey: ${routeKey}`)

        const response = { statusCode: 200, body: '' };
        switch (routeKey) {
            case '$connect':
                console.info(`${routeKey} - creating session for ${connectionId}`)
                await initConnection(connectionId)
                return response
            case '$disconnect':
                console.info(`${routeKey} - removing session for ${connectionId}, unsubscribing from all topics`)
                await unsubscribeFromAllTopics(connectionId)
                return response
            default:
                console.info(`${routeKey} - ${connectionId}`);
                if (!event.body) {
                    console.warn('Missing event body skipping')
                    return response;
                }
                const { topic, type, message } = JSON.parse(event.body);

                switch (type) {
                    case 'subscribe':
                        console.info(`${type} - subscribing ${connectionId} to ${topic}`)
                        await subscribeToTopic(connectionId, topic)
                    case 'message':
                        console.info(`${type} - publishing message from ${connectionId} to ${topic} subscribers`)
                        await publishMessageForTopic(topic, message)
                }
                return response
        }
    } catch (ex) {
        console.error(ex);
    }

    return null
}
