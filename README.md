# Type-Safe Null to Undefined Converter

A TypeScript utility that provides type-safe guarantees for handling nullable fields in your data structures. It allows you to:
- Ensure specific fields are non-null at runtime
- Convert null values to undefined for better TypeScript ergonomics
- Maintain type safety with proper type narrowing

## Installation

```bash
npm install type-safe-null-converter
```

## Usage

```typescript
import { addTypeGuarantees } from 'type-safe-null-converter';

type MyQueryResultType = {
  field1: string | null;
  field2: number | null;
  field3: string | null;
};

const records: MyQueryResultType[] = [
  { field1: 'a', field2: 1, field3: null },
];

// Convert field3's null to undefined while ensuring field1 and field2 are non-null
const result = addTypeGuarantees(records, {
  nonNullable: ['field1', 'field2'],
  nullToUndefined: ['field3']
});

// TypeScript now knows:
// - result[0].field1 is string (not null)
// - result[0].field2 is number (not null)
// - result[0].field3 is string | undefined (null converted to undefined)
```

## Features

- 🛡️ Runtime validation of non-null constraints
- 🔄 Convert null to undefined for better TypeScript ergonomics
- 📝 Full TypeScript support with proper type narrowing
- 🧪 Comprehensive test coverage
- 🔒 Immutable operations - doesn't modify input data

## API

### `addTypeGuarantees(records, config)`

#### Parameters

- `records`: Array of records containing potentially null fields
- `config`: Configuration object with:
  - `nonNullable?: (keyof T)[]`: Fields that must not be null
  - `nullToUndefined?: (keyof T)[]`: Fields where null should be converted to undefined

#### Returns

A new array with the specified transformations applied, maintaining proper TypeScript types.

## License

MIT 