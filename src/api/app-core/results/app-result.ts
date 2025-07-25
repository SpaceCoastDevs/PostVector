
export class AppResult {
    success: boolean;
    message: string;
    errors: string[];

    constructor(success: boolean, message: string, errors: string[] = []) {
        this.success = success;
        this.message = message;
        this.errors = errors;
    }
}
