const baseURL = 'http://localhost:3000';

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

  // todo: mungkin butuh event binding
  $('#fav-btn').click(function (e) {
    e.preventDefault();
    const title = $('#title').text();
    const description = $('#description').text();
    const url = $('#url').text();
    const imageUrl = $('#imageUrl').text();
    const publishedAt = $('#publishedAt').text();
    addFavorite(title, description, url, imageUrl, publishedAt);
  });

  $('#show-fav-btn').click(function (e) {
    e.preventDefault();
    showFavorites();
  });

  // todo: mungkin butuh event binding
  $('#delete-btn').click(function (e) {
    e.preventDefault();
    const id = $(this).data().id;
    const title = $(this).data().title;
    deleteFavorite(id, title);
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

function register() {
  $.ajax({
    type: 'POST',
    url: baseURL + '/register',
    data: {
      email: $('#new-email').val(),
      password: $('#new-password').val(),
    },
  })
    .done((user) => {
      console.log(user);
      auth();
      // todo: add register success alert
    })
    .fail((err) => {
      console.log(err);
      // todo: add register error alert
    });
}

function login() {
  $.ajax({
    type: 'POST',
    url: baseURL + '/login',
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
      console.log(err);
      // todo: add login error alert
    });
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token_google;
  $.ajax({
    type: 'POST',
    url: baseURL + '/users/login-google',
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

function getNews() {
  $.ajax({
    type: 'GET',
    url: baseURL + '/news',
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
  })
    .done((news) => {
      news.forEach((el) => {
        $('#card-news').append(
          `
          // todo: add card-news element/content
          `
        );
      });
    })
    .fail((err) => {
      console.log(err);
    });
}

function addFavorite(title, description, url, imageUrl, publishedAt) {
  $.ajax({
    type: 'POST',
    url: baseURL + '/favorites',
    data: {
      title,
      description,
      url,
      imageUrl,
      publishedAt,
    },
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
  })
    .done((res) => {
      console.log(res);
      getNews();
      // todo: alert success add news to fav
    })
    .fail((err) => {
      // todo: alert fail add news to fav
      console.log(err);
    });
}

function showFavorites() {
  $.ajax({
    type: 'GET',
    url: baseURL + '/favorites',
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
  })
    .done((favs) => {
      console.log(favs);
      if (favs.length == 0) {
        $('#favorites-container').hide();
        $('#main-page').hide();
        $('no-favs').show();
      } else {
        $('#favorites-container').show();
        $('#favs').empty();
        favs.forEach((el) => {
          $('#favs').append(
            `
            // todo: add favs div content
            `
          );
        });
      }
    })
    .fail((err) => {
      console.log(err);
    });
}

function deleteFavorite(id, title) {
  swal({
    title: `Are you sure you want to delete "${title}" from favorites?`,
    text: 'Once deleted, you will not be able to recover this news!',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      $.ajax({
        type: 'DELETE',
        url: baseURL + '/favorites/' + id,
        headers: {
          access_token: localStorage.getItem('access_token'),
        },
      })
        .done((res) => {
          swal(title + ' has been deleted!', {
            icon: 'success',
          });
          showFavorites();
        })
        .fail((err) => {
          console.log(err);
        });
    } else {
      // swal('Your imaginary file is safe!');
    }
  });
}
