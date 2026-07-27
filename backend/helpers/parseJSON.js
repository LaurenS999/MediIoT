// helpers/parseJSON.js

const parseJSON = (value, defaultValue = null) => {
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch (err) {
    return defaultValue;
  }
};

module.exports = parseJSON;
