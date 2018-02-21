const { Schema } = require('mongoose');

const { ObjectId } = Schema;

/**
 * Check an parameter is a string or throw an error.
 */
export function checkString(chars, { method, message } = {}) {
  if (typeof chars !== 'string') {
    throw new Error(message || `String parameter must be given to the ${method || 'unknown'} method.`);
  }
}

/**
 * Check if the id of an item is a valid.
 */
export function checkObjectId(id, { message } = {}) {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error(message || 'Request did not contain a valid id.');
  }
}

/**
 * Check that an item exists.
 */
export function checkExists(value, { message }) {
  if (!value) {
    throw new Error(message || 'No items were found for the given request.');
  }
}
