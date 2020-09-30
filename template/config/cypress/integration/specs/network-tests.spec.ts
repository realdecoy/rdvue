// Example spec file to see the different methods that can be used in Cypress for navigation
/// <reference types="Cypress" />

//https://docs.cypress.io/guides/guides/network-requests.html

context('Api Testing Examples',() => {  

  const url = 'https://jsonplaceholder.cypress.io'

  const Post = {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body:'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
  }
  
  const User = {
        id: 11,
        name: "Danyel Roper",
        username: "Ropa",
        email: "danyelroper123@gmail.com",
  }

  Cypress.config('baseUrl', url); // overriding the base url in the cypress.json file

  before(() => {
     cy.visit(url)
  });

  //verfying multiple properties within the response object
  it('Validates the header, status and duration of response', () => {
      
      cy.request({
          method:'POST',
          url:'/users',
          body: User
         }).then((response) => {
              expect(response.status).to.equal(201) //checking if the response code is equal to 201 (Resource craeted)
              expect(response.statusText).to.equal('Created')//checking the value of the status text 
              expect(response.duration).to.be.greaterThan(0) //checking if the duration of the request is greater than 0 (ensuring that the request was executed)
              expect(response.headers).to.haveOwnProperty('content-type').contains('application/json; charset=utf-8') //checking if the request header contains content-type
        });      

        cy.request({
          method:'GET',
          url:'/users/1',
        }).then((response) => {
            expect(response.status).to.equal(200) 
            expect(response.statusText).to.equal('OK')
            expect(response.duration).to.be.greaterThan(0) 
            expect(response.headers).to.haveOwnProperty('content-type').contains('application/json; charset=utf-8') 
      }); 
          
      cy.request({
          url:'/users/100',
          method:'DELETE',
          failOnStatusCode: false //Allows a user to bypass the failure of test execution based on the response status
        }).then((response) => {
            expect(response.status).to.be.eq(404) //checking if the requesred resource is not found as expected
            expect(response.duration).to.be.greaterThan(0)
            expect(response.statusText).to.equal('Not Found')        
            expect(response.headers).to.haveOwnProperty('date').contains(response.headers.date)
      });
  });

  //verfying individual properties within the response body
  it('Validates properties of the response body',() => {
      
      cy.request({
        method:'GET',
        url:'/users/1',
        }).then((response) => {         
          expect(response.body).to.have.property('id', 1)
          expect(response.body).to.have.property('username', 'Bret')
          expect(response.body).to.have.property('name', 'Leanne Graham')
          expect(response.body).to.have.property('website','hildegard.org')
          expect(response.body).to.have.property('email', 'Sincere@april.biz')
      });
  });

  //deep equal is used to check the exact values of a property
  it("Validates the exact value of the response body",() => {

      cy.request('GET','/posts/1').then((response) => {
        expect(response.body).to.deep.equal( Post )
      });
  });

  //checking if the length of response array is equal to 5000      
  it('Validates the length of the response body',() => { 
    
      cy.request('GET','/photos').then((response) => {
         expect(response.body).to.have.length(5000)
      });
  });

  //verifying that token is sent within the request headers
  it('Validates that a user can be authorized',() => {
    
    let username = 'RealDecoy', password = 'Duckling123'
  
      const token = btoa(`${username}:${password}`)

      cy.request({
        url:'/users/3',
        method:'DELETE',
        headers:{ 'Authorization': `Bearer: ${token}` // Adding headers with with authorization value
        }}).then((response) => {
          expect(response.requestHeaders).to.haveOwnProperty('Authorization').to.not.equal(null) //Check if the request headers has the Authorization property and validating its value 
      });
  });

  //verifying that the webpage contains a specific element without loading it
  it('Validates the contents of a webpage',() => {
    cy.request('/').its('body').should('include', 'Cypress.io')
    cy.request('/').its('body').should('include', 'JSON Server')
    cy.request('/').its('body').should('include', 'JSONPlaceholder')
    cy.request('/').its('body').should('include', 'For REST endpoints') 
      
  });

  //verfying multiple aspects of the session storage within the web page
  it('Validates the session storage on the webpage', () => {

      cy.window().then(win => {
        cy.wrap(win.sessionStorage).should("exist"); // Verifies that session storage exists within in the application
        cy.wrap(win.sessionStorage.length).should('equal', 0); // Verifies the length of the storage unit
        cy.wrap(win.sessionStorage.getItem('token')).should('be.null'); // Validates the key within the getItem function (replace with your own key)
      });
   });
});
