// assi2/api/app/lib/sequelize.tsx

// Sequelize is an Object-Relational Mapping library.
import {
    Sequelize,
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from 'sequelize';

import path from 'path';
import sqlite3 from 'sqlite3';

// "sequelize" manage communication between Question and the DB. It
// translates operations(e.g. findAll()) to a SQL query.
export const sequelize = new Sequelize({
    dialect: 'sqlite', // db type
    dialectModule: sqlite3, // path to the sqlite file
    storage: path.resolve('./sqlite/dev.sqlite'), // where the sqlite file is located
    logging: false,
});

// Question is a subclass of Model
export class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
    declare id: CreationOptional<number>; // user doesn't need to provide an id
    declare topic: string;
    declare question: string;
    declare hint: string;
    declare answer: string;
    declare createdAt: CreationOptional<Date>; // user doesn't need to provide this
    declare updatedAt: CreationOptional<Date>; // user doesn't need to provide this
}

// Create the Questions table
Question.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        hint: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Question',
        tableName: 'Questions',
        timestamps: true,
    }
);

// Ensure DB sync runs only once
let isReady = false;

export async function ensureConnection() {
    if (!isReady) {
        await sequelize.authenticate();
        console.log('SQLite synced successfully');
        isReady = true;
    }
}