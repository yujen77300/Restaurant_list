
const db = require('../../config/mongoose')
// 載入restaurant model
const Restaurant = require('../restaurant')
// 載入json檔案
const restaurantList = require("../../restaurant.json").results
db.once('open', () => {
  // 將json檔案裡面的資料新增到資料庫，然後使用create時候會按照schema定義的格式新增
  Restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")
      db.close()
    })
    .catch(err => console.log(err))
})