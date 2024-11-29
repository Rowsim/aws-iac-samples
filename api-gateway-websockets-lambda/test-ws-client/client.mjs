import WebSocket from 'ws'

const WS_ENDPOINT = process.env.WS_API

const testWS1 = new WebSocket(WS_ENDPOINT, {
    perMessageDeflate: false
})
const testWS2 = new WebSocket(WS_ENDPOINT, {
    perMessageDeflate: false
})
const testWS3 = new WebSocket(WS_ENDPOINT, {
    perMessageDeflate: false
})

const topic = 'TEST_MESSAGES'

testWS1.on('open', () => {
    console.info('\x1b[34m WS1 connected')

    let count = 0

    setInterval(() => {
        const message = {
            type: 'message',
            topic,
            message: `count:: ${count}`,
        }
        testWS1.send(JSON.stringify(message), (err) => {
            if (err) {
                console.error(`Failed to send message from WS1`, err)
            }
            console.info(`\x1b[34m Sent message from WS1: ${message.message}`)
        })
        count++
    }, 5000);
})
testWS2.on('open', () => {
    console.info(`\x1b[32m Subscribing WS2 to topic ${topic}`)
    testWS2.send(JSON.stringify({
        type: 'subscribe',
        topic
    }), (err) => {
        if (err) {
            console.error('Failed to send subscribe message from WS2')
        }
    })
})
testWS3.on('open', () => {
    console.info(`\x1b[32m Subscribing WS3 to topic ${topic}`)
    testWS3.send(JSON.stringify({
        type: 'subscribe',
        topic
    }), (err) => {
        if (err) {
            console.error('Failed to send subscribe message from WS3')
        }
    })
})

testWS2.on('message', (message) => {
    console.log(`\x1b[32m WS2 received ${message}`);
})
testWS3.on('message', (message) => {
    console.log(`\x1b[32m WS3 received ${message}`);
})

testWS1.on('error', console.error)
testWS2.on('error', console.error)
testWS3.on('error', console.error)