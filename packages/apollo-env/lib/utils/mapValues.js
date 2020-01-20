"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mapValues(object, callback) {
  const result = Object.create(null);
  for (const [key, value] of Object.entries(object)) {
    result[key] = callback(value);
  }
  return result;
}
exports.mapValues = mapValues;
//# sourceMappingURL=mapValues.js.map
