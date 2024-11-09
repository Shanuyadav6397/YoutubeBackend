import mongoose, {Schema} from "module";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

commentSchema.plugin(mongooseAggregatePaginate);
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;