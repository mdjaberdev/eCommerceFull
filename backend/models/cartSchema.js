const mongoose = require("mongoose")

const {Schema} = mongoose

const cartSchema = new Schema({
    productId :{
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity :{
        type: Number,
         default: 1
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})
module.exports = mongoose.model("Cart", cartSchema)