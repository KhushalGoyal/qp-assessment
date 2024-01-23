export default class BaseResponse {
    public status: number;
    public message: string;
    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}

export class SuccessResponse extends BaseResponse {
    public data = {};
    constructor(status: number, message: string, data: {}) {
        super(status, message)
        this.data = data
    }
}

export class ErrorResponse extends BaseResponse {
    errors : any[] = [];
    constructor(status: number, message: string, errors: any[]) {
        super(status, message)
        this.errors = errors;
    }
}