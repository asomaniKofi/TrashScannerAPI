import mongoose, { Document } from 'mongoose';
export interface IProduct extends Document {
    ProductID: number;
    ProductName: string;
    Material: string;
}
declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}> & IProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Product;
