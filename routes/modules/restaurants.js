const express = require('express')
const router = express.Router()
const Restaurant = require("../../models/restaurant")



// 功能三: 新增一家餐廳，之後要再新增new的樣板
//先顯示新增的樣板
router.get("/new", (req, res) => {
  res.render("new")
})


router.post("/", (req, res) => {
  // 呼叫create方法，直接在Restaurant這個model新增資料
  // console.log(req.body)
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

// 功能二 : 設定瀏覽一家餐廳的詳細資訊，之後要再新增show的樣板
router.get('/:id', (req, res) => {
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
router.get('/:id/edit', (req, res) => {
  // 要顯示資訊只會有一個，所以用find
  // 用mongoose的方法來找特定ip
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantList => res.render('edit', { restaurant: restaurantList }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))

  // 參考同學寫法可以直耶用mongoose的方法，直接全部更新
  // Restaurant.findByIdAndUpdate(id, req.body)
  //   .then(() => res.redirect(`/restaurants/${id}`))
  //   .catch(err => console.log(err))

})

// 功能五: 使用者可以刪除一家餐廳
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurantList => restaurantList.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



module.exports = router