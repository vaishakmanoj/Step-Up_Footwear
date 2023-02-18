const UserModel = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const productModel = require('../models/productModel');
const bannerModel = require('../models/bannerModel');
const categoryModel = require('../models/categoryModel');
const WishlistModel = require('../models/wishlistModel');
const CartModel = require('../models/CartModel');
const orderModel = require('../models/orderModel');
const ITEMS_PAGE = 6;
const Razorpay=require('razorpay')
const crypto=require('crypto');
const wishlistModel = require('../models/wishlistModel');



let instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret
});


let transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  }

});

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp + "TEST");

module.exports = {

  userhome: async (req, res) => {
    let user = null
    if (req.session.user) {
      user = req.session.user
      console.log(user + 'userhome page startedd');
    }
    const pdtss = await productModel.find().limit(6)//showing the number of product sin the home page
    const banne = await bannerModel.find({ status: "enable" })
    // console.log(banne,'baner');
    res.render('user/userhome', { user, pdtss, banne })
  },
  pdtdetails: async (req, res) => {
    console.log("hello");
    let user = req.session.user
    const pdtid = req.query.pdtc
    const pdtx = await productModel.findOne({ _id: pdtid }).populate('category')
    console.log(pdtx);
    res.render('user/pdt_details', { pdtx, user })

  },
  //..............................................
  login: (req, res) => {
    try {
      if (!req.session.userLoggedIn) {
        res.render('user/login')
      }
      else {
        res.redirect('/')
      }

    } catch (err) {
      next(err)
    }
  },

  //..............................................

  doLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email + 'Checking email is coming or not');
      const user = await UserModel.findOne({ email: email });
      console.log(user, 'already registered user loginnedd');
      if (!user) {
        return res.redirect('/signup');
      }
      else if (user.status != 'Blocked') {


        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch, 'match');
        if (!isMatch) {
          return res.redirect('/signup');
        }
        req.session.user = user
        console.log(req.session.user);
        res.redirect('/');
      } else {
        res.redirect('/login')///blocked user
      }
    } catch (err) {
      next(err)
    }
  },
  // otp: (req, res) => {
  //   res.render('user/otpvalid')
  //....................................................
  // },
  otp: async (req, res) => {
    try {
      // userName = req.body.userName
      // email = req.body.email;
      // Phone = req.body.phone
      req.session.userName = req.body.userName
      req.session.email = req.body.email
      req.session.Phone = req.body.Phone
      req.session.password = req.body.password
      email = req.body.email

      const user = await UserModel.findOne({ email: email });

      if (!user) {
        // send mail with defined transport object
        var mailOptions = {
          from: 'reshnakripa2884@gmail.com',
          to: req.body.email,
          subject: "Otp for registration is: ",
          html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          res.render('user/otpvalid');
        });

      }
      else {
        res.redirect('/login')//if the mail id is already registered i rendering the login page
      }

    } catch (err) {
      next(err)
    }
  },

  //..........................................................

  resendotp: (req, res) => {
    try {
      const mailOptions = {
        from: 'reshnakripa2884@gmail.com',
        to: req.session.email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('user/otpvalid', { msg: "otp has been sent" });
      });

    } catch (err) {
      next(err)
    }
  },
  //.........................................................

  verifyotp: async (req, res) => {
    try {
      if (req.body.otp == otp) {
        // res.send("You has been successfully registered");
        req.session.password = await bcrypt.hash(req.session.password, 10)
        // console.log(req.session.password)

        const newUser = UserModel(
          {
            userName: req.session.userName,
            email: req.session.email,
            Phone: req.session.Phone,
            password: req.session.password,
          })

        newUser
          .save()
          .then(() => {
            // req.session.userLoggedIn=true;
            res.redirect("/");
          })
      }
      else {
        res.render('user/otpvalid');
      }
    } catch (err) {
      next(err)

    }
  },


  //..........................................................


  signup: (req, res) => {
    res.render('user/signup')
  },



  // doSignup: async (req, res) => {

  //   req.body.password = await bcrypt.hash(req.body.password, 10)
  //   console.log(req.body);
  //   let user = UserModel({
  //     userName: req.body.userName,
  //     email: req.body.email,
  //     Phone: req.body.Phone,
  //     password: req.body.password

  //   })
  //   user.save().then((doc) => {
  //     req.session.user=doc
  //     res.redirect('/')
  //   })
  // },
  //..............................................

  logoutUser: (req, res) => {
    try {
      req.session.loggedOut = true;
      req.session.user = null;
      res.redirect('/')
    } catch (err) {
      next(err)
    }
  },

  //..................................................

  userdetails: async (req, res) => {
    try {
      uzer = req.session.user

      const user = await UserModel.findOne({ _id: uzer._id })
      // console.log(uzer);

      res.render('user/userdetail', { pages: 'user', user })
    } catch (error) {


    }
  },

  //.....................................................
  addaddress: async (req, res) => {
    try {
      console.log("Add address working");
      const id = req.params.id;
      console.log(id);
      let isExist = await UserModel.findOne({ _id: id })
      console.log(isExist + "INSIDE");

      let newaddresss = {

        'name': req.body.Name,
        'house': req.body.House,
        'post': req.body.post,
        'city': req.body.city,
        'district': req.body.district,
        'state': req.body.state,
        'pin': req.body.pin
      }

      // console.log(newaddresss+"CHECK");
      await UserModel.updateOne({ _id: id }, { $push: { address: newaddresss } })
      res.redirect('/userdetails')
    } catch (error) {

    }
  },
  editaddress: async (req, res, next) => {
    try {
      // console.log("REACHED");
      // const id=res.locals.userdata._id;
      const addid = req.body.id;
      user = req.session.user
      console.log(addid);
      let useraddress = await UserModel.findOne({ _id: user._id })
      // console.log(useraddress +"LOG");
      useraddress.address.forEach((val) => {
        if (val.id.toString() == addid.toString()) {
          console.log(val + 'editaddress value coming');
          res.json(val)
        }
      })
    } catch (error) {
      console.log(error);
      next(error)
    }
  },
  updateaddress: async (req, res, next) => {
    try {
      // console.log(req.params.id+"ADDRESS ID");
      // console.log(req.body);
      let newaddressupdate = {

        'address.$.name': req.body.Name,
        'address.$.house': req.body.House,
        'address.$.post': req.body.post,
        'address.$.city': req.body.city,
        'address.$.district': req.body.district,
        'address.$.state': req.body.state,
        'address.$.pin': req.body.pin
      }
      console.log(newaddressupdate);
      await UserModel.updateOne({ _id: user._id, 'address._id': req.params.id }, { $set: newaddressupdate })
        .then(() => {
          res.redirect('/userdetails')
        })
    } catch (error) {
      console.log(error);
      next(error)
    }
  },
  deleteaddress: async (req, res, next) => {

    try {
      user = req.session.user
      // console.log("rrrrrrrrrrrrrrrrreeeeeeeeeeee");
      await UserModel.updateOne({ _id: user._id }, { $pull: { address: { _id: req.body.id } } })
      res.json("deleted")
    } catch (error) {
      next(error)
    }
  },

  //*************************[    Shop    ]*************************//

  shop: async (req, res) => {
    try {

      user = req.session.user
      const page = req.query.page
      console.log(user);
      console.log("oi");

      let cat = await categoryModel.find()
      const sizes = await productModel.distinct('size')

      const pdtss = await productModel.find()
        .skip((page - 1) * ITEMS_PAGE)
        .limit(ITEMS_PAGE)

      res.render('user/shop', { user, cat, pdtss, page, sizes })

    } catch (error) {
      console.log(error.message);
    }
  },

  //*************************[    Cart    ]*************************//

  cart: async (req, res) => {
    try {

      let user = req.session.user;
      let userId = req.session.user._id
      let Cartdetails = await CartModel.findOne({ user: userId }).populate('productt.id')
      let cart3 = Cartdetails
      

      res.render('user/cart', { user, userId, cart3, Cartdetails })
    } catch (error) {

    }
  },

  //....................................................//

  addtocart: async (req, res) => {
    try {

      console.log('adding.......');
      let userId = req.session.user._id
      console.log(req.session.user._id, "user_id");
      let proId = req.body.id
      console.log((proId + "product id"));
      let cart = await CartModel.findOne({ userr: userId })
      let product2 = await productModel.findOne({ _id: proId })
      let produObj = { id: proId, quantity: 1, price: product2.price }
     let a=0;
      if (cart) {
        console.log("update cart");
        let indexvalue = cart.productt.findIndex((p) => p.id == proId)//checking the product is avaialabe in the database or not and taking the index value of the product inside the indexvalue
        // inside cart we created productt array
        console.log(indexvalue);
        if (indexvalue != -1) {
          console.log('new added');
          const quantity = cart.productt[indexvalue].quantity
          await CartModel.updateOne(
            {
              userr: userId,
              "productt.id": proId,
            },
            {
              $inc: { "productt.$.quantity": 1, "productt.$.price": product2.price, totalprice: product2.price }
            }
          )
          res.json('quantity inc')
        }

        //new product adding to the user cart account and also quantity increasing 
        else {
          console.log('new product adding...');
          await CartModel.updateOne({ userr: userId },
            { $push: { productt: produObj }, $inc: { totalprice: product2.price } })
          res.json('added')
        }
      }
      else {
        console.log("new cart");
        let usercart = {
          userr: userId,
          productt: [produObj],
          totalprice: product2.price

        };
        let newcart = await CartModel.create(usercart);
        console.log(newcart + "new cart");
        res.json('product add to cart')


      }




    } catch (error) {

    }
  },

