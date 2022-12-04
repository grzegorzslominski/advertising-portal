const { CloudTasksClient } = require("@google-cloud/tasks");

const client = new CloudTasksClient();

async function updateAdAfterTranslate(payload) {
  const project = process.env.GCLOUD_PROJECT_ID;
  const queue = process.env.QUEUE;
  const location = process.env.LOCATION;

  const parent = client.queuePath(project, location, queue);

  const task = {
    appEngineHttpRequest: {
      httpMethod: "PATCH",
      relativeUri: `/ad/update/${payload.name}`,
    },
  };

  const requestBody = JSON.stringify({ translations: payload.data });
  console.log(payload);
  if (requestBody) {
    task.appEngineHttpRequest.body =
      Buffer.from(requestBody).toString("base64");
  }

  const request = {
    parent: parent,
    task: task,
  };

  // console.log("Sending task:");
  // console.log(task);
  // Send create task request.
  const [response] = await client.createTask(request);
  const name = response.name;
  // console.log(`Created task ${name}`);
}

module.exports = { updateAdAfterTranslate };
