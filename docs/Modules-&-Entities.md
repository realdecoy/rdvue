# Modules & Entities
------------------------

**Modules** represent your declarative business logic and utilities used throughout your application. These modules do not cater to specific components or pages and should instead represent concepts relevant to the application on a macro level.

?>Modules are located in the **src/modules** directory. Sub-modules should be created as nested directories, each one being considered a Module. All the files within a sub-module directory belong to that sub-module.

?>Tip: create an index.ts file within individual sub-module directories to export all the files as a single JavaScript module (separate concept). Eg. **my-submodule** folder with an **index.ts** containing:

export \* from ‘./foo’  
export \* from ‘./bar’

Here ‘foo’ and ‘bar’ refer to the files foo.ts and bar.ts within the **my-submodule** directory. To import the sub-module:

import { fooData, barData } from ‘@/modules/**my-submodule**’

**Entities** are subset of modules which represent your domain models. These could be database concepts, API abstractions and Data Transfer Objects (DTOs). We keep these modules separate to indicate a tight-coupling with the backend service methods.

?>Entities are located in the **src/entities** directory.