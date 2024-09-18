import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";// pagination aggregate plugin for mongoose
// It is a plugin for mongoose which adds a paginate method to the Model for easy pagination support.
// It is seprarate topic in mongoose so you can read more about it in mongoose documentation

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: [true, "Please provide a videoUrl"],
        trim: true,
        lowercase: true
    },
    thumbnail: {
        type: String,
        required: [true, "Please provide a thumbnail"],
    },
    title: {
        type: String,
        required: [true, "Please provide a title"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
        trim: true,
        lowercase: true
    },
    duration: {
        type: Number,
        required: [true, "Please provide a duration"],
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {
    timestamps: true
});


videoSchema.plugin(mongooseAggregatePaginate);//pagination plugin for mongoose schema

const Video = mongoose.model("Video", videoSchema);

export default Video;