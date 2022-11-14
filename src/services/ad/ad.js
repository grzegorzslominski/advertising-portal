const moment = require("moment");
const { datastore } = require("../../config/database/datastore");

async function getAdsDatastore(pageCursor) {
  let query = datastore
    .createQuery("Ad")
    .limit(5)
    .order("creationData", { descending: true });

  if (pageCursor) {
    const pageCursorWithSpecialChar = pageCursor.replaceAll(" ", "+");
    query = query.start(pageCursorWithSpecialChar);
  }
  const results = await datastore
    .runQuery(query)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });

  const entities = results[0];
  const info = results[1];

  let dataToSend = {
    ads: entities,
    endCursor: null,
  };

  if (info.moreResults !== datastore.NO_MORE_RESULTS) {
    dataToSend = { ...dataToSend, ads: entities, endCursor: info.endCursor };
  }

  return dataToSend;
}

async function getAdByNameDatastore(adName) {
  const query = datastore.createQuery("Ad").filter("name", "=", adName);
  const ad = await datastore
    .runQuery(query)
    .then((result) => {
      return result[0][0];
    })
    .catch((err) => {
      return err;
    });
  return ad;
}

async function createAdDatastore(adData) {
  const kind = "Ad";
  const adKey = datastore.key([kind]);

  const ad = {
    key: adKey,
    data: {
      name: adData.name,
      description: adData.description,
      author: adData.author,
      price: adData.price,
      creationData: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
    },
  };

  await datastore.save(ad);
  return ad;
}

async function updateAdDatastore(adData) {
  const ad = await getAdByNameDatastore(adData.name);

  Object.keys(adData.data).map((key) => {
    ad[key] = adData.data[key];
  });

  await datastore.save(ad);
}

async function deleteAdDatastore(adName) {
  const ad = await getAdByNameDatastore(adName);
  await datastore.delete(ad[datastore.KEY]);
}

module.exports = {
  getAdsDatastore,
  getAdByNameDatastore,
  createAdDatastore,
  updateAdDatastore,
  deleteAdDatastore,
};
