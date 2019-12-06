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

    // Show content item
    var contentItemIndex = 0;
    for (var contentItemInt = 0; contentItemInt < contentItems.length; contentItemInt++) {
      var contentItem = contentItems[contentItemInt];
      var contentItemWrapper = contentItem.closest('.tabba');
      var contentWrapperIsSame = contentItemWrapper.isSameNode(wrapper);

      if (contentWrapperIsSame) {

        if (index === contentItemIndex) {
          contentItem.classList.remove('hidden');
        } else {
          contentItem.classList.add('hidden');
        }

        contentItemIndex++;
      }
    }

    // Set active class on toggle.
    var toggleIndex = 0;
    for (var toggleInt = 0; toggleInt < toggles.length; toggleInt++) {
      var toggle = toggles[toggleInt];
      var toggleWrapper = toggle.closest('.tabba');
      var toggleWrapperIsSame = toggleWrapper.isSameNode(wrapper);

      if (toggleWrapperIsSame) {

        if (index === toggleIndex) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }

        toggleIndex++;
      }
    }
  }

  // Add eventListeners.
  var wrappers = document.querySelectorAll('.tabba');

  for (var wrapperInt = 0; wrapperInt < wrappers.length; wrapperInt++) {
    var wrapper = wrappers[wrapperInt];
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');

    // Show the first element upon page load.
    toggleElement(wrapper, 0);

    // Run through toggles.
    for (var toggleInt = 0; toggleInt < toggles.length; toggleInt++) {
      var toggle = toggles[toggleInt];

      toggle.addEventListener('click', handleToggle);
    }
  }
})();
