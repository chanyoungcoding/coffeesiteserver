const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoffeeSchema = new Schema({
  name: {
    type: String,
    required: [true, '커피 이름이 필요합니다.']
  },
  calory:Number,
  sodium:Number,
  protein:Number, 
  sugar:Number,
  caffeine:Number,
  sat_fat: Number,
  price: Number,
  description: String,
  materials: {
    type: [String],
    default: []
  },
  howToMake: {
    type: [String],
    default: []
  },
  youtube: String
})

const Coffee = mongoose.model('Coffee', CoffeeSchema);

module.exports = Coffee;