//........................................................................

  changequantity: async (req, res) => {
    try {
      let totalAmount
      let productprice
      let cartdetail = req.body
      console.log(cartdetail, "here, cart details");

      let product = await productModel.findOne({ _id: cartdetail.product })
      console.log(product, "product in cart");

      cartdetail.count = parseInt(cartdetail.count)
      cartdetail.quantity = parseInt(cartdetail.quantity)

      if (cartdetail.count === -1 && cartdetail.quantity === 1) {

        let data = await CartModel.findByIdAndUpdate({ _id: cartdetail.cart }, {
          $pull: { productt: { id: cartdetail.product } }, $inc: { totalprice: -product.price }
        }, { new: true })
        totalAmount = data.totalprice
        productprice = product.price
        console.log(productprice, "product price=");
        if (data) {
          console.log('nan remove');
          res.json({ removeproduct: true, totalAmount, productprice })
        }

      } else {
        console.log('else case cart');
        const data = await CartModel.updateOne(
          {
            _id: cartdetail.cart,
            "productt.id": cartdetail.product,
          },
          {
            $inc: {
              "productt.$.quantity": cartdetail.count,
              "productt.$.price": product.price * cartdetail.count,
              totalprice: product.price * cartdetail.count
              //   $inc: {
              //     "productt.$.quantity": cartdetail.count,
              //     "productt.$.price": product.price * cartdetail.count,
              //     totalprice: product.price * cartdetail.count,
              //
            }
          }
        );
        console.log(data);
        let cardata = await CartModel.findOne({ userId: cartdetail.user });
        let proexist = cardata.productt.findIndex((p) => p.id == cartdetail.product);

        let cartData = cardata.productt[proexist].quantity;
        totalAmount = cardata.carttotal;
        productprice = product.price;
        res.json({
          status: true, totalAmount, productprice, cartData
        })

      }


    } catch (error) {
      console.log(error);
    }
  },

  //.....................................................................

  removeCart: async (req, res, next) => {
    try {
      console.log(req.body);
      let cart = req.body.id;
      const productid = req.body.Cartid;
      const userId = req.session.user._id
      const price = req.body.productprice;
      console.log(req.body.productprice+"PRICE++++++++++++++++");
      
      let data = await CartModel.findByIdAndUpdate({ _id:cart  }, {
        $pull: { productt: { _id:productid } }, $inc:{ totalprice: -price }
      }, { new: true })
      // await CartModel.findOneAndUpdate({ userr: userId }, { $pull: { productt: productid }, $inc: { carttotal: -price } })
      if(data){
        console.log(data);
        res.json('removed')
      }
      

    } catch (error) {
      next(error)
    }
  },
  // try {
  //   user = req.session.user
  //   // console.log(user._id);
  //   console.log(req.body.wishid + 'wishid');
  //   console.log(req.body.id + 'hi');
  //   await WishlistModel.updateOne({ _id: req.body.wishid }, { $pull: { product1: req.body.id } })

