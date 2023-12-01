const mongoose = require('mongoose');

const coffeeShopSchema = new mongoose.Schema({
  coffeeNumber: Number,
  name: String,
  price:Number,
  imgurl: String,
})

const CoffeeShop = mongoose.model('CoffeeShop', coffeeShopSchema);

module.exports = CoffeeShop;