import { addTypeGuarantees } from '../index';

// Test type definitions
type TestRecord = {
  required: string | null;
  optional: number | null;
  unchanged: boolean | null;
  alreadyNonNull: string;
  complexUnion: string | number | null;
  nested: {
    field: string | null;
  };
};

// Type assertion function
const assertType = <T>() => <U extends T>() => {};

describe('addTypeGuarantees type tests', () => {
  it('should properly type non-nullable fields', () => {
    const records: TestRecord[] = [];
    const result = addTypeGuarantees(records, {
      nonNullable: ['required'] as const,
    });

    // Verify that result type has 'required' as non-nullable string
    type ResultType = typeof result;
    assertType<Array<{ required: string }>>()<ResultType>();
    
    // This would fail to compile if result could contain null
    const _test = (item: typeof result[0]) => {
      const str: string = item.required; // Should compile
      // @ts-expect-error
      const nullStr: null = item.required; // Should not compile
    };
  });

  it('should properly type null-to-undefined fields', () => {
    const records: TestRecord[] = [];
    const result = addTypeGuarantees(records, {
      nullToUndefined: ['optional'] as const,
    });

    // Verify that result type has 'optional' as number | undefined
    type ResultType = typeof result;
    assertType<Array<{ optional: number | undefined }>>()<ResultType>();
    
    // This would fail to compile if result could contain null
    const _test = (item: typeof result[0]) => {
      const num: number | undefined = item.optional; // Should compile
      // @ts-expect-error
      const nullNum: null = item.optional; // Should not compile
    };
  });

  it('should preserve types of unspecified fields', () => {
    const records: TestRecord[] = [];
    const result = addTypeGuarantees(records, {
      nonNullable: ['required'] as const,
      nullToUndefined: ['optional'] as const,
    });

    // Verify that result type preserves 'unchanged' type
    type ResultType = typeof result;
    assertType<Array<{ unchanged: boolean | null }>>()<ResultType>();
  });

  it('should properly type combined transformations', () => {
    const records: TestRecord[] = [];
    const result = addTypeGuarantees(records, {
      nonNullable: ['required'] as const,
      nullToUndefined: ['optional'] as const,
    });

    type Expected = Array<{
      required: string;
      optional: number | undefined;
      unchanged: boolean | null;
      alreadyNonNull: string;
      complexUnion: string | number | null;
      nested: {
        field: string | null;
      };
    }>;

    // Verify complete type transformation
    type ResultType = typeof result;
    assertType<Expected>()<ResultType>();
  });

  it('should handle empty config object', () => {
    const records: TestRecord[] = [];
    const result = addTypeGuarantees(records, {});

    // Should preserve all original types
    type ResultType = typeof result;
    assertType<TestRecord[]>()<ResultType>();
  });

  it('should properly type already non-nullable fields', () => {
    const records: TestRecord[] = [];
    const result = addTypeGuarantees(records, {
      nonNullable: ['alreadyNonNull'] as const,
    });

    // Type should remain unchanged for already non-nullable fields
    type ResultType = typeof result[0]['alreadyNonNull'];
    assertType<string>()<ResultType>();
  });

  it('should properly type complex union types', () => {
    const records: TestRecord[] = [];
    const result = addTypeGuarantees(records, {
      nonNullable: ['complexUnion'] as const,
    });

    // Should remove null from union type
    type ResultType = typeof result[0]['complexUnion'];
    assertType<string | number>()<ResultType>();
  });

  it('should properly type nested objects', () => {
    const records: TestRecord[] = [];
    const result = addTypeGuarantees(records, {
      nonNullable: ['nested'] as const,
    });

    // Should preserve nested object structure
    type ResultType = typeof result[0]['nested'];
    assertType<{ field: string | null }>()<ResultType>();
  });

  // Note: The following tests are EXPECTED to fail compilation.
  // The type errors prove that TypeScript correctly prevents invalid usage.
  describe('type error cases (these should fail compilation)', () => {
    it('should error on invalid field names', () => {
      const records: TestRecord[] = [];
      
      // @ts-expect-error - Expected error: 'invalidField' is not a key of TestRecord
      type NonNullableTest = typeof addTypeGuarantees<TestRecord, 'invalidField', never>;
      // @ts-expect-error - Expected error: 'invalidField' is not a key of TestRecord
      type NullToUndefinedTest = typeof addTypeGuarantees<TestRecord, never, 'invalidField'>;
    });
  });
}); 