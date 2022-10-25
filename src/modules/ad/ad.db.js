const { datastore } = require("../../../datastore");

async function createAd(adData) {
  // The kind for the new entity
  const kind = "Ad";

  const adKey = datastore.key([kind]);

  const ad = {
    key: adKey,
    data: {
      name: adData.name,
      description: adData.description,
      author: adData.author,
      price: adData.price,
    },
  };

  await datastore.save(ad);

  return `Saved ${task.key.name}: ${task.data.description}`;
}

module.exports = { createAd };
