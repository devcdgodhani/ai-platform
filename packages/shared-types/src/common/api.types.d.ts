export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ResponseMeta;
}
export interface ApiError {
    code: ErrorCode;
    message: string;
    details?: unknown;
    requestId?: string;
}
export declare enum ErrorCode {
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    NOT_FOUND = "NOT_FOUND",
    CONFLICT = "CONFLICT",
    AI_PROVIDER_ERROR = "AI_PROVIDER_ERROR",
    AI_RATE_LIMITED = "AI_RATE_LIMITED",
    AI_CONTEXT_TOO_LONG = "AI_CONTEXT_TOO_LONG",
    JOB_FAILED = "JOB_FAILED",
    JOB_NOT_FOUND = "JOB_NOT_FOUND",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
}
export interface ResponseMeta {
    requestId: string;
    timestamp: string;
    pagination?: PaginationMeta;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResult<T> {
    items: T[];
    meta: PaginationMeta;
}
//# sourceMappingURL=api.types.d.ts.map