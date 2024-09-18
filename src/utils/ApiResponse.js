class ApiResponse {
    constructor(statusCode, success = "success", data, error) {
        this.success = statusCode < 400;
        this.data = data;
        this.message = success;
        this.error = error;
    }
}