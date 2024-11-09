import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        // we find the channels a user is subscribed to by finding all the subscriptions where the subscriber is the same as the user id
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "User",
    },
    channel: {
        // we find the subscribers of a channel by finding all the subscriptions where the channel is the same as the channel id
        type: Schema.Types.ObjectId, // one who is being subscribed
        ref: "User",
    },
}, {timestamps: true});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;