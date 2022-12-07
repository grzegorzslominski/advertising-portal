const { CloudTasksClient } = require("@google-cloud/tasks");

const client = new CloudTasksClient();

async function translateAdDescriptionTask(payload) {
  const project = process.env.GCLOUD_PROJECT_ID;
  const queue = process.env.TRANSLATION_QUEUQ;
  const location = process.env.LOCATION;

  inSeconds = 1;

  const parent = client.queuePath(project, location, queue);

  const task = {
    appEngineHttpRequest: {
      httpMethod: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      relativeUri: `/ad/translate/${payload.adName}`,
    },
  };

  const requestBody = JSON.stringify({ description: payload.description });

  if (payload) {
    task.appEngineHttpRequest.body =
      Buffer.from(requestBody).toString("base64");
  }

  if (inSeconds) {
    task.scheduleTime = {
      seconds: 0,
    };
  }

  const request = { parent: parent, task: task };
  client.createTask(request);
}

module.exports = { translateAdDescriptionTask };
