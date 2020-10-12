// Example spec file to see the different methods that can be used in Cypress for network requests.
/// <reference types="Cypress" />
//https://docs.cypress.io/guides/guides/network-requests.html

context('API Testing Examples',() => {  

  // Mock api site url stored in variable for reusability
  const url = 'https://jsonplaceholder.cypress.io';

  // Object containing the first post identical to the object returned on https://jsonplaceholder.cypress.io/posts/1
  const Post = {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body:'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
  };
  
  // Mock user object to test POST requests
  const User = {
        id: 11,
        name: "Danyel Roper",
        username: "Ropa",
        email: "danyelroper123@gmail.com",
  };

  // Overriding the base url in the cypress.json file
  Cypress.config('baseUrl', url); 

  before(() => {
     cy.visit(url);
  });

  // Verifying multiple properties within the response object
  it('Validates the header, status and duration of response', () => {
      
    // cy.request() is used for checking endpoints on an actual, running server without having to start the front end application. 
      cy.request({
          method:'POST',
          url:'/users',
          body: User
         }).then((response) => {
              expect(response.status).to.equal(201); // Checking if the response code is equal to 201 (Resource created)
              expect(response.statusText).to.equal('Created'); // Checking the value of the status text 
              expect(response.duration).to.be.greaterThan(0); // Checking if the duration of the request is greater than 0 (ensuring that the request was executed)
              expect(response.headers).to.haveOwnProperty('content-type').contains('application/json; charset=utf-8'); // checking if the request header contains content-type
        });      

        cy.request({
          method:'GET',
          url:'/users/1',
        }).then((response) => {
            expect(response.status).to.equal(200); 
            expect(response.statusText).to.equal('OK');
            expect(response.duration).to.be.greaterThan(0);
            expect(response.headers).to.haveOwnProperty('content-type').contains('application/json; charset=utf-8'); 
      }); 
          
      cy.request({
          url:'/users/100',
          method:'DELETE',
          failOnStatusCode: false // Allows a user to bypass the failure of a test's execution based on the response status
        }).then((response) => {
            // Checking if the requesred resource is not found as expected
            expect(response.status).to.be.eq(404); 
            expect(response.duration).to.be.greaterThan(0);
            expect(response.statusText).to.equal('Not Found');        
            expect(response.headers).to.haveOwnProperty('date').contains(response.headers.date);
      });
  });

  // Verifying individual properties within the response body
  it('Validates properties of the response body',() => {
      
      cy.request({
        method:'GET',
        url:'/users/1',
        }).then((response) => {         
          expect(response.body).to.have.property('id', 1);
          expect(response.body).to.have.property('username', 'Bret');
          expect(response.body).to.have.property('name', 'Leanne Graham');
          expect(response.body).to.have.property('website','hildegard.org');
          expect(response.body).to.have.property('email', 'Sincere@april.biz');
      });
  });

  // Deep equal is used to check the exact values of a property
  it("Validates the exact value of the response body",() => {

      cy.request('GET','/posts/1').then((response) => {
        expect(response.body).to.deep.equal(Post);
      });
  });

  // Checking if the length of response array is equal to 5000      
  it('Validates the length of the response body',() => { 
    
      cy.request('GET','/photos').then((response) => {
         expect(response.body).to.have.length(5000);
      });
  });

  // Verifying that the token is sent within the request headers
  it('Validates that a user can be authorized',() => {
    
      let username = 'RealDecoy', password = 'Duckling123';
  
      // Using btoa to encode the string in base64, simulating a jwt token
      const token = btoa(`${username}:${password}`); 

      cy.request({
        url:'/users/3',
        method:'DELETE',
        headers:{ 'Authorization': `Bearer: ${token}` // Adding headers with with authorization value
        }}).then((response) => {
          //Check if the request headers has the Authorization property and validating its value 
          expect(response.requestHeaders).to.haveOwnProperty('Authorization').to.not.equal(null);
      });
  });

  // Verifying that the webpage contains a specific element without loading it
  it('Validates the contents of a webpage',() => {

      cy.request('/').its('body').should('include', 'Cypress.io');
      cy.request('/').its('body').should('include', 'JSON Server');
      cy.request('/').its('body').should('include', 'JSONPlaceholder');
      cy.request('/').its('body').should('include', 'For REST endpoints'); 
      
  });

  // Verifying multiple aspects of session storage within the application
  it('Validates session storage within the application', () => {

      cy.window().then(win => {
        cy.wrap(win.sessionStorage).should('exist'); // Verifies that session storage exists within in the application
        cy.wrap(win.sessionStorage.length).should('equal', 0); // Verifies the length of the storage unit
        cy.wrap(win.sessionStorage.getItem('token')).should('be.null'); // Validates the key within the getItem function (replace with your own key)
      });
   });

   // Verifying multiple aspects of cookies within the application
   it('Validates cookies within the application', () => {

    // Specifying optional parameters for cy.setCookie - See https://docs.cypress.io/api/commands/setcookie.html
    const options = { expiry: 2000000001, secure: true, httpOnly: false };

      // First param is the cookie name, second param is the cookie's value, third param is an options object
      cy.setCookie('sessionId','secretkey123', options)
      .then(() => {
        cy.getCookie('sessionId').then((cookie) => {
          cy.wrap(cookie).should('exist') 
          cy.wrap(cookie).should('have.property','domain');
          cy.wrap(cookie).should('have.property','secure');
          cy.wrap(cookie).should('have.property','httpOnly');
          cy.wrap(cookie.domain).should('equal','.cypress.io');
          cy.wrap(cookie.secure).should('be.true');
          cy.wrap(cookie.httpOnly).should('be.false');
          cy.wrap(cookie.expiry).should('be.greaterThan', 2000000000);
        });
     });
   });
});
