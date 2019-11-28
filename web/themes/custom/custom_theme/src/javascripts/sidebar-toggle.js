const handleToggle = (event) => {
  var sidebars = document.querySelectorAll('.sidebar');

  for (var i = 0; i < sidebars.length; i++) {
    var sidebar = sidebars[i];

    sidebar.classList.toggle('open');
  }
};

// Add eventListeners.
var toggles = document.querySelectorAll('.js-sidebar-toggle');

for (var i = 0; i < toggles.length; i++) {
  var item = toggles[i];

  item.addEventListener('click', handleToggle);
}
