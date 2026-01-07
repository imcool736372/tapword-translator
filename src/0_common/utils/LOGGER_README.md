# Logger Utility

Simple logging utility with module prefixes and level control.

## Usage

```typescript
import { createLogger } from '@/0_common/utils/logger';

const logger = createLogger('ModuleName');

logger.debug('Detailed info');  // [ModuleName] Detailed info
logger.info('General info');    // [ModuleName] General info
logger.warn('Warning');         // [ModuleName] Warning
logger.error('Error', err);     // [ModuleName] Error {...}
```

## Configuration (Optional)

```typescript
import { configureLogger } from '@/0_common/utils/logger';

configureLogger({ minLevel: 'warn' });  // Only show warn/error
configureLogger({ enabled: false });    // Disable all logs
```

## Log Levels

- `debug` - Detailed debug info
- `info` - General information
- `warn` - Warning conditions
- `error` - Error conditions
