// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Restaurant = require("../models/restaurant")


const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
router.use('/', home)
router.use('/restaurants', restaurants)


// 功能六 : 設定搜尋的路由(從原本在json檔案裡面找改成透過mongoose的find方法來找)
router.get('/search', (req, res) => {
  //如果輸入值無效，導向根目錄
  if (!req.query.keyword && !req.query.location) {
    return res.redirect('/')
  }
  // 如果地區沒有輸入，則代表為台北市
  if (!req.query.location) {
    req.query.location = "台北市"
  }
  Restaurant.find({})
    .lean()
    .then(restaurantList => {
      const searchRestaurant = restaurantList.filter(function (item) {
        // 回傳包含位置、名字、類別的餐廳陣列
        return (item.name.toLowerCase().includes(req.query.keyword.trim().toLowerCase()) && item.location.toLowerCase().includes(req.query.location.trim().toLowerCase())) || (item.category.toLowerCase().includes(req.query.keyword.trim().toLowerCase()) && item.location.toLowerCase().includes(req.query.location.trim().toLowerCase()))
      })
      res.render('index', { restaurant: searchRestaurant, keyword: req.query.keyword, location: req.query.location, totalResults: `共發現${searchRestaurant.length}間餐廳` })
    })
    .catch(err => console.log(err))
})


// 匯出路由器
module.exports = router