export const safeAccess = (object, path) => {
    return object
        ? path.reduce(
              (accumulator, currentValue) =>
                  accumulator && accumulator[currentValue] ? accumulator[currentValue] : null,
              object
          )
        : null;
};

export const cmpIgnoreCase = (a1, a2) => a1?.toLowerCase() === a2?.toLowerCase();
