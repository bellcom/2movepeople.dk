(function() {
  function handleToggle(event) {
    var clickedElement = this;
    var wrapper = clickedElement.closest('.tabba');
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');

    for (var i = 0; i < toggles.length; i++) {
      var toggle = toggles[i];
      var toggleWrapper = toggle.closest('.tabba');
      var nodeIsSame = toggle.isSameNode(clickedElement);
      var wrapperIsSame = toggleWrapper.isSameNode(wrapper);

      if (nodeIsSame && wrapperIsSame) {
        toggleElement(wrapper, i);
      }
    }
  }

  function toggleElement(wrapper, index) {
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');
    var contentItems = wrapper.querySelectorAll('.tabba-item');

    // Show content item.
    for (var i = 0; i < contentItems.length; i++) {
      var contentItem = contentItems[i];
      var contentItemWrapper = contentItem.closest('.tabba');
      var wrapperIsSame = contentItemWrapper.isSameNode(wrapper);

      if (wrapperIsSame) {

        if (index === i) {
          contentItem.classList.remove('hidden');
        } else {
          contentItem.classList.add('hidden');
        }
      }
    }

    // Set active class on toggle.
    for (var i = 0; i < toggles.length; i++) {
      var toggle = toggles[i];
      var toggleWrapper = toggle.closest('.tabba');
      var wrapperIsSame = toggleWrapper.isSameNode(wrapper);

      if (wrapperIsSame) {

        if (index === i) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }
      }
    }
  }

  // Add eventListeners.
  var wrappers = document.querySelectorAll('.tabba');

  for (var i = 0; i < wrappers.length; i++) {
    var wrapper = wrappers[i];
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');

    // Show the first element upon page load.
    toggleElement(wrapper, 0);

    // Run through toggles.
    for (var i = 0; i < toggles.length; i++) {
      var toggle = toggles[i];

      toggle.addEventListener('click', handleToggle);
    }
  }
})();
