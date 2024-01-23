import { CreateOptions, FindOptions, Op } from "sequelize";
import { GroceryItem } from "../models/GroceryItem";
import { Order, User, GroceryItem as groceryItem} from "../constants/entities";
import { Inventory } from "../models/Inventory";
import { ErrorResponse } from "../helpers/Response";
import { Orders } from "../models/Order";


export const getGroceryItem = async (options: FindOptions) => {
    return GroceryItem.findAndCountAll(options)
}

export const addGroceryItem = async (data: groceryItem, options: CreateOptions) => {
    return GroceryItem.create(data, options)
}

export const removeGroceryItem = async (itemId: any) => {
    return GroceryItem.destroy({
        where: {
            itemId: itemId
        }
    })
}

export const updateGroceryItem = async (itemId: any, data: groceryItem) => {
    return GroceryItem.update(data, {
        where: {
            itemId: itemId
        },
    })
}

export const getInventory = async (options: FindOptions) => {
    return Inventory.findAndCountAll(options)
}

export const updateInventoryItem = async (itemId: any, data: any) => {
    const inventoryItemDetails = await Inventory.findOne({
        where: { itemId: itemId}
    })
    if (inventoryItemDetails) {
        const totalQuantity = inventoryItemDetails.getDataValue("totalQuantity") ? inventoryItemDetails.getDataValue("totalQuantity") : 0;
        const request = {
            totalQuantity: parseFloat(totalQuantity),
        };
        switch (data.operation) {
            case "add_quantity":
                request.totalQuantity = request.totalQuantity + data.quantity
                break;
            case "remove_quantity":
                request.totalQuantity = request.totalQuantity - data.quantity
                break;
        }
        if (request.totalQuantity < 0) {
            throw new ErrorResponse(400, "Cannot update inventory as total quantity is either zero or going below zero!", [])
        }
        await Inventory.update(request, {
            where: {
                itemId: itemId
            }
        })
    } else {
        const request = {
            totalQuantity: data.quantity,
            itemId: itemId
        };
        await Inventory.create(request)
    }
    return Inventory.findOne({
        where: {
            itemId : itemId
        }
    })
}

export const orderGroceryItem = async (orders: Order[], user: any) => {
    const computeInventory = await Inventory.findAll({ where: {
        itemId: {
            [Op.in] : orders.map(order => order.itemId)
        },
        [Op.or] : orders.map(order => {
            return {
                totalQuantity : {
                    [Op.gte] : order.orderedQuantity
                }
            }
        }) 
    }, include: [{
        model: GroceryItem,
        as: GroceryItem.tableName,
    }]})
    if (computeInventory.length !== orders.length) throw new ErrorResponse(400, "Validation result!", [{
        message: "Not enough quantity in stock!"
    }])
    // Update the inventory
    const placeOrder : Order[] = []
    const updateInventory = computeInventory.map((inventory) => {
        const ordQunatity = orders.find((order) => order.itemId === inventory.getDataValue("itemId"))?.orderedQuantity as number;
        const itemId = inventory.getDataValue("itemId") as number;
        const itemPrice = inventory.getDataValue("GroceryItem").price as number;
        const totalPrice = itemPrice * ordQunatity;
        const orderDetails : Order = {
            orderedQuantity: ordQunatity,
            itemId,
            totalPrice,
            itemPrice,
            userId: user.userId,
            currentStatus: "ORDERED",
        }
        placeOrder.push(orderDetails)
        return inventory.update({ 
            totalQuantity : inventory.getDataValue("totalQuantity") - ordQunatity
        })
    })
    // Update Inventory
    await Promise.all(updateInventory);
    // Place Order
    await Orders.bulkCreate(placeOrder)
    return placeOrder;
}

export const orderHistoryItems = async (options: FindOptions) => {
    return Orders.findAndCountAll(options);
}