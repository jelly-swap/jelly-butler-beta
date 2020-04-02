export const safeAccess = (object, path) => {
    return object
        ? path.reduce(
              (accumulator, currentValue) =>
                  accumulator && accumulator[currentValue] ? accumulator[currentValue] : null,
              object
          )
        : null;
};
