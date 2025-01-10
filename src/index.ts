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
    for (const key of nonNullable) {
      if (record[key] === null) {
        throw new Error(`Field "${String(key)}" is null but was declared non-nullable.`);
      }
    }

    const updated = { ...record };
    for (const key of nullToUndefined) {
      if (updated[key] === null) {
        updated[key] = undefined as unknown as TRecord[NullToUndefinedKeys];
      }
    }

    return updated as Omit<TRecord, NonNullableKeys | NullToUndefinedKeys> &
      {
        [K in NonNullableKeys]: Exclude<TRecord[K], null>;
      } &
      {
        [K in NullToUndefinedKeys]: Exclude<TRecord[K], null> | undefined;
      };
  });
}

export { addTypeGuarantees }; 