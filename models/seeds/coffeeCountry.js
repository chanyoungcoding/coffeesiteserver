const mongoose = require('mongoose');
const coffeeCountryList= require('./커피나라.json');

require("dotenv").config();
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl)
  .then(() => {
    console.log("CoffeeDB 연결");
  })
  .catch((e) => {
    console.log(e);
  });

const coffeeCountrySchema = new mongoose.Schema({
  name: String,
  country: String,
  taste: String,
  tasteName: String,
  beans:String,
  beansName: String
})

const CoffeeCountry = mongoose.model('CoffeeCountry', coffeeCountrySchema);

const countryDB = async () => {
  await CoffeeCountry.deleteMany({});
  for(let list of coffeeCountryList) {
    const coffeeCountry = new CoffeeCountry({
      name: list.name,
      country: list.country,
      taste: list.taste,
      tasteName: list.tasteName,
      beans: list.baens,
      beansName: list.beansName
    })
    await coffeeCountry.save();
  }
}

countryDB().then(() => {
  mongoose.connection.close();
})