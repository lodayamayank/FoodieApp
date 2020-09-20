$(document).on('click', '#done', function () {
  const token = getParameterByName('token');
  window.location.href = `home.html?token=${token}`;
});
