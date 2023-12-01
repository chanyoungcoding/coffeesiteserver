const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

const Coffee = require('./models/coffee');
const User = require('./models/users');
const CoffeeShop = require('./models/coffeeShop');
const CoffeeType = require('./models/coffeeType');
const CoffeeCountry = require('./models/coffeeCountry');
const CoffeeStore = require('./models/coffeeStore');


//MongoDB 연결
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl)
  .then(() => {
    console.log("CoffeeDB 연결");
  })
  .catch((e) => {
    console.log(e);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async(req,res) => {
  const coffee = await Coffee.find({});
  res.send(coffee)
})

app.get('/api/coffee', async (req,res) => {
  const coffee = await Coffee.find({});
  res.json(coffee);
})

app.get('/api/coffeeNumber', async(req,res) => {
  let number = req.query.number;
  const coffee = await Coffee.find({}).limit(number);
  res.json(coffee);
})

app.get('/api/coffeeName', async (req,res) => {
  const coffeeName = req.query.name
  const coffee = await Coffee.find({name : coffeeName});
  res.json(coffee)
})

app.get('/api/coffeeShop', async (req,res) => {
  const coffeeShop = await CoffeeShop.find({});
  res.json(coffeeShop);
})

app.get('/api/coffeeShopDetail', async (req,res) => {
  const coffeeName = req.query.name
  const coffeeShopDetail = await CoffeeShop.find({name: coffeeName});
  res.json(coffeeShopDetail);
})

app.get('/api/coffeeTypes', async (req,res) => {
  const coffeeTypes = await CoffeeType.find({})
  res.json(coffeeTypes);
})

app.get('/api/coffeeCountry', async(req,res) => {
  const coffeeCountry = await CoffeeCountry.find({});
  res.json(coffeeCountry);
})

app.post('/api/coffeeBasket', async(req,res) => {
  const {price, count, name, userName, itemPrice} = req.body;
  try {
    const user = await User.findOne({username: userName});
    const foundItem = user.shoppingBasket.find(item => item.name === name);
    if(foundItem) {
      foundItem.count += count
      foundItem.price += price
      foundItem.itemPrice = itemPrice
      await user.save();
      res.json('good');
    } else {
      user.shoppingBasket.push({name, count, price,itemPrice});
      await user.save();
      res.json('good');
    }
  } catch(e) {
    console.log(e)
    res.status(500).json(e)
  }
})

app.post('/api/coffeeGreat', async (req,res) => {
  const { userName } = req.body;
  try {
    const user = await User.findOne({username: userName});
    if(!user) {
      return res.status(404).json({error});
    }
    user.coffeeGreat.push(req.body);
    await user.save();
    res.json('succeess');
  } catch(e) {
    console.log(e);
    res.status(500).json(e);
  }
})

app.get('/api/user', async (req,res) => {
  const userName  = req.query.user
  try {
    const user = await User.findOne({username:userName});
    const great = user.coffeeGreat;
    res.json(great);
  } catch(e) {
    res.json(e);
  }
})

app.get('/api/Basket', async (req,res) => {
  const userName  = req.query.user
  try {
    const user = await User.findOne({username:userName});
    const basket = user.shoppingBasket;
    res.json(basket);
  } catch(e) {
    res.json(e);
  }
})

app.get('/api/kakaoMapInfo', async(req,res) => {
  const kakaoInfo = await CoffeeStore.find({});
  res.json(kakaoInfo);
})

app.post('/api/login', async (req,res) => {
  const {username, password} = req.body
  try {
    const newUser = await User.find({username: username, password: password})
    if(newUser[0].username === username && newUser[0].password === password) res.json(req.body);
  } catch(e) {
    res.json('실패');
  }
})

app.post('/api/signin', async (req, res) => {
  const { username } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.json('existed username');
  }
  const newUser = new User(req.body);
  await newUser.save();
  res.json('success');
});

// 커피 좋아요 삭제
app.delete('/api/delete', async(req,res) => {
  const {username, userId} = req.body;
  try {
    const result = await User.updateOne(
      {username},
      {$pull: {coffeeGreat:{_id: userId}}}
    )
    if(result.modifiedCount === 1) {
      res.json({success: true, message: '좋아요 삭제 성공'})
    } else {
      res.status(404).json({success: false, message: 'false'})
    }
  } catch(e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Server Error'})
  }
})

// 커피 장바구니 개수 줄이기, 늘리기
app.patch('/api/updateBasketCount', async (req, res) => {
  const { username, itemName, itemPrice, plus, minus } = req.body;
  try {
    let count = 0;
    let price = 0;
    if(plus) {
      count = 1;
      price = itemPrice;
    } else if(minus) {
      count = -1;
      price = -itemPrice;
    }

    const user = await User.findOne({ username });
    const item = user.shoppingBasket.find((basketItem) => basketItem.name === itemName);
    if (item.count + count < 1) {
      res.json({ success: true, message: '개수오류' });
      return;
    }

    const result = await User.updateOne(
      { 
        username,
        'shoppingBasket.name': itemName
      },
      {
        $inc: { 'shoppingBasket.$.count': count, 'shoppingBasket.$.price': price }
      }
    );
    if (result.modifiedCount === 1 && plus) {
      res.json({ success: true, message: '하나 추가했습니다.' });
    } else if(result.modifiedCount === 1 && minus) {
      res.json({ success: true, message: '하나 감소했습니다.' });
    } else {
      res.status(404).json({ success: false, message: '해당 아이템이 존재하지 않음' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});



app.listen(process.env.PORT || 4000, () => {
  console.log('서버 실행')
})

