/* eslint-disable import/first */

// Needed for IE11. Must be included before "whatwg-fetch".
import Promise from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = Promise;
}

import 'whatwg-fetch';

/**
 * Parses the JSON returned by a network request
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Body
 *
 * @param  {object} response A response from a network request
 *
 * @returns {object}          The parsed JSON from the request
 */
export function parseJSON(response) {
  return response.json();
}

/**
 * Parses the CSV returned by a network request
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Body
 *
 * @param  {object} response A response from a network request
 *
 * @returns {object}          The parsed JSON from the request
 */
export function parseText(response) {
  return response.text();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @returns {object|undefined} Returns either the response, or throws an error
 */
export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * Usage:
 ```
 const options = {
   body: {},
   credentials: 'include',
   headers: {
     'Content-Type': 'application/json'
   },
   method: 'GET',
 };
 -- or --
 const options = {
   body: new FormData(document.querySelector('form')),
   credentials: 'include',
   method: 'POST',
 };
 request('test.json', options).then(function ({
   message,
   result,
   success,
 }) {
   console.log(message, result, success);
 });
 ```
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @returns {object}           The response data
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}
