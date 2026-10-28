export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message = "Permintaan tidak valid", errors?: unknown) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Tidak terautentikasi") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Akses ditolak") {
    return new ApiError(403, message);
  }

  static notFound(message = "Data tidak ditemukan") {
    return new ApiError(404, message);
  }

  static conflict(message = "Data sudah ada") {
    return new ApiError(409, message);
  }

  static tooManyRequests(message = "Terlalu banyak percobaan, coba lagi nanti") {
    return new ApiError(429, message);
  }
}
