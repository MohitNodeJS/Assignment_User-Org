# CRUD Operation 
    * Two Schema ( User & Organization )
    * JWT Token 
    * Express
    * Validation

## Project Run Command
* `npm i`
* `npm start`

## SetUp Development Environment
  * `npm init`
  * `npm i express`
  * `npm i mongoose`
  * `npm i jsonwebtoken`
  * `npm i joi`
  * `npm i dotenv`
  * `npm i bcryptjs`
  * `npm i esm-wallaby`
  * `npm i nanoid`


## CRUD API Link & Working:
  * #### USER Register :POST API  (http://127.0.0.1:6000/api/user/add)
    * userName: Required, text Limit 3 to 15, unique
    * firstName: Required, text Limit 3 to 15 
    * lastName: Optional, text Limit 3 to 15
    * email: Required, text Limit 3 to 50 ,
    * password : Convert bcrypt, Limit 5 to 15
    * reset_password: Default Value:true,
    * organization : { orgName,address:{ address1,address2,city ,state etc Required }.optional }.optional

  * #### USER LOGIN : POST API -- (http://127.0.0.1:6000/api/user/login)
    * Login : userName & password 
    * Then generate a token ( Token Expiry time : 30 minute)

  * #### USER DETAILS UPDATE : PUT API -- (http://127.0.0.1:6000/api/user/update)
    * Auth/Bearer : Add Token User
    * Body/JSON : Modify details user


  * #### ADD ORGANIZATION : POST API -- (http://127.0.0.1:6000/api/organization/add)
    * Auth/Bearer : Add Token User 
    * Body/JSON : Add orgName ,address: {All Required: orgAddress1,orgAddress2,city,state,zipCode}

  * #### TOTAL USER ORGANIZATION DATA : GET API -- (http://127.0.0.1:6000/api/organization/alluser)
    * Show all user data with organization 

  * #### SINGLE USER ORGANIZATION DATA : GET API -- (http://127.0.0.1:6000/api/organization/user)
    * Auth/Bearer : Add Token User 
    * Display single user information & user all Org.

  * #### UPDATE ORGANIZATION : POST API (http://127.0.0.1:6000/api/org/update/:id)
    * Pass url (:id =EdmZZhUh00tU30isL7GzF ) & Update Details


## Package Explanation
* ####  Express Framework:
  Fast, assertive, essential and moderate web framework of Node.js

* #### Mongoose :
  Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

* #### JWT Token :
  JSON Web Token (JWT) is a URL-safe  transferred between two parties.

* #### bcrypt : 
  Allows building a password security platform

* #### .env:
  Environment Variables

* #### Nano ID : 
  Nano ID is nano-sized unique string ID generator for JavaScript

* #### soft-delete-plugin-mongoose : 
  Soft delete documents and restore
  
* #### Middleware : 
  Express.js is a routing and Middleware framework for handling the different routing of the webpage and it works between the request and response
  
    
## Package Version:
 * node : v16.17.1
 * express: express@4.18.2
 * bcryptjs: "^2.4.3",
 * esm: "^3.2.25"
 * express-validation: "^4.1.0", 
 * joi: "^17.7.0"
 * jsonwebtoken: "^8.5.1",  
 * mongoose: "^6.7.3",
 * dotenv: "^16.0.3",
 * nanoid: "^4.0.0",







