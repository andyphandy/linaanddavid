"use strict";
(function() {
  window.addEventListener("load", init);

  function init() {
    id("rsvp").addEventListener("submit", function(event) {
      event.preventDefault();
      submitForm();
    })
  }

  function submitForm() {
    let params = new FormData();
    params.append("firstName", id("first-name").value);
    params.append("lastName", id("last-name").value);
    params.append("email", id("email").value);
    params.append("option", qs("input[name=\"rsvp\"]:checked").value);
    params.append("comments", id("comments").value);
    fetch("/submitForm", {method: "POST", body: params})
      .then(checkStatus)
      .then(() => {
        id("rsvp").classList.add("hidden");
        let success = id("msg");
        success.textContent = "Successful! Thank you for RSVPing!";
        success.classList.remove("hidden");
      })
      .catch(handleError);
  }

    /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text.
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *    Promise result
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    }
    throw Error("Error in request: " + response.statusText);
  }

  /**
   * Handles errors during the API data retrieval process.
   * @param {string} msg - Error message
   */
  function handleError(msg) {
    id("rsvp").classList.add("hidden");
    let error = id("msg");
    error.textContent = "Something went wrong. Please try again later.";
    error.classList.remove("hidden");
  }

  /**
   * Returns the element that has the ID attribute with the specified value
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id (null if none)
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector
   * @param {string} selector - CSS query selector string
   * @returns {object} first element matching the selector in the DOM tree (null if none)
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();