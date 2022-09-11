const express = require('express')
// 拿express套件裡面的express函數存到app這個變數
const app = express()
const port = 3000



//載入method-over-ride
const methodOverride = require('method-override')
//引入路由，預設會找index
const routes = require('./routes')

// 再載回mongoose，
require('./config/mongoose')
// 載入handlebars，這是用來處理要回傳給瀏覽器的畫面
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
//原本是透過JSON檔案取得 restaurantList，
// const restaurantList = require('./restaurant.json')
// 但接下來要透過取得restaurant的model來取得資料
// const Restaurant = require('./models/restaurant')
// 再來要告訴express要把樣板引擎給handlebars，第一個參數為樣板引擎名稱，第二個代表預設部局使用main檔案
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// 要設定view engine是用handkebars，這邊第二個參數就是上面方法的第一個參數
app.set('view engine', 'handlebars')


// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 每一個request進來偷會通過bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
//設定靜態檔案的路由
app.use(express.static('public'))
app.use(routes)


// 設置監聽
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})