class ApiResponse {
    constructor(statusCode, success = "success", data, error) {
        this.success = statusCode < 400;
        this.message = success;
        this.data = data;
        this.error = error;
    }
}

export { ApiResponse };