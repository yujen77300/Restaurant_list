const express = require('express')
// 拿express套件裡面的express函數存到app這個變數
const app = express()
// 載入mongoose
const mongoose = require('mongoose')
const port = 3000

// 設定連線到 mongoDB，告訴程式去哪裡找資料庫
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// 載入handlebars，這是用來處理要回傳給瀏覽器的畫面
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
//原本是透過JSON檔案取得 restaurantList，
// const restaurantList = require('./restaurant.json')
// 但接下來要透過取得restaurant的model來取得資料
const Restaurant = require('./models/restaurant')
// 再來要告訴express要把樣板引擎給handlebars，第一個參數為樣板引擎名稱，第二個代表預設部局使用main檔案
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// 要設定view engine是用handkebars，這邊第二個參數就是上面方法的第一個參數
app.set('view engine', 'handlebars')


// 功能三: 新增一家餐廳，之後要再新增new的樣板
//先顯示新增的樣板
app.get("/restaurants/new", (req, res) => {
  res.render("new")
})

// 每一個request進來偷會通過bodyparser
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/restaurants", (req, res) => {
  // 呼叫create方法，直接在Restaurant這個model新增資料
  // console.log(req.body)
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})



// 功能一 : 設定瀏覽全部所有餐廳的路由
// Express 會「回傳 HTML 來呈現前端樣板」
// 決定要用index這個局部模板，在透過上面定義樣板引擎的解析
app.get('/', (req, res) => {
  // 用.find()拿到全部的todo資料
  Restaurant.find()
    .lean()
    .then(restaurantList => res.render('index', { restaurant: restaurantList }))
    .catch(error => console.log(error))
  //  Express 會「回傳 HTML 來呈現前端樣板index.handlebars」
  // res.render('index', { restaurant: restaurantList.results })
})


app.post('/sortby', (req, res) => {
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






//設定靜態檔案的路由
app.use(express.static('public'))


// 功能二 : 設定瀏覽一家餐廳的詳細資訊，之後要再新增show的樣板
app.get('/restaurants/:id', (req, res) => {
  // 要顯示資訊只會有一個，所以用find
  // const restaurant = restaurantList.results.find(item => item.id.toString() === req.params.id)
  // 用mongoose的方法來找特定ip
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantList => res.render('show', { restaurant: restaurantList }))
    .catch(error => console.log(error))
  // res.render('show', { restaurant: restaurant })
})

// 功能四: 修改一家餐廳的資訊，之後要再新增edit的樣板
app.get('/restaurants/:id/edit', (req, res) => {
  // 要顯示資訊只會有一個，所以用find
  // 用mongoose的方法來找特定ip
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantList => res.render('edit', { restaurant: restaurantList }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const rating = req.body.rating
  const google_map = req.body.google_map
  const description = req.body.description
  return Restaurant.findById(id)
    .then(restaurantList => {
      restaurantList.name = name
      restaurantList.name_en = name_en
      restaurantList.category = category
      restaurantList.image = image
      restaurantList.location = location
      restaurantList.google_map = google_map
      restaurantList.description = description
      restaurantList.rating = rating
      restaurantList.phone = phone
      return restaurantList.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))

  // 參考同學寫法可以直耶用mongoose的方法，直接全部更新
  // Restaurant.findByIdAndUpdate(id, req.body)
  //   .then(() => res.redirect(`/restaurants/${id}`))
  //   .catch(err => console.log(err))

})

// 功能五: 使用者可以刪除一家餐廳
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurantList => restaurantList.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// 功能六 : 設定搜尋的路由(從原本在json檔案裡面找改成透過mongoose的find方法來找)
app.get('/search', (req, res) => {
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

app.get('/orderByRating', (req, res) => {
  // 要顯示資訊只會有一個，所以用find
  res.render('index', { restaurant: restaurantList.results })
})



// 設置監聽
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})