angular.module('omnibooks.auth', ['ui.bootstrap'])

.factory('auth', function(fireBase) {
  var loggedInUser = null; // updated when user logs in
  var loggedInOrg  = null;

  var signup = function (authInfo, success, failed) {
    var existingUser = fireBase.getUserInfo(authInfo.org, authInfo.name);
    existingUser.$loaded().then(function () {
      if(existingUser.userDetail){
        console.log('Already exists');
        failed('The username is already registered. Try another name.');
        return;
      }
      console.log('SIGNUP!');
      fireBase.createUser(authInfo, setLoggedInInfo, failed);
    });
  };

  var login = function (authInfo, success, failed) {
    var existingUser = fireBase.getUserInfo(authInfo.org, authInfo.name);
    existingUser.$loaded().then(function () {
      if(!existingUser.userDetail) {
        console.log('User not exists');
        failed('incorrect user name.');
        return;
      }
      authInfo.email = existingUser.userDetail.email;
      fireBase.authWithPassword(authInfo, function (authInfo) {
        setLoggedInInfo(authInfo);
        success();
      }, failed);
    });
  };

  var setLoggedInInfo = function (authInfo) {
    loggedInUser = fireBase.getUserInfo(authInfo.org, authInfo.name);
    console.log(loggedInUser);
    loggedInOrg  = authInfo.org;
    console.log(loggedInOrg);
  };

  var logOut = function () {
    loggedInUser = null;
  };

  var isLoggedIn = function () {
    return !!loggedInUser;
  };

  var getUsername = function() {
    return loggedInUser;
  };

  var getOrg = function() {
    return loggedInOrg;
  }

  return {
    signup: signup,
    login: login,
    loggedInUser: loggedInUser,
    loggedInOrg: loggedInOrg,
    isLoggedIn: isLoggedIn,
    logOut: logOut,
    getUsername: getUsername,
    getOrg: getOrg
  };
});


angular.module('omnibooks')
.controller('authController', ['$scope', '$state', 'auth', 'fireBase', function ($scope, $state, auth, fireBase) {
  $scope.authInfo = {org: 'purdue', name: '', email: '', password: ''};
  $scope.clickSignup = function () {
    showSignupForm();
  };
  $scope.clickLogin = function () {
    if(auth.isLoggedIn()){
      logOut();
      return;
    }
    showLoginForm();
  };
  $scope.login = function () {
    hideError();
    auth.login($scope.authInfo, function () {
      $scope.closeAuthForm();
      $('#logintop').text('Log out');
      $state.go("market");
    }, showError);
  };
  $scope.signup = function () {
    hideError();
    auth.signup($scope.authInfo, function () {
      $state.go("market");
    }, showError);
  };
  $scope.closeAuthForm = function () {
    $('#login_form').css({visibility: 'hidden'});
    $('.login_box').css({visibility : 'hidden'});
    $('#signup_form').css({visibility: 'hidden'});
    $('.signup_box').css({visibility : 'hidden'});
    hideError();
    resetUserInfo();
  };

  var logOut = function () {
    auth.logOut();
    $('#logintop').text('Login');
    $state.go("home");
  };

  function showError(message) {
    $scope.erroMessage = message;
    $('.error').css({visibility: 'visible'});
  }
  function hideError() {
    $scope.erroMessage = '';
    $('.error').css({visibility: 'hidden'});
  }

  function showLoginForm() {
    $('#login_form').css({visibility: 'visible'});
    $('.login_box').css({visibility : 'visible'});
  }
  function showSignupForm() {
    $('#signup_form').css({visibility: 'visible'});
    $('.signup_box').css({visibility : 'visible'});
  }
  function resetUserInfo() {
    $scope.authInfo = {org: 'purdue', name: '', email: '', password: ''};
  }

}])
.run(['$rootScope', '$state', 'auth', function ($rootScope, $state, auth) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    if(toState.name === "home"){
      return;
    }
    if(!auth.isLoggedIn()){
      event.preventDefault();
      $state.go("home");
    }
  });
}]);
