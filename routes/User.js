
//.....Reguiring(modules)..........................

const express=require('express')
const router=express.Router()
const controller = require('../controller/usercontroller')
const {userSession} = require('../middleware/auth')
const {ajaxSession}=require('../middleware/ajaxsession')

 //......................................
//..........get.............................
  
router.get('/login',controller.login)
router.get('/',controller.userhome)
router.get('/pdtdetails',controller.pdtdetails)
router.get('/signup',controller.signup)
router.get('/logout',controller.logoutUser)
router.get('/shop',controller.shop)
router.get('/userdetails',userSession,controller.userdetails)
router.get('/cart',userSession,controller.cart)
router.get('/orderlist',userSession,controller.orderlist)
router.get('/singleorder/:id',userSession,controller.singleorder)
router.post('/cancelOrder',ajaxSession,controller. cancelOrder  )
 //........................................


router.post("/dologin", controller.doLogin);
// router.get('/',controller.userhome)
router.post('/otp',controller.otp)
router.post('/resendotp',controller.resendotp)
router.post('/verifyotp',controller.verifyotp)

router.post('/addaddress/:id',controller.addaddress)
router.post('/deleteaddress',controller.deleteaddress)
router.post('/editaddress',controller.editaddress)
router.post('/updateaddress/:id',controller.updateaddress)

router.post('/addtocart',ajaxSession,controller.addtocart)
router.post('/changequantity',userSession,controller.changequantity)
router.post('/removecart',userSession,controller.removeCart)
router.get('/wishlist',userSession,controller.wishList)
router.post('/addtowishlist',ajaxSession,controller.addToWishlist)
router.post('/removewishlist',userSession,controller.removewishlist)
router.get('/orderSucess',userSession,controller.orderSucess)

router.post('/orderdata',ajaxSession,controller.orderdata)
router.get('/checkout/:id',userSession,controller.CheckOut)
router.post('/addcheckaddress/:id',userSession,controller.addcheckaddress)
router.post('/applycoupon',ajaxSession,controller.applycoupon)
router.post('/user_order/:id',ajaxSession,controller.userOrder)
router.post('/verifypayment',ajaxSession,controller.verify)
router.get("/count",controller.count);

// router.get('/shop',controller.shop)

// router.post("/dosignup", controller.doSignup); 
// router.get('/otp',controller.otp)

module.exports=router