//*************************[    wishList    ]*************************//

  wishList: async (req, res) => {
    let user = req.session.user;
    let userId = req.session.user._id;
    let wishlistData = await WishlistModel.findOne({ user1: userId }).populate("product1");
    let wishlist = wishlistData
    console.log(wishlist, "Wishlistpage showing..");
    res.render("user/wishlist", { user, wishlist, pdtss: wishlistData.product1 });
  },

//...................................................

  addToWishlist: async (req, res) => {
    let userId = req.session.user._id
    console.log(userId, "userid comesssssss");
    let proId = req.body.id;
    console.log(proId);
    let wishlist = await WishlistModel.findOne({ user1: userId });
    console.log(wishlist, "dfgh");

    if (wishlist) {
      await WishlistModel.findOneAndUpdate(
        { user1: userId },
        { $addToSet: { product1: proId } }
      );
      res.json('Produt');
    } else {
      userWishlist = {
        user1: userId,
        product1: [proId]
      };

      let newwishlist = await WishlistModel.create(userWishlist);
      console.log(newwishlist);
      res.json('Product added successfully');
    }

    // res.redirect("/");
  },

//..............................................

  removewishlist: async (req, res) => {
    try {
      user = req.session.user
      // console.log(user._id);
      console.log(req.body.wishid + 'wishid');
      console.log(req.body.id + 'hi');
      await WishlistModel.updateOne({ _id: req.body.wishid }, { $pull: { product1: req.body.id } })

      res.json('removed')

    } catch (error) {

    }
  },


