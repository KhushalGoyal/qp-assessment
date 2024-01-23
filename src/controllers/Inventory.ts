import { Request, Response, NextFunction } from "express";
import { ErrorResponse, SuccessResponse } from "../helpers/Response";
import { validationResult } from "express-validator";
import { Op, ValidationErrorItem } from "sequelize";
import { getInventory, updateInventoryItem } from "../services/Grocery";
import QUERY_OPTION from "../constants/entities";

class Inventory {
    public static getInventoryDetails (request: Request, response: Response, next: NextFunction) {
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
        getInventory({
            where: searchQuery,
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

    public static updateInventory(request: Request, response: Response, next: NextFunction) {
        const { params, body } = request;
        const error = validationResult(request);
        if (!error.isEmpty()) {
            throw new ErrorResponse(400, "Validation error!", error as any);
        }
        const { itemId } = params;
        updateInventoryItem(itemId, body).then((result) => {
            const success = new SuccessResponse(200, "Inventory Updated!", {
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
}

export default Inventory;