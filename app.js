const express = require('express')
// 拿express套件裡面的express函數存到app這個變數
const app = express()
const port = 3000

// 載入handlebars，這是用來處理要回傳給瀏覽器的畫面
const exphbs = require('express-handlebars')
//取得RESTAURANT的JSON檔案
const restaurantList = require('./restaurant.json')
// 再來要告訴express要把樣板引擎給handlebars，第一個參數為樣板引擎名稱，第二個代表預設部局使用main檔案
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// 要設定view engine是用handkebars，這邊第二個參數就是上面方法的第一個參數
app.set('view engine', 'handlebars')




// 設定路由
// Express 會「回傳 HTML 來呈現前端樣板」
// 決定要用index這個局部模板，在透過上面定義樣板引擎的解析
// 第二個參數可以movieOne的資料送到index.handlebar，在渲染index這個partial template時候，可以使用movies這個物件
app.get('/', (req, res) => {
  //  Express 會「回傳 HTML 來呈現前端樣板」
  res.render('index', { restaurant: restaurantList.results })
})


//設定靜態網站的路由
app.use(express.static('public'))

// 設定show的路由
app.get('/restaurants/:id', (req, res) => {
  // 要顯示資訊只會有一個，所以用find
  const restaurant = restaurantList.results.find(item => item.id.toString() === req.params.id)
  res.render('show', { restaurant: restaurant })
})

// 設定搜尋的路由
app.get('/search', (req, res) => {


  let searchRestaurant = restaurantList.results.filter(function (item) {
    //如果輸入值無效，導向根目錄
    if (!req.query.keyword && !req.query.location) {
      return res.redirect('/')
    }

    // 如果地區沒有輸入，則代表為台北市
    if (!req.query.location) {
      req.query.location = "台北市"
    }
    // 回傳包含位置、名字、類別的餐廳陣列
    return (item.name.toLowerCase().includes(req.query.keyword.trim().toLowerCase()) && item.location.toLowerCase().includes(req.query.location.trim().toLowerCase())) || (item.category.toLowerCase().includes(req.query.keyword.trim().toLowerCase()) && item.location.toLowerCase().includes(req.query.location.trim().toLowerCase()))
  })
  res.render('index', { restaurant: searchRestaurant, keyword: req.query.keyword, location: req.query.location, totalResults: `共發現${searchRestaurant.length}間餐廳` })

})

app.get('/orderByRating', (req, res) => {
  // 要顯示資訊只會有一個，所以用find
  res.render('index', { restaurant: restaurantList.results })
})



// 設置監聽
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})