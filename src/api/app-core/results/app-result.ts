
export class AppResult {
    success: boolean;
    message: string;
    errors: string[];

    constructor(success: boolean, message: string, errors: string[] = []) {
        this.success = success;
        this.message = message;
        this.errors = errors;
    }

    static fail(errors: string[]): AppResult | PromiseLike<AppResult> {
        var result = new AppResult(false, "Operation failed", errors);
        return result;
    }

    static ok(message: string): AppResult | PromiseLike<AppResult> {
        var result = new AppResult(true, message);
        return result;
    }
}

// Create a result for getting a record using a specific Type
export class GetRecordResult<T> extends AppResult {
    record: T | null;

    constructor(success: boolean, message: string, record: T | null = null, errors: string[] = []) {
        super(success, message, errors);
        this.record = record;
    }
}


