class CustomError extends Error {
  constructor(public readonly code: number, message: string) {
    super(message);
  }
}

export {
  CustomError
};