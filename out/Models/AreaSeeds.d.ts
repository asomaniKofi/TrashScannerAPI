import mongoose, { Document } from 'mongoose';
interface Bin {
    BinName: string;
    BinType: string;
    BinDescription: string;
    BinOccurrence: number;
    BinNextDate: string;
    BinCollectionWeekStart: string;
    BinCollectionWeekEnd: string;
    BinContents: string[];
}
export interface IAreaSeeds extends Document {
    Name: string;
    Bins: Bin[];
}
declare const AreaSeeds: mongoose.Model<IAreaSeeds, {}, {}, {}, mongoose.Document<unknown, {}, IAreaSeeds, {}> & IAreaSeeds & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default AreaSeeds;
