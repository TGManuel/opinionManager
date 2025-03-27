'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import postRoutes from '../src/post/post.routes.js';
import commentRoutes from '../src/comment/comment.routes.js';
import categoryRoutes from '../src/categories/category.routes.js';
import Category from '../src/categories/category.model.js';
import Usuario from '../src/users/user.model.js';
import { hash } from 'argon2';

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

const configurarRutas = (app) => {
    app.use('/opinionManager/auth', authRoutes);
    app.use('/opinionManager/users', userRoutes);
    app.use('/opinionManager/posts', postRoutes);
    app.use('/opinionManager/comments', commentRoutes);
    app.use('/opinionManager/categories', categoryRoutes);
};

const initializeCategories = async () => {
    try {
        const defaultCategory = await Category.findOne({ name: 'General' });
        if (!defaultCategory) {
            await Category.create({ name: 'General' });
            console.log('Categoría predeterminada creada: "General".');
        } else {
            console.log('La categoría predeterminada "General" ya existe.');
        }
    } catch (error) {
        console.error('Error al inicializar las categorías:', error);
    }
};

const crearAdmin = async () => {
    try {
        const adminExistente = await Usuario.findOne({ role: 'ADMIN_ROLE' });

        if (!adminExistente) {
            const passwordEncriptada = await hash('adminito');

            const admin = new Usuario({
                name: 'Admin',
                surname: 'Admin',
                username: 'admin',
                email: 'admin@gmail.com',
                phone: '12345',
                password: passwordEncriptada,
                role: 'ADMIN_ROLE',
            });

            await admin.save();
            console.log('Usuario administrador creado con éxito.');
        } else {
            console.log('El usuario administrador ya existe.');
        }
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    }
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Conexión establecida con la base de datos.');
        await initializeCategories();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

export const iniciarServidor = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    await conectarDB();
    await crearAdmin();
    configurarMiddlewares(app);
    configurarRutas(app);

    app.listen(port, () => {
        console.log(`Servidor en ejecución en el puerto ${port}.`);
    });
};
