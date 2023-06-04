import {connect} from 'mongoose';


const connectDB = async() => {
    try {
        const conn = await connect(process.env.MONGODB_URI);
        console.log(`mongodb connected on ${conn.connection.host}`)

    } catch (error) {
        console.error(`Error ${error}`)
        process.exit(1);
    }
    

}

export default connectDB;