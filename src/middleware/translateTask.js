const { CloudTasksClient } = require("@google-cloud/tasks");

const client = new CloudTasksClient();

async function translateAdDescriptionTask(payload) {


  console.log('start translate task');
  const project = process.env.GCLOUD_PROJECT_ID;
  const queue = process.env.QUEUE;
  const location = process.env.LOCATION;
  inSeconds = 2;

  const parent = client.queuePath(project, location, queue);

  const task = {
    appEngineHttpRequest: {
      httpMethod: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      relativeUri: `/ad/translate/${payload.adName}`
    },
  };

  const requestBody = JSON.stringify({description: payload.description });

  if (payload) {
    task.appEngineHttpRequest.body =
      Buffer.from(requestBody).toString("base64");
  }

  if (inSeconds) {
    task.scheduleTime = {
      seconds: 0,
    };
  }




  const request = {parent: parent, task: task};
  const [response] = await client.createTask(request);

  //return response;

}



module.exports = { translateAdDescriptionTask };
