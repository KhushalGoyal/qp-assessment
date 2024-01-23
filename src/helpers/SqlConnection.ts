import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: '/Users/khushalgoyal/Desktop/Projects/qp-assessment/database/grocery_store. sqlite',
    logging: console.log
})

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
})
