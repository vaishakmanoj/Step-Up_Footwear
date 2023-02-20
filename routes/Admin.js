const express=require('express')
const { editcategory } = require('../controller/admincontroller')
const router=express.Router()

const controller=require('../controller/admincontroller')
const {adminSession}= require('../middleware/auth')


// const multer=require('multer')

// const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//       cb(null,"public/images/")
//     },
//     filename:(req,file,cb)=>{
//       cb(null,file.fieldname + "_" +Date.now()+"_"+file.originalname);
//     },
//   });
//   var upload=multer({
//     storage:storage
//   }).fields([{name:'image',maxCount:3}]);


//*************************************************** *//  


router.get('/',controller.adminlogin)
router.post('/adLogin',controller.adLogin)

//******************* Banner ********************//

router.get('/viewban',controller.viewbanner)
router.get('/add-banner',controller.addbanner)
router.post('/adbanner',controller.postaddbanner)
router.post('/enable/:id',controller.enablebanner)
router.post('/disable/:id',controller.disablebanner)
router.get('/deletebanner/:id',controller.deleteBanner)

//*****************  Admin Home ***************//

router.get('/adhome',adminSession,controller.adminhome)

//***************** User ********************* */

router.get('/viewuser',adminSession,controller.viewuser)
router.post('/blockuser/:id',adminSession,controller.blockUser)
router.post('/unblockuser/:id',adminSession,controller.unblockUser)

//***************************  Product ******************************//

router.get('/viewproduct',adminSession,controller.viewproduct)
router.get('/add-product',adminSession,controller.addproduct)
router.post('/addproduct',adminSession,controller.postaddproduct)
router.get('/editproduct/:id',adminSession,controller.editproduct)
router.post('/posteditproduct/:id',adminSession,controller.posteditproduct)
router.post('/listpdt/:id',adminSession,controller.listpdt)
router.post('/unlistpdt/:id',adminSession,controller.unlistpdt)


//*************************** Category ******************************//

router.get('/viewcate',adminSession,controller.viewcategory)
router.get('/add-category',adminSession,controller.addcategory)
router.post('/addcategory',adminSession,controller.postaddcategory)
router.get('/editcategory/:id',adminSession,controller.editcategory)
router.post('/edicategory/:id',adminSession,controller.posteditcategory)
router.post('/listcate/:id',adminSession,controller.listcate)
router.post('/unlistcate/:id',adminSession,controller.unlistcate)

//*************************** Coupon ******************************//

router.get('/viewcoupon',adminSession,controller.viewcoupon)
router.get('/addcoop',adminSession,controller.addcoupon)
router.post('/postaddcoop',adminSession,controller.postaddcoupon)
router.get('/editcoupon/:id',adminSession,controller.editcoupon)
router.post('/posteditcoupon/:id',adminSession,controller.posteditcoupon)
router.get('/deletecoupon/:id',adminSession,controller.deletecoupon)

//*************************** Order ******************************//

router.get('/vieworder',adminSession,controller.vieworder)
router.get('/orderManagement',adminSession,controller.orderMangement)
router.get('/orderdetials/:id',adminSession,controller.orderlist)
router.post('/delivarystatus',controller.delivarystatus)
router.post('/status_change',controller.statusChange)
router.get('/orderinvoice/:id',adminSession,controller.invoice)

//*************************** salesRepor ******************************//

// router.post('/viewreport/:id',adminSession,controller.viewReport)
router.get('/salesReport',adminSession,controller.salesReport)
router.post('/salesDetails',adminSession,controller.salesDetails)

//............................................//
router.get('/logoutadmin',controller.logoutadmin)



module.exports=router