module.exports = {
  publishMessage: async (pubSubClient, topicName, payload) => {
    const dataBuffer = Buffer.from(JSON.stringify(payload));

    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    return messageId;
  },

  listenForPullMessages: (pubSubClient, subscriptionName, timeout) => {
    const subscription = pubSubClient.subscription(subscriptionName);

    let messageCount = 0;
    const messageHandler = (message) => {
      // console.log(`Received message ${message.id}:`);
      // console.log(`\tData: ${message.data}`);
      // console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;

      message.ack();
    };

    subscription.on("message", messageHandler);

    setTimeout(() => {
      subscription.removeListener("message", messageHandler);
    }, timeout * 1000);
  },

  listenForPushMessages: (payload) => {
    const message = Buffer.from(payload, "base64").toString("utf-8");
    let parsedMessage = JSON.parse(message);
    return parsedMessage;
  },
};
