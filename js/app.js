// -----------------------------------------------------------------------
//                            Angular Application
// -----------------------------------------------------------------------

// Model
var usersData = {
  getUsers: function() {
    return JSON.parse(localStorage.getItem('usersList'));
  },
  addUser: function(userObject) {
    if('usersList' in localStorage) {
      var data = JSON.parse(localStorage.getItem('usersList'));
      data.push(userObject);
      localStorage.setItem('usersList', JSON.stringify(data));
    }
    else {
      var data = [];
      data.push(userObject);
      localStorage.setItem('usersList', JSON.stringify(data));
    }
  },
  editUser: function(index, userObject) {
    var data = JSON.parse(localStorage.getItem('usersList'));
    data[index] = userObject;
    localStorage.setItem('usersList', JSON.stringify(data));
  },
  removeUser: function(index) {
    var data = JSON.parse(localStorage.getItem('usersList'));
    data.splice(index, 1);
    if(data.length) {
      localStorage.setItem('usersList', JSON.stringify(data));
    }
    else {
      localStorage.removeItem('usersList');
    }
  }
}

// Module & Controller
angular
.module('usersListApp', [])
.controller('userListCtrl', function($scope) {

  // Data Object
  $scope.data = usersData.getUsers();

  // Options for switch display data
  $scope.options = [
    { display: 'Добавить', value: 'add', btnClass: 'active' },
    { display: 'Список', value: 'list', btnClass: '' },
    { userNumber: null, value: 'edit' }
  ];

  // add user form partial
  $scope.addUserForm = 'add-user-form.html';

  // edit user form partial
  $scope.editUserForm = 'edit-user-form.html';

  // Default type display data 
  $scope.mode = $scope.options[0];

  // ------------------------------------------
  //               Behaviors
  // ------------------------------------------

  $scope.switchDisplayData = function(number) {
    if(number == 0) {
      $scope.mode = $scope.options[0];
      $scope.options[0].btnClass = 'active';
      $scope.options[1].btnClass = '';
      $scope.newUser = {};
    }
    else {
      $scope.mode = $scope.options[1];
      $scope.options[0].btnClass = '';
      $scope.options[1].btnClass = 'active';
    }
  }

  $scope.addNewUser = function(newUser) {
    if(angular.isDefined(newUser.lastName) &&
      angular.isDefined(newUser.firstName) &&
      angular.isDefined(newUser.middleName)) {
      
      // add data to model
      usersData.addUser(newUser);

      // switch display mode to list
      $scope.mode = $scope.options[1];
      $scope.options[0].btnClass = '';
      $scope.options[1].btnClass = 'active';
      $scope.data = usersData.getUsers();
    }
  }

  $scope.editUser = function(user) {
    if(angular.isDefined(user.lastName) &&
      angular.isDefined(user.firstName) &&
      angular.isDefined(user.middleName)) {
          
      // change user object in model
      var index = $scope.options[2].userNumber;
      usersData.editUser(index, user);

      // switch display mode to list
      $scope.mode = $scope.options[1];
      $scope.data = usersData.getUsers();
    }
  }

  $scope.changeUser = function(index) {
    $scope.user = $scope.data[index];
    $scope.options[2].userNumber = index;
    $scope.mode = $scope.options[2];
    $scope.options[0].btnClass = '';
    $scope.options[1].btnClass = '';
  }

  $scope.removeUser = function(index) {
    var currentUser = $scope.data[index];
    var fullName = currentUser.lastName + ' ' + currentUser.firstName + ' ' + currentUser.middleName;
    var answer = 'Вы действительно хотите удалить пользователя \n' + fullName + '?';
    if(confirm(answer)) usersData.removeUser(index);
    $scope.data = usersData.getUsers();
  }
});