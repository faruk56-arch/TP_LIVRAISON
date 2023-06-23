const { MongoClient } = require("mongodb");
const { mongoConfig } = require("../config");

class MongoDB {
  static connectToMongoDB = () => {
    MongoClient.connect(mongoConfig.connectionUrl)
      .then((connection) => {
        console.log("MongoDB Connected");
        this.db = connection.db(mongoConfig.database);
      })
      .catch((error) => console.log(`MongoDB not Connected : ${error}`));
  };

  static saveOTP = async (phoneNumber, secret) => {
    const otpCollection = this.db.collection('otp');
    await otpCollection.updateOne({ phoneNumber }, { $set: { secret } }, { upsert: true });
  }

  static getSecret = async (phoneNumber) => {
    const otpCollection = this.db.collection('otp');
    const doc = await otpCollection.findOne({ phoneNumber });
    return doc ? doc.secret : null;
  }
}

MongoDB.db = null;

module.exports = MongoDB;
