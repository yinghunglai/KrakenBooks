angular.module('omnibooks.profile', ['firebase', 'ui.bootstrap'])

  // .controller('uploadBookCtrl', function($scope, fireBase, $stateParams) {
  //   $scope.enterBook = function(title, url, author, subject, isbn) {
  //     if (title !== "" && url !== "" && author !== "" && subject !== "" && isbn !== "") {
  //       console.log('enter!');
  //       fireBase.enterBook(title, url, author, subject, isbn);
  //     }
  //   };
  //   $scope.userId = $stateParams.userId;

  // })

.controller('profileController', ['$scope', 'fireBase', '$stateParams', '$modal', function($scope, fireBase, $stateParams, $modal) {
  $scope.enterBook = function(title, url, author, subject) {
      if (title !== "" && url !== "" && author !== "" && subject !== "") {
        console.log('enter!');
        fireBase.enterBook(title, url, author, subject);
      }
    };
  $scope.userId = $stateParams.userId;

  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };
}])

.factory('fireBase', function($firebaseArray, $firebaseObject) {
    // var myDataRef = new Firebase('https://blazing-inferno-7614.firebaseio.com/');
  var loggedInUser = {};
  var myDataRef = new Firebase('https://brilliant-heat-9814.firebaseio.com');
  var enterBook = function(title, url, author, subject) {
    myDataRef.push({
      title: title,
      url: url,
      author: author,
      subject: subject
    });
  };
  var getBook = function(id) {
    var temp = myDataRef.child(id);
    return $firebaseObject(temp);
  };
  var setUserInfo = function(id) {
    loggedInUser = $firebaseObject(myDataRef.child(id)); //returns object with user details
    return loggedInUser;
  }
  // var setUserInfo = function(userObj) {
  //   var userDb = myDataRef.child('users');
  //   myDataRef.push(obj);
  // }

  return {
    allbooks: $firebaseArray(myDataRef),
    enterBook: enterBook,
    getBook: getBook,
    setUserInfo: setUserInfo,
    loggedInUser: loggedInUser
  };
})

.directive('modal', function() {
  return {
    template: "<div class='ng-modal' ng-show='show'>" +
      "<div class='ng-modal-overlay' ng-click='hideModal()'></div>" +
      "<div class='ng-modal-dialog' ng-style='dialogStyle'>" +
      "<div class='ng-modal-close' ng-click='hideModal()'>X</div>" +
      "<div class='ng-modal-dialog-content' ng-transclude></div>" +
      "</div>" +
      "</div>",
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    }
  };
});