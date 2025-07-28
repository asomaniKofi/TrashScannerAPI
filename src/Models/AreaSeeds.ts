import mongoose, { Document, Schema } from 'mongoose';
interface Bin {
    BinName: string;
    BinType: string;
    BinDescription: string;
    BinOccurrence: number;
    BinNextDate: string;
    BinCollectionWeekStart: string;
    BinCollectionWeekEnd: string;
    BinContents: string[]; // not []
}

const BinSchema: Schema = new Schema ({
    BinName: {type: String},
    BinType: {type: String},
    BinDescription: {type: String},
    BinOccurrence: {type: Number},
    BinNextDate: {type: String},
    BinCollectionWeekStart: {type: String},
    BinCollectionWeekEnd: {type: String},
    BinContents: {type: [String]}
}, { _id: false })

export interface IAreaSeeds extends Document {
    Name: string,
    Bins: Bin[]
}

const areaSeedsSchema: Schema = new Schema({
    Name: { type: String, required: true },
    Bins: { type: [BinSchema], required: true }
}, { collection: 'areabins' });

const AreaSeeds = mongoose.model<IAreaSeeds>('AreaSeeds', areaSeedsSchema);
export default AreaSeeds;