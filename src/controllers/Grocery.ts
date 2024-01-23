import { Request, Response, NextFunction } from "express";
import { ErrorResponse, SuccessResponse } from "../helpers/Response";
import { addGroceryItem, getGroceryItem, removeGroceryItem, updateGroceryItem } from "../services/Grocery";
import QUERY_OPTION, { GroceryItem } from "../constants/entities";
import { validationResult } from "express-validator";
import { ValidationErrorItem, Op } from "sequelize";

class Grocery {
    public static get(request: Request, response: Response, next: NextFunction) {
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

    public static addGrocery(request: Request, response: Response, next: NextFunction) {
        const { body } = request;
        const error = validationResult(request);
        if (!error.isEmpty()) {
            throw new ErrorResponse(400, "Validation error!", error as any);
        }
        const requestData = body as GroceryItem;
        addGroceryItem(requestData, {}).then((result) => {
            const success = new SuccessResponse(200, "Details added!", {
                data: result,
            })
            response.status(success.status).send(success);
            return result;
        }).catch((err) => {
            const errors = err?.errors.map((_err: ValidationErrorItem) => {
                return { message: _err.message, path: _err.path, type: _err.type }
            }) || []
            const error = new ErrorResponse(400, err?.message, errors)
            response.status(error.status).send(error)
        })
    }

    public static removeGrocery(request: Request, response: Response, next: NextFunction) {
        const { params } = request;
        const error = validationResult(request);
        if (!error.isEmpty()) {
            throw new ErrorResponse(400, "Validation error!", error as any);
        }
        const { itemId } = params;
        removeGroceryItem(itemId).then((result) => {
            const success = new SuccessResponse(200, "Item deleted!", {
                data: result,
            })
            response.status(success.status).send(success);
            return result;
        }).catch((err) => {
            const errors = err?.errors.map((_err: ValidationErrorItem) => {
                return { message: _err.message, path: _err.path, type: _err.type }
            }) || []
            const error = new ErrorResponse(400, err?.message, errors)
            response.status(error.status).send(error)
        })
    }

    public static updateGrocery(request: Request, response: Response, next: NextFunction) {
        const { params, body } = request;
        const error = validationResult(request);
        if (!error.isEmpty()) {
            throw new ErrorResponse(400, "Validation error!", error as any);
        }
        const { itemId } = params;
        updateGroceryItem(itemId, body).then((result) => {
            const success = new SuccessResponse(200, "Item Updated!", {
                data: result,
            })
            response.status(success.status).send(success);
            return result;
        }).catch((err) => {
            console.log(err)
            const errors = err?.errors && err?.errors.map((_err: ValidationErrorItem) => {
                return { message: _err.message, path: _err.path, type: _err.type }
            }) || []
            const error = new ErrorResponse(400, err?.message, errors)
            response.status(error.status).send(error)
        })
    }
}

export default Grocery;