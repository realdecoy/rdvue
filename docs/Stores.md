# Stores
-----------

A Store is a mechanism for maintain application state in a way which is globally accessible to all components. We use them as intermediary layers to issue API calls to relevant services, and cache the results for \[re\]use. Though the thought may occur to use a plain JavaScript object to achieve state management, a Vue Store differs in two distinct ways:

*   Properties are reactive. Changing Store values will automatically propagate to the component-level bindings which use them.
    
*   Stores enforce a strong process-control for mutating values. Every change within a store **must** go through a specially designed method, called a **Mutation**, in order to update an internal value. This also produces the side-effect of making state manipulation atomic and track-able (using the [Vue DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en)).
    

An application can have as many Stores as needed to logically group state concerns. The RDVue CLI creates strongly typed Stores, enabling full Intellisense and compiler support when writing code against them.

Data within a Store can be managed using 3 intrinsic functionalities of every Store:

*   Getters: Retrieve a value within the store.
    
*   Actions - Arbitrary, asynchronous, functions which can perform business logic and invoke mutations.
    
*   Mutations - Special, synchronous, functions which only update the values in Store. The operate atomically, meaning their changes are indivisible.
    

* * *

### Technical

A Store consists of a standard Class, with **Decorators** providing the special functionality:

*   The **@Module** Decorator is added to the class itself and will be preconfigured with the necessary options whenever you use the CLI to create a new Store.
    
*   The **@Action** Decorator is added to the class’ methods that want to carry-out business logic and be able to persist the result of that into state. @MultiParamAction is preferred over this Decorator due to Vuex quirks in how multiple parameters are handled.
    

?>If multiple parameters are used in a base @Action, the real value of the first parameter will be an array with a payload object, and the second parameter will be an options object. This will likely be entirely misaligned from the type information you specified in TypeScript.

*   The **@MultiParamAction** Decorator is the preferred alternative to @Action because it allows methods to receive multiple parameters.
    
*   The **@Mutation** Decorator flags a method as being able to update the Store’s state. That means any fields which belong to the class may be set within the execution context of these methods.
    

!>Attempting to modify a field outside of a method marked with @Mutation will result in a runtime error with the Vuex framework.