//*************************[    checkout    ]*************************//

  
  CheckOut: async (req, res, next) => {
    try{
      user = req.session.user
      userr = req.session.user._id
      let orderdata = req.params.id

      const userdetails = await UserModel.findOne({ _id: userr })
      let orderdetails = await orderModel.findOne({ _id: orderdata }).populate('productt.product_id')
      console.log(orderdetails);
      res.render('user/checkout',{ user, userdetails, orderdetails} )

    } catch (error) {
      console.log(error);
      next(error)
    }
  },

//..............................................................

  orderdata: async (req, res, next) => {
    try {
      let cartId = req.body.cartId
      // console.log(cartId +'cartid coming........')
      let cartbill = await CartModel.findOne({ _id: cartId }).populate('productt.id')
      let cartD = []
      cartbill.productt.forEach((_id) => {
        let product = {
          product_id: _id.id._id,
          name: _id.id.productName,
          qnty: _id.quantity,
          price: _id.price,
        };
        cartD.push(product);
      });
      // console.log(cartbill+'cartbill comes.....')
      if (cartbill) {
        let bill_amount = cartbill.productt.reduce((sum, val) => {
          sum += val.price
          return sum;
        }, 0)
        // console.log(bill_amount,"cart bill total amount");
        let product = {
          userid: cartbill.userr,
          bill_amount,
          productt: cartD,
          coupon: { discount: 0 }
        }
        console.log(product);
        let neworder = new orderModel(product)
        neworder.save().then((data) => {
          // console.log(data,"data coming........");
          res.json(data)


        })
        // console.log(productt,"products details coming......")
        // console.log(cartbill);

      }

    } catch (err) {
      next(err)
    }
  },

