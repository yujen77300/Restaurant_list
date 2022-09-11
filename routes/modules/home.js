// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Restaurant = require("../../models/restaurant")

// 功能一 : 設定瀏覽全部所有餐廳的路由
// Express 會「回傳 HTML 來呈現前端樣板」
// 決定要用index這個局部模板，在透過上面定義樣板引擎的解析
router.get('/', (req, res) => {
  // 用.find()拿到全部的todo資料
  Restaurant.find()
    .lean()
    .then(restaurantList => res.render('index', { restaurant: restaurantList }))
    .catch(error => console.log(error))
  //  Express 會「回傳 HTML 來呈現前端樣板index.handlebars」
  // res.render('index', { restaurant: restaurantList.results })
})


router.post('/sortby', (req, res) => {
  const sortitem = req.body.sort

  if (sortitem === "name-asc") {
    return Restaurant.find()
      .lean()
      .sort({ name: 'asc' })
      .then(restaurantList => res.render('index', { restaurant: restaurantList, sortitem }))
      .catch(error => console.error(error))
  } else if (sortitem === "name-desc") {
    return Restaurant.find()
      .lean()
      .sort({ name: 'desc' })
      .then(restaurantList => res.render('index', { restaurant: restaurantList, sortitem }))
      .catch(error => console.error(error))
  } else if (sortitem === "category") {
    return Restaurant.find()
      .lean()
      .sort({ category: 'asc' })
      .then(restaurantList => res.render('index', { restaurant: restaurantList, sortitem }))
      .catch(error => console.error(error))
  } else if (sortitem === "location") {
    return Restaurant.find()
      .lean()
      .sort({ location: 'asc' })
      .then(restaurantList => res.render('index', { restaurant: restaurantList, sortitem }))
      .catch(error => console.error(error))
  }
})

// 匯出路由器
module.exports = router