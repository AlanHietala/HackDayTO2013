nodejs Authentication Example
===============================

This example of basic user authentication uses bcrypt to hash user passwords. It is using Mongoose ODM and express. Most of the authentication occurs in the /models/usermodel.js file.

Why use bcrypt? read http://codahale.com/how-to-safely-store-a-password/

Signup for an account occurs at the route /users/new 
Login occurs at /sessions/new

Once you have an account if you are logged in you can view it at /users/:id and it only displays the users email.

This is a learning resource / weekend hack in its current state and not something you should consider using in a production app. Passport.js is your goto for authentication needs at the time of writing. 


Middleware
===================
There are some helper middleware functions related to authentication in /middleware. 

Tests
========================
There are some basic tests of the user model in /test/ which exercises all of the main functions of that model. The tests are written in mocha.js