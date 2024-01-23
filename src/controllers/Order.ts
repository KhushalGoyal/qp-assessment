import { Request, Response, NextFunction } from "express";
import { ErrorResponse, SuccessResponse } from "../helpers/Response";
import { validationResult } from "express-validator";
import { ValidationErrorItem, Op } from "sequelize";
import { getGroceryItem, orderGroceryItem, orderHistoryItems } from "../services/Grocery";
import QUERY_OPTION from "../constants/entities";
import { Inventory } from "../models/Inventory";

class Order {
    public static viewGroceryItem(request: Request, response: Response, next: NextFunction) {
        const { query } = request;
        const limit = query?.limit ? query?.limit : QUERY_OPTION.LIMIT;
        const offset = query?.offset ? query?.offse : QUERY_OPTION.OFFSET;
        let searchQuery = {}
        if (query.name) {
            searchQuery = {
                ...searchQuery,
                name: {
                    [Op.like] : `%${query.name}%`
                }
            }
        }
        getGroceryItem({
            where: searchQuery,
            include: [{
                model: Inventory,
                as: Inventory.tableName
            }],
            limit: limit as number,
            offset: offset as number,
            order: [["createdAt", "DESC"]]
        }).then((result) => {
            const success = new SuccessResponse(200, "Data Found!", {
                total: result.count,
                data: result.rows,
                limit,
                offset,
            })
            response.status(success.status).send(success)
            return result;
        }).catch((err) => {
            const error = new ErrorResponse(400, err?.message, [])
            response.status(error.status).send(error)
        })
    }
    public static orderGrocery(request: Request, response: Response, next: NextFunction) {
        const { body, user } = request;
        const error = validationResult(request);
        if (!error.isEmpty()) {
            throw new ErrorResponse(400, "Validation error!", error as any);
        }
        orderGroceryItem(body, user).then((result) => {
            const success = new SuccessResponse(200, "Order Placed!", {
                data: result,
            })
            response.status(success.status).send(success);
            return result;
        }).catch((err: any) => {
            console.log(err)
            const errors = err?.errors && err?.errors.map((_err: ValidationErrorItem) => {
                return { message: _err.message, path: _err.path, type: _err.type }
            }) || []
            const error = new ErrorResponse(400, err?.message, errors)
            response.status(error.status).send(error)
        })
    }

    public static orderHistory(request: Request, response: Response, next: NextFunction) {
        const { query, user } = request;
        const limit = query?.limit ? query?.limit : QUERY_OPTION.LIMIT;
        const offset = query?.offset ? query?.offse : QUERY_OPTION.OFFSET;
        orderHistoryItems({
            where: {
                userId: user?.userId
            },
            limit: limit as number,
            offset: offset as number,
            order: [["createdAt", "DESC"]]
        }).then((result) => {
            const success = new SuccessResponse(200, "Data Found!", {
                total: result.count,
                data: result.rows,
                limit,
                offset,
            })
            response.status(success.status).send(success)
            return result;
        }).catch((err) => {
            const error = new ErrorResponse(400, err?.message, [])
            response.status(error.status).send(error)
        })
    }}

export default Order;