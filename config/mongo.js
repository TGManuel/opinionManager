import mongoose from "mongoose";    
export const dbConnection = async () => {
    try {
        
        mongoose.connection.on('error',() => {
            console.log('MongoDB | No se puede conectar a MongoDB')
            mongoose.disconnect()
        })

        mongoose.connection.on('connecting',() => {
            console.log('MongoDB | conectando')
        })

        mongoose.connection.on('connected',() => {
            console.log('MongoDB | Conectado a MongoDB')
        })

        mongoose.connection.on('open',() =>{
            console.log('MongoDB | Conexion exitosa')
        })

        mongoose.connection.on('reconnected',() => {
            console.log('MongoDB | reconectando a MongoDB')
        })

        mongoose.connection.on('disconnected', () =>{
            console.log('MongoDB | desconectado')
        })

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        })

    } catch (error) {
        console.log('Database connection failed',error)
    }
}