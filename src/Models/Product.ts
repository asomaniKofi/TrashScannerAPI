import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    ProductID: number,
    ProductName: string,
    Material: string
} 
const productSchema = new Schema({
    ProductID: {type: Number, required: true},
    ProductName: {type: String, required: true},
    Material: {type: String, required: true}
}, { collection: 'Products' });

const Product = mongoose.model<IProduct>('Products', productSchema);
export default Product;