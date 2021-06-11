const baseURL = 'http://localhost:3000';

$(document).ready(function () {
  auth();

  $('#home-logo').click(function (e) {
    e.preventDefault();
    auth();
  });

  $('#main-btn-register, #navlink-register, #register-link').click(function (e) {
    e.preventDefault();
    $('#hero-page').hide();
    $('#login-section').hide();
    $('#register-section').show();
    $('#register-form')[0].reset();
  });

  $('#main-btn-sign-in, #navlink-sign-in, #login-link').click(function (e) {
    e.preventDefault();
    $('#hero-page').hide();
    $('#login-section').show();
    $('#register-section').hide();
    $('#login-form')[0].reset();
  });

  $('#register-form').submit(function (e) {
    e.preventDefault();
    register();
  });

  $('#login-form').submit(function (e) {
    e.preventDefault();
    login();
  });

  $('#today').text(new Date())
  
  $('#sign-out').click(function (e) {
    e.preventDefault();
    localStorage.removeItem('access_token');
    signOut();
    auth();
    $('#login-form')[0].reset();
  });

  $('#main-table-news').on('click', '#main-add-favorite', function (e) {
    e.preventDefault();
    let dataId = $(this).attr("data-id")

    const title = $('#title-' + dataId).text().substring(0, 250);
    const description = $('#description-' + dataId).text().substring(0, 250);
    const url = $('#url-' + dataId).attr('href');
    const imageUrl = $('#imageUrl-' + dataId).attr('src');
    const publishedAt = $('#publishedAt-' + dataId).text();
    console.log(title, description, url, imageUrl, publishedAt);
    addFavorite(title, description, url, imageUrl, publishedAt);
  });

  $('#my-favorite').click(function (e) {
    e.preventDefault();
    showFavorites();
  });

  $('#main-table-fav').on('click', '#main-remove-favorite', function (e) {
    e.preventDefault();
    const id = $(this).data().id;
    const title = $(this).data().title;
    deleteFavorite(id, title);
  });
});

function auth() {
  if (localStorage.getItem('access_token')) {
    $('#hero-page').hide();
    $('#login-section').hide();
    $('#register-section').hide();
    $('#nav-signed-in').show();
    $('#main-container').show();
    $('#favorite-container').hide();

    getNews();
  } else {
    $('#hero-page').show();
    $('#login-section').hide();
    $('#register-section').hide();
    $('#nav-signed-in').hide();
    $('#main-container').hide();
    $('#favorite-container').hide();
  }
}

