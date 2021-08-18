# Services
-----------------

Services are focused classed designed to interact with web API endpoints. As a good design pattern a service should:

*   only interact with a single domain
    
*   only provide features from the domain which are relevant to the theme of the service. Eg. A user service should be focused on methods support such; adding order related data would make for poor encapsulation.
    

### Technical

* * *

*   While each generated service resides in its own file and class, all services extend a predefined BaseService class in order to provide centralized functionality.
    
*   Each service is able to specify a unique web API endpoint with which to interact - or none at all for services providing local functionality (Eg. wrapper storage mechanism over LocalStorage).
    
*   Each service has access to the following protected memebers:
    

| **Member**                                     | **Description**                                                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| api (field)  <br>type: Axios                   | Helper to invoke web APIs. Individual service methods need only specify their endpoint paths relative to the registered root domain. |
| onRequest(request: AxiosRequestConfig) => void | Invoked before requests are sent to the web API endpoint.                                                                            |
| onResponse(response: AxiosResponse) => void    | Invoked before responses are handled by a Service’s methods.                                                                         |
| onError(data: any)                             | Invoked for errors during request or response.                                                                                       |

### Mobile (TBA)

* * *

?> RDVue's new native mobile template will affect services.