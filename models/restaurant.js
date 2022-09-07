// 定義結構，確保之後的每個資料都會是長這個樣子
// 先載入mongoosse
const mongoose = require('mongoose')

// 運用mongoose提供的schema模組
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: { type: String, required: true },
  name_en: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  google_map: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
})

// mongoose.model會將此schema定義為可供操作的model
// 匯出，第一個參數是此物件的名字，就可以讓其他檔案使用了
module.exports = mongoose.model("Restaurant", restaurantSchema)