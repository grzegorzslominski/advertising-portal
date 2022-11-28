const { CloudTasksClient } = require("@google-cloud/tasks");

const client = new CloudTasksClient();

async function translateAdDescriptionTask(payload) {
  const project = process.env.GCLOUD_PROJECT_ID;
  const queue = process.env.QUEUE;
  const location = process.env.LOCATION;

  const parent = client.queuePath(project, location, queue);

  const task = {
    appEngineHttpRequest: {
      httpMethod: "POST",
      relativeUri: "/ad/translate",
    },
  };

  const requestBody = JSON.stringify({ textToTranslate: payload });

  if (payload) {
    task.appEngineHttpRequest.body =
      Buffer.from(requestBody).toString("base64");
  }

  // if (inSeconds) {
  //   task.scheduleTime = {
  //     seconds: inSeconds + Date.now() / 1000,
  //   };
  // }

  const request = {
    parent: parent,
    task: task,
  };

  console.log("Sending task:");
  console.log(task);
  // Send create task request.
  const [response] = await client.createTask(request);
  const name = response.name;
  console.log(`Created task ${name}`);

  return response.JSON;
}

module.exports = { translateAdDescriptionTask };