function register() {
  $.ajax({
    type: 'POST',
    url: baseURL + '/users/register',
    data: {
      email: $('#register-email').val(),
      password: $('#register-password').val(),
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
    type: "POST",
    url: baseURL + "/users/login-captcha",
    data: {
      response: grecaptcha.getResponse()
    }
  })
  .done(result => {
    grecaptcha.reset();

    if (result.success == true) {
      $.ajax({
        type: 'POST',
        url: baseURL + '/users/login',
        data: {
          email: $('#login-email').val(),
          password: $('#login-password').val(),
        },
      })
        .done((res) => {
          localStorage.setItem('access_token', res.access_token);
          auth();
        })
        .fail((err) => {
          console.log(err);
          swal(err.responseJSON.message, "", "warning")
        });
    } else {
      swal("Please Check Catpcha", "", "warning")
    }
  })
  .fail(err => {
    swal(err.responseJSON.message, "", "warning")
  })
}

function onSignIn(googleUser) {
  $.ajax({
    type: "POST",
    url: baseURL + "/users/login-captcha",
    data: {
      response: grecaptcha.getResponse()
    }
  })
  .done(result => {
    grecaptcha.reset();

    if (result.success == true) {
      const id_token = googleUser.getAuthResponse().id_token;
      console.log("====>>", id_token)
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
      } else {
        swal("Please Check Catpcha", "", "warning")
      }
    })
    .fail(err => {
      swal(err.responseJSON.message, "", "warning")
    })
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
      $('#main-table-news').empty();
      news.forEach((el, noUrut) => {
        $('#main-table-news').append(
          `<tbody id="main-table-news-body">
            <tr id="main-card-news">
              <td class="px-3 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-auto h-30 w-30">
                    <img id="imageUrl-${noUrut}" data-imageUrl="${el.imageUrl}"
                      class="h-30 w-30 rounded"
                      src="${el.imageUrl}"
                      alt=""
                    />
                  </div>
                </div>
              </td>

              <td class="px-3 py-4">
                <div class="text-lg font-bold leading-7 text-gray-900 sm:text-xl " id="title-${noUrut}">${el.title}"</div>
                <div class="text-sm text-gray-500" id="description-${noUrut}">
                  ${el.description}
                </div>
              </td>

              <td class="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                <span class="px-4 py-2 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800" id="publishedAt-${noUrut}">
                  ${new Date(el.publishedAt).toISOString().slice(0, 10)}
                </span>
              </td>

              <td class="px-3 py-1 whitespace-nowrap text-right text-sm font-medium">
                <span id="main-read-news" class="hidden sm:block ml-3">
                  <a id="url-${noUrut}" href="${el.url}" target="_blank"><button
                    type="button"
                    class="
                      transition duration-200
                      inline-flex
                      items-center
                      px-4
                      py-2
                      border border-gray-300
                      rounded-md
                      shadow-sm
                      text-sm
                      font-medium
                      text-gray-700
                      bg-white
                      hover:bg-gray-50
                      focus:outline-none
                      focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400
                    "
                  >
                    Read News
                  </button></a>
                </span>
              </td>

              <td class="px-3 py-1 whitespace-nowrap text-right text-sm font-medium">
                <span class="sm:ml-3">
                  <button
                    id="main-add-favorite"
                    type="button"
                    data-id="${noUrut}"
                    class="
                      transition duration-200
                      inline-flex
                      items-center
                      px-4
                      py-2
                      border border-transparent
                      rounded-md
                      shadow-sm
                      text-sm
                      font-medium
                      text-white
                      bg-yellow-500
                      hover:bg-yellow-400
                      focus:outline-none
                      focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
                    "
                  >
                    <!-- Heroicon name: solid/check -->

                    <svg
                      class="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Add to Favorites
                  </button>
                </span>
              </td>
            </tr>
            </tbody>
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
      publishedAt: new Date().toISOString().split('T')[0],
    },
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
  })
    .done((res) => {
      swal("News Add to Favorites Successfully", "", "warning")
      console.log(res);
      getNews();
      
      // todo: alert success add news to fav
    })
    .fail((err) => {
      // todo: alert fail add news to fav
      swal(err.responseJSON.message, "", "warning")
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
      if (favs.length == 0) {
        $('#favorite-container').hide();
        $('#main-container').hide();
        // $('no-favs').show();
      } else {
        $('#favorite-container').show();
        $('#main-container').hide();
        $('#main-table-fav').empty();
        favs.forEach((el) => {
          $('#main-table-fav').append(
            `
            <tbody id="main-table-favorite-body" class="bg-white divide-y divide-gray-300">
              <tr id="main-card-favorite" >
                <td class="px-3 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-auto h-30 w-30">
                      <img
                        class="h-30 w-30 rounded"
                        src="${el.imageUrl}"
                        alt=""
                      />
                    </div>
                  </div>
                </td>

                <td class="px-3 py-4">
                  <div class="text-lg font-bold leading-7 text-gray-900 sm:text-xl ">${el.title}</div>
                  <div class="text-sm text-gray-500">
                    ${el.description}
                  </div>
                </td>

                <td class="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                  <span class="px-4 py-2 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                  ${new Date(el.publishedAt).toISOString().slice(0, 10)}
                  </span>
                </td>

                <td class="px-3 py-1 whitespace-nowrap text-right text-sm font-medium">
                  <span id="main-read-favorite" class="hidden sm:block ml-3">
                    <a href="${el.url}" target="_blank"><button
                      type="button"
                      class="
                        transition duration-200
                        inline-flex
                        items-center
                        px-4
                        py-2
                        border border-gray-300
                        rounded-md
                        shadow-sm
                        text-sm
                        font-medium
                        text-gray-700
                        bg-white
                        hover:bg-gray-50
                        focus:outline-none
                        focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400
                      "
                    >
                      Read News
                    </button></a>
                  </span>
                </td>

                <td class="px-3 py-1 whitespace-nowrap text-right text-sm font-medium">
                  <span class="sm:ml-3">
                    <button
                      id="main-remove-favorite"
                      data-id="${el.id}" data-title="${el.title}"
                      type="button"
                      class="
                        transition duration-200
                        inline-flex
                        items-center
                        px-4
                        py-2
                        border border-transparent
                        rounded-md
                        shadow-sm
                        text-sm
                        font-medium
                        text-white
                        bg-gray-800
                        hover:text-yellow-400
                        focus:outline-none
                        focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
                      "
                    >
                      <!-- Heroicon name: solid/check -->

                      <svg
                        class="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Remove from list
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
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
