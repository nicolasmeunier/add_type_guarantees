type AddTypeGuaranteesResult<
  TRecord extends Record<string, any>,
  NonNullableKeys extends keyof TRecord,
  NullToUndefinedKeys extends keyof TRecord
> = Array<
  Omit<TRecord, NonNullableKeys | NullToUndefinedKeys> &
    {
      [K in NonNullableKeys]: Exclude<TRecord[K], null>;
    } &
    {
      [K in NullToUndefinedKeys]: Exclude<TRecord[K], null> | undefined;
    }
>;

// Helper type to narrow a specific key to non-null
type NonNullField<T, K extends keyof T> = Exclude<T[K], null>;

function addTypeGuarantees<
  TRecord extends Record<string, any>,
  NonNullableKeys extends keyof TRecord,
  NullToUndefinedKeys extends keyof TRecord
>(
  records: TRecord[],
  config: {
    nonNullable?: NonNullableKeys[];
    nullToUndefined?: NullToUndefinedKeys[];
  }
): AddTypeGuaranteesResult<TRecord, NonNullableKeys, NullToUndefinedKeys> {
  const { nonNullable = [], nullToUndefined = [] } = config;

  return records.map((record) => {
    // First verify non-null constraints and create a copy
    const result = { ...record };
    
    for (const key of nonNullable) {
      if (result[key] === null) {
        throw new Error(`Field "${String(key)}" is null but was declared non-nullable.`);
      }
      // At this point, we know the value is not null
      const value = result[key];
      if (value !== null) {
        // This assertion is safe because we've verified value is not null
        result[key] = value as NonNullField<TRecord, typeof key>;
      }
    }

    // Then handle null to undefined conversions
    for (const key of nullToUndefined) {
      if (result[key] === null) {
        // This is safe because we're explicitly converting null to undefined
        result[key] = undefined as any;
      }
    }

    // The final type assertion is now safer because we've built up the object
    // with proper type narrowing at each step
    return result as AddTypeGuaranteesResult<TRecord, NonNullableKeys, NullToUndefinedKeys>[0];
  });
}

export { addTypeGuarantees }; 