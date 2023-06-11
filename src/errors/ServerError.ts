import {CustomError} from "./CustomError";

class ServerError extends CustomError {
  constructor(message: string) {
    super(500, message);
  }
}

export {
  ServerError
};