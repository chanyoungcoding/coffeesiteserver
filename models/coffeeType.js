const mongoose = require('mongoose');

const coffeeTypesSchema = new mongoose.Schema({ 
  countryImage : String,
  countryNationalFlag: String,
  countryIntroduce: String,
  countryCoffeeName: String
})

const CoffeeType = mongoose.model('CoffeeType', coffeeTypesSchema);

module.exports = CoffeeType