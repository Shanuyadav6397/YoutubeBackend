import mongoose from 'mongoose';
import { DB_NAME } from './constains.js';
import { DB_URL } from './serverConfig.js';

/**
 * The below function helps us to connect to a mongodb server
 */
async function connectDB() {
    try {
        const connectionInstance = await mongoose.connect(`${DB_URL} / ${DB_NAME}`);
        console.log(`\n MOngoDb Connected !! DB HOST : ${connectionInstance.connection.host} / ${DB_NAME}`);
        process.exit(1);
        
    } catch (error) {
        console.log("Not able to connect to the mongodb server");
        console.log(error);
    }
}

export default connectDB;