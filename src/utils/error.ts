export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = "Recurso no encontrado") {
        super(resource, 404);
    }
}

export class Conflict extends AppError {
    constructor(message: string = "Recurso existente") {
        super(message, 409);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Solicitud inválida") {
        super(message, 400);
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Error interno") {
        super(message, 500);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "No autorizado") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Acceso denegado") {
        super(message, 403);
    }
}