const baseURL = 'http://localhost:3000/';

$(document).ready(function () {
  auth();

  $('#register-btn').click(function (e) {
    e.preventDefault();
    $('#register-container').show();
    $('#login-container').hide();
  });

  $('#register-cancel-btn').click(function (e) {
    e.preventDefault();
    $('#register-container').hide();
    $('#login-container').show();
  });

  $('#register-form').submit(function (e) {
    e.preventDefault();
    register();
  });

  $('#login-form').submit(function (e) {
    e.preventDefault();
    login();
  });

  $('#logout-btn').click(function (e) {
    e.preventDefault();
    localStorage.removeItem('access_token');
    signOut();
    auth();
    $('#login-form')[0].reset();
  });
});

function auth() {
  if (localStorage.getItem('access_token')) {
    $('#login-container').hide();
    $('#register-container').hide();
    $('#header').show();
    $('#main-page').show();

    getNews();
  } else {
    $('#login-container').show();
    $('#register-container').hide();
    $('#header').hide();
    $('#main-page').hide();
  }
}

function getNews() {
  // todo: handle API from backend to get/show news
}

function register() {
  $.ajax({
    type: 'POST',
    url: baseURL + 'register',
    data: {
      email: $('#new-email').val(),
      password: $('#new-password').val(),
    },
  })
    .done((res) => {
      auth();
      // todo: add register success alert
    })
    .fail((err) => {
      // todo: add register error alert
    });
}

function login() {
  $.ajax({
    type: 'POST',
    url: baseURL + 'login',
    data: {
      email: $('#new-email').val(),
      password: $('#new-password').val(),
    },
  })
    .done((res) => {
      localStorage.setItem('access_token', res.access_token);
      auth();
    })
    .fail((err) => {
      // todo: add login error alert
    });
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    type: 'POST',
    url: baseURL + '/users/google-login',
    data: {
      token: id_token,
    },
  })
    .done((res) => {
      localStorage.setItem('access_token', res.access_token);
      auth();
    })
    .fail((err) => console.log(err));
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}
