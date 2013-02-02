 var mongoose = require('mongoose')
  , UserModel = require('../models/usermodel').create()
  , expect = require('expect.js');
  

function resetDatabase(){
  UserModel.collection.remove(); // if you use drop it kills your indexes
};

function connectToDatabase(){
  mongoose.connect('mongodb://localhost/authexample_test');
};

describe('Auth Users', function(done){
  
  resetDatabase();
  beforeEach(function(done) {
  	 connectToDatabase();
  	 done();
  });

  afterEach(function(done) {
  	 mongoose.disconnect(function() {
  	 	done();
  	 });
  	 
  });
  it('should create a new user with username and password supplied', function(done) {
   
  	var user = new UserModel({email:"test1@test.com",password:"12345"});
  	user.save(function(error, result) {
  	 	expect(error).to.be(null);
  	 	done();
  	});
	
  });
  
  it('should hash the password when creating a new user object using username and password params', function(done) {
  
    var user1 = new UserModel({email : "createusertest@test.com",password : "12345"});
    user1.save(function(error){
      expect(error).to.be(null);
      expect(user1.passwordHash).to.be.a('string');
      expect(user1.email).to.be("createusertest@test.com");
      done();
    });
     
  });
  
  it('should not create a user with a duplicate email address', function(done) {
    // if this fails ensure the unique constraint is on the DB properly
 
    var userObj = {email:"test2@test.com",password:"12345"};
    var user1 = new UserModel(userObj);
    user1.save(function(error){
      
      var user2 = new UserModel(userObj);
      user2.save(function(error){
          expect(error).to.not.be(null);
          expect(error.code).to.be(11000); // dup key error
          
          done();
      });
    });
    
  });

  it('should generate a reset guid', function(done) {
  
    var userObj = {email : "createresetguid@test.com",password : "12345"}
      , user = new UserModel(userObj);

    user.save(function(error){
      user.createResetGuid(function(error, resetGuid){
        
        expect(resetGuid).to.be.a('string');
        expect(resetGuid).to.not.be(null);
        
       	done();
      });
     
    });

  });
  
  it('should reset the password when the correct guid is supplied', function(done){
     
    var userObj = {email : "createresetguid1@test.com",password : "12345"}
      , user = new UserModel(userObj);

    user.save(function(error){
      user.createResetGuid(function(error, resetGuid) {
  
        var newPassword = "newpassword";
        user.resetPassword(resetGuid, newPassword, function(error) {
          expect(error).to.be(null);
          
          user.verifyPasswordCorrect(newPassword, function(error, isCorrect) {
            //expect(error).to.be(null);
            expect(isCorrect).to.be(true);    
            done();
          });    

        });
        
      });
     
    });
  });

  it('should not reset the password when an incorrect guid is supplied', function(done) {
    var userObj = {email : "createfalseresetguid@test.com",password : "12345"}
      , user = new UserModel(userObj);

    user.save(function(error) {
      user.createResetGuid(function(error, resetGuid) {
        var newPassword = "newpassword";
        user.resetPassword("wrongdamnresetguid", newPassword, function(error) {
          expect(error).to.not.be(null);
          done();

        });
        
      });
     
    });
  });
  it('should accept a correct password', function(done) {

    var userObj = {email : "verifypassword@test.com", password : "verifythispassword"}
      , user = new UserModel(userObj);

    user.save(function(error) {
      user.verifyPasswordCorrect(userObj.password, function(error, isCorrect) {
        
        expect(isCorrect).to.be(true);
       
        done();
      });
     
    });
  });

  it('should reject an incorrect password', function(done) {
  
    var userObj = {email : "verifypasswordincorrect@test.com", password : "verifythispassword"}
      , user = new UserModel(userObj);

    user.save(function(error) {
      user.verifyPasswordCorrect("thewrongdamnpassword", function(error, isCorrect) {
        
        expect(isCorrect).to.be(false);
        done();
      });  
    });

  });

});