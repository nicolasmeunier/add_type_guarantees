import { addTypeGuarantees } from './addTypeGuarantees';

type MyQueryResultType = {
  field1: string | null;
  field2: number | null;
  field3: string | null;
};

describe('addTypeGuarantees', () => {
  it('should throw an error if nonNullable fields contain null', () => {
    const records: MyQueryResultType[] = [
      { field1: 'a', field2: 1, field3: 'b' },
      { field1: null, field2: 2, field3: 'c' },
    ];

    expect(() =>
      addTypeGuarantees(records, { nonNullable: ['field1', 'field2'], nullToUndefined: ['field3'] })
    ).toThrow('Field "field1" is null but was declared non-nullable');
  });

  it('should convert null to undefined for specified fields', () => {
    const records: MyQueryResultType[] = [
      { field1: 'a', field2: 1, field3: 'b' },
      { field1: 'c', field2: 2, field3: null },
    ];

    const result = addTypeGuarantees(records, { nonNullable: ['field1', 'field2'], nullToUndefined: ['field3'] });

    expect(result[1].field3).toBeUndefined();
    expect(result[0].field3).toBe('b');
  });
});

describe('addTypeGuarantees - additional tests', () => {
  it('should handle an empty records array gracefully', () => {
    const records: MyQueryResultType[] = [];
    const result = addTypeGuarantees(records, { nonNullable: ['field1'], nullToUndefined: ['field2'] });
    expect(result.length).toBe(0);
  });

  it('should not throw when there are no null values', () => {
    const records: MyQueryResultType[] = [
      { field1: 'not-null', field2: 123, field3: 'also-not-null' },
    ];
    
    expect(() =>
      addTypeGuarantees(records, { nonNullable: ['field1', 'field2'] })
    ).not.toThrow();
  });

  it('should convert multiple fields from null to undefined', () => {
    const records: MyQueryResultType[] = [
      { field1: 'valid', field2: null, field3: 'valid' },
      { field1: 'valid', field2: null, field3: null },
    ];
    
    const result = addTypeGuarantees(records, {
      nonNullable: ['field1'],
      nullToUndefined: ['field2', 'field3'],
    });
    expect(result[0].field2).toBeUndefined();
    expect(result[0].field3).toBe('valid'); // unchanged
    expect(result[1].field2).toBeUndefined();
    expect(result[1].field3).toBeUndefined();
  });

  it('should not mutate the original array', () => {
    const originalRecords: MyQueryResultType[] = [
      { field1: 'original', field2: null, field3: 'original' },
    ];
    const copy = JSON.parse(JSON.stringify(originalRecords));

    const _ = addTypeGuarantees(originalRecords, {
      nonNullable: ['field1'],
      nullToUndefined: ['field2'],
    });

    expect(originalRecords).toEqual(copy);
  });

  it('should handle empty config options gracefully', () => {
    const records: MyQueryResultType[] = [
      { field1: 'a', field2: null, field3: null },
    ];
    const result = addTypeGuarantees(records, {});
    expect(result).toEqual(records);
  });

  it('should handle overlapping fields in nonNullable and nullToUndefined', () => {
    const records: MyQueryResultType[] = [
      { field1: 'a', field2: 1, field3: null },
    ];
    
    expect(() =>
      addTypeGuarantees(records, {
        nonNullable: ['field3'],
        nullToUndefined: ['field3'],
      })
    ).toThrow('Field "field3" is null but was declared non-nullable');
  });

  it('should preserve non-null values in nullToUndefined fields', () => {
    const records: MyQueryResultType[] = [
      { field1: 'a', field2: 1, field3: 'preserve-me' },
    ];
    
    const result = addTypeGuarantees(records, {
      nullToUndefined: ['field3'],
    });
    expect(result[0].field3).toBe('preserve-me');
  });

  it('should handle multiple records with mixed null values', () => {
    const records: MyQueryResultType[] = [
      { field1: 'a', field2: null, field3: 'c' },
      { field1: 'd', field2: 2, field3: null },
      { field1: 'e', field2: null, field3: null },
    ];
    
    const result = addTypeGuarantees(records, {
      nullToUndefined: ['field2', 'field3'],
    });
    
    expect(result[0].field2).toBeUndefined();
    expect(result[0].field3).toBe('c');
    expect(result[1].field2).toBe(2);
    expect(result[1].field3).toBeUndefined();
    expect(result[2].field2).toBeUndefined();
    expect(result[2].field3).toBeUndefined();
  });
}); 