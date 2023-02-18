const mongoose = require('mongoose');

const orderSchema =new mongoose.Schema({
    
    userid: { type: mongoose.Schema.Types.ObjectId,  
              required:true , 
              ref:'user'},
    
    address: {
        name:      {type:String},
        house:     {type:String}, 
        post:      {type:String}, 
        city:      {type:String}, 
        district:  {type:String}, 
        state:     {type:String}, 
        pin:       {type:Number}
    },
    
    bill_amount: {type:Number, 
                 required:true},
    
    order_status:{type:String, 
                 default:'pending'},
    
    payment:{
             payment_method:{type:String},
             payment_id:{type:String},
             payment_order_id:{type:String},
             payment_status:{type:String, default:'pending'},
    },
    
    productt:[
        {
            product_id:{type:String, ref:'products'},
            name:{type:String},
            qnty:{type:Number},
            price:{type:Number},
        }
    ],
    
    delivery_status:{
        ordered:{
            state:{type:Boolean, default:false},
            date:{type:Date},
        },
        canceled:{
            state:{type:Boolean, default:false},
            date:{type:Date}
        },
        shipped:{
            state:{type:Boolean, default:false},
            date:{type:Date},
        },
        out_for_delivery:{
            state:{type:Boolean, default:false},
            date:{type:Date},
        },
        delivered:{
            state:{type:Boolean, default:false},
            date:{type:Date},
        },
    },
    
    coupon:{
        // name:{type:String},
        code:{type:String},
        discount:{type:Number}
    },
    ordered_date: {type:Date, default: Date.now(), index:true},

})

module.exports = orderModel = mongoose.model('Order',orderSchema);