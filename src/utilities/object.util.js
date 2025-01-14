export function parseErrorMessageToJSON(error) {
  const errors = {
    message: ["Something went wrong. Please try again later."],
  };
  const parsedError = parseToJSON(error.message.replace("Error: ", ""));

  if (typeof parsedError === "string") {
    errors.message = [parsedError];
    return errors;
  }

  errors.statusCode = parsedError.statusCode;
  errors.error = parsedError.error;

  if (typeof parsedError.message === "string") {
    errors.message = [parsedError.message];
    return errors;
  }

  errors.message = extractStringValues(parsedError.message ?? {});

  return errors;
}
