import Order from "../models/Order.js";
import Product from "../models/product.js";


// places order : /api/order/cod
export const placedOrderCOD = async(req , res)=>{
    try {
        const {items,address}=req.body;
        const userId=req.userId;
        if(!address || items.length===0){
             return res.json({success:false,message:"Invalid data"})
        }
        let amount=await items.reduce(async(acc,item)=>{
           const product=await Product.findById(item.product);
           return (await acc)+product.offerPrice*item.quantity;

        },0)

        amount += Math.floor(amount*0.02);
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD",
        });

       return res.json({success:true,message:"Order Placed Successfully"})
    } catch (error) {
        console.log(error.message);
       return res.json({success:false,message:error.message})
        
    }
}


// get order by userId : /api/order/user
export const getUserOrder=async(req , res)=>{
    try {
        const userId=req.userId;
        const orders=await Order.find({
            userId,
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1});
        res.json({success:true,orders})
    } catch (error) {
         res.json({success:false,message:error.message})
    }
}

// get all data (for seller / admin) : /api/order/seller
export const getAllOrder=async(req , res)=>{
    try {
        const orders=await Order.find({           
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1});
        res.json({success:true,orders})
    } catch (error) {
         res.json({success:false,message:error.message})
    }
}