//...........................................................

  addcheckaddress: async (req, res) => {
    {
      console.log(req.body.orderid+"ORDERID");
      const id = req.params.id;
      let isExistornot = await UserModel.findOne({ _id: id })
      console.log(isExistornot + "data coming.......")
      let newcheckaddresss = {
        'name': req.body.Name,
        'house': req.body.House,
        'post': req.body.post,
        'city': req.body.city,
        'district': req.body.district,
        'state': req.body.state,
        'pin': req.body.pin
      }
      await UserModel.updateOne({ _id: id }, { $push: { address: newcheckaddresss } })
      console.log("ID");
      res.redirect('/checkout/'+req.body.orderid)
    } 
  },

 //*************************[    Coupon    ]*************************//

  applycoupon: async (req, res, next) => {
    try {
      let apicoupon = {}
      console.log("apply coupon working.....");
      console.log(req.body.id, "ordrid");
      console.log(req.body.coupon, "coupon coming....");
      if (req.body.coupon) {
        couponModel.findOne({
          couponCode: req.body.coupon,
          couponUser: { $nin: req.session.user._id }

        })
          .then((data) => {
            console.log(data + "coupon finded");
            if (data) {
              if (data.expiryDate >= new Date()) {
                orderModel.findOne({
                  _id: req.body.id,
                  userid: req.session.user._id,
                  order_status: "pending",
                })
                  .then((orderdetails) => {
                    if (orderdetails.bill_amount > data.minimumAmount) {
                      orderModel.updateOne({
                        _id: req.body.id,
                        userid: req.session.user._id,
                        order_status: "pending",
                      },
                        {
                          $set: {
                            coupon: {
                              code: data.couponCode,
                              discount: data.percentage,

                            },

                          },
                        }
                      ).then(() => {
                        apicoupon.coupon = data;
                        apicoupon.message = "Applied coupon";
                        apicoupon.success = true;
                        res.json(apicoupon);

                      });

                    } else {
                      apicoupon.message = "This coupon cannot be used for this Amount";
                      res.json(apicoupon);
                    }
                  })

              } else {
                apicoupon.message = "coupon expired";
                res.json(apicoupon);

              }
            } else {
              apicoupon.message = "Invalid coupon || This coupon already used";
              res.json(apicoupon);

            }
          });
      } else {
        apicoupon.message = "enter coupon code";
        res.json(apicoupon);

      }

    } catch (error) {
      next(error)

    }
  },

 //*************************[    Order    ]*************************//

  userOrder : async(req,res,next) =>{
   
    try{
      let addaddress
      console.log("GGGGGGGGGGGG");
      console.log( req.params.id+"PARAMS");
    console.log(req.body.group)
    console.log(req.body.optradio);
    let add=await UserModel.findOne({_id:req.session.user._id})
      add.address.forEach((val)=>{
        if(val._id==req.body.group){
          addaddress=val;
        }
      })
     
    if(req.body.optradio=='COD'){
      console.log('efdgvegs');
      {
              if(req.body.group);
              console.log(req.params.id,"id coming...")
              const order=await orderModel.findOne({
                _id:req.params.id,
                userid:req.session.user._id,
                order_status:'pending'
              });
              console.log(order,"order worked....")
              if(order){
                orderModel.updateOne({
                  _id:req.params.id},
                  {$set:{
                    address:{
                      name:addaddress.name,
                      house:addaddress.house,
                      post:addaddress.post,
                      city:addaddress.city,
                      district:addaddress.district,
                      state:addaddress.state, 
                      pin:addaddress.pin
      
                    },
                    order_status:"Placed",
                    "payment.payment_id":"COD"+req.params.id,
                     paymentMethod:"COD",
                    "payment.payment_method":"cash  on delivery",
                    "delivery_status.ordered.state":true,
                    "delivery_status.ordered.date":Date.now(),
                  },
                }).then(async()=>{
                  await couponModel.updateOne(
                    {couponCode:"order.coupon.code"},
                    {$addToSet:{couponUser:req.session.user._id}}
                    
                  );
                  await UserModel.updateOne(
                    {_id:req.session.user._id},
                    {$set:{cart:[] } }
                    
                  ); 
                  res.json("COD");
                });
      
              }
            }
      
          } else {
            if(req.params.id){
              const order=await orderModel.findOne({_id:req.params.id,userId:req.session.user_id,order_status:"pending"})
              if(order){
                orderModel.updateOne({_id:req.params.id},{
                  $set:{
                    address:{ 
                      name:addaddress.name,
                      house:addaddress.house,
                      post:addaddress.post,
                      city:addaddress.city,
                      district:addaddress.district,
                      state:addaddress.state, 
                      pin:addaddress.pin
                    }
                  }
                }).then(async()=>{
                  await CartModel.updateOne({_id:req.session.user._id},{$set:{cart:[]}});
                  let total = Math.round(
                    order.bill_amount -
                      (order.bill_amount * order.coupon.discount) / 100
                  )*100
                  instance.orders
                    .create({
                      amount: total,
                      currency: "INR",
                      receipt: "" + order._id,
                    })
                    .then((order) => {
                      console.log(JSON.stringify(order)+"ORDERSSSS");
                      res.json({ field: order});
                    });
                  })
                }
              }
              
            }
          }
        
          catch (error) {
            console.log(error);
            next(error)
      
          }
      
    },


    verify:(req,res,next)=>{
      try {
        const response = JSON.parse(req.body.orders);
      let hamc = crypto.createHmac("sha256", 'flUYZtkH5AoBTOoRxjHuaMuE');
      hamc.update(response.raz_oid + "|" + response.raz_id);
      hamc = hamc.digest("hex");
      if (hamc == response.raz_sign) {
        orderModel
          .updateOne(
            { _id: response.id },
            {
              $set: {
                order_status: "completed",
                "payment.payment_status": "completed",
                "payment.payment_id": response.raz_id,
                "payment.payment_order_id": response.raz_oid,
                "payment.payment_method": "Online_payment",
                "delivery_status.ordered.state": true,
                "delivery_status.ordered.date": Date.now(),
              },
            }
          )
          .then(() => {
            res.json("ONLINEPAYMENT");
          });
      } else {
        res.json("failed");
      }
      } catch (error) {
        next(error)
      }
    },

  orderSucess : (req,res,next)=>{
    let user=req.session.user
    res.render('user/orderSucess',{user})

  },


  orderlist: async(req,res)=>{
   try{
    orderModel.find({ userid: req.session.user._id.toString() }).populate('productt.product_id').sort({
      ordered_date : -1}).then((orderDetails) => {
        console.log(orderDetails, "orderdetails working");
        res.render('user/vieworder', { orderDetails, user: req.session.user })

      })
   }catch{
    console.log('++++++++++');
   }
  },

  singleorder: async (req, res, next) => {

    console.log("single ordeer details coming");
    try {
      let orderDetails = await orderModel.findOne({ _id: req.params.id }).populate('productt.product_id').then((orderDetails) => {
        console.log(orderDetails);
        res.render('user/singleorder', { orderDetails, user: req.session.user })

      })



    } catch (error) {
      next(error)

    }
  },

  cancelOrder: (req, res) => {
    console.log("order cancel working..");
    console.log(req.body.id );
    try {
      orderModel
        .updateOne(
          { _id: req.body.id },
          {
            $set: {
              order_status: "Cancelled",
              "delivery_status.canceled.state": true,
              "delivery_status.canceled.date": Date.now(),
            },
          }
        )
        .then(() => {
          res.json("Ordercanceled");
        });
    } catch (error) {
      console.log(error);
    }
  },

  count:async (req, res, next) => {
    try {
      console.log("COUNT+++++++++++++++++++++++++=");
      console.log( req.session.user._id+"USER __________________-");
    const cart=await CartModel.findOne({userr: req.session.user._id})
    const wishList=await WishlistModel.findOne({user1: req.session.user._id})
    console.log(cart,wishList); 
    res.json({ccount:cart,wcount:wishList})
    } catch (error) {
      next(error);
    }
  },
  

}
