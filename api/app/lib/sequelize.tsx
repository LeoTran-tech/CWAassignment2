// assi2/api/app/lib/sequelize.tsx
import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import path from 'path';
import sqlite3 from 'sqlite3';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    dialectModule: sqlite3,
    storage: path.resolve('./sqlite/dev.sqlite'),
    logging: false,
});

export class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
    declare id: CreationOptional<number>;
    declare topic: string;
    declare question: string;
    declare hint: string;
    declare answer: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

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
        },
        hint: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Question',
        tableName: 'questions',
        timestamps: true,
    }
);

// ✅ Ensure DB sync runs only once
let isSynced = false;

export async function initDB() {
    if (!isSynced) {
        await sequelize.sync({ alter: true });
        console.log('✅ SQLite synced successfully');
        isSynced = true;
    }
}
