module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      BigNumber = math.type.BigNumber,
      collection = require('../../type/collection'),

      isCollection = collection.isCollection,
      isString = require('../../util/string').isString,

      DEFAULT_NORMALIZATION = 'unbiased';

  /**
   * Compute the variance of a list of values
   * In case of a (multi dimensional) array or matrix, the variance over all
   * elements will be calculated.
   *
   *     var(a, b, c, ...)
   *     var(A)
   *     var(A, normalization)
   *
   * Where `normalization` is a string having one of the following values:
   *
   * @param {Array | Matrix} array                 A single matrix or or multiple scalar values
   * @param {String} [normalization='unbiased']
   *                        Determines how to normalize the variance:
   *                        - 'unbiased' (default) The sum of squared errors is divided by (n - 1)
   *                        - 'uncorrected'        The sum of squared errors is divided by n
   *                        - 'biased'             The sum of squared errors is divided by (n + 1)
   * @return {*} res
   */
  math['var'] = function variance(array, normalization) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function var requires one or more parameters (0 provided)');
    }

    if (isCollection(array)) {
      if (arguments.length == 1) {
        // var([a, b, c, d, ...])
        return _var(array, DEFAULT_NORMALIZATION);
      }
      else if (arguments.length == 2) {
        // var([a, b, c, d, ...], normalization)

        if (!isString(normalization)) {
          throw new Error('String expected for parameter normalization');
        }

        return _var(array, normalization);
      }
      /* TODO: implement var(A [, normalization], dim)
      else if (arguments.length == 3) {
        // var([a, b, c, d, ...], dim)
        // var([a, b, c, d, ...], normalization, dim)
        //return collection.reduce(arguments[0], arguments[1], ...);
      }
      */
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // var(a, b, c, d, ...)
      return _var(arguments, DEFAULT_NORMALIZATION);
    }
  };

  /**
   * Recursively calculate the variance of an n-dimensional array
   * @param {Array} array
   * @param {String} normalization
   *                        Determines how to normalize the variance:
   *                        - 'unbiased'    The sum of squared errors is divided by (n - 1)
   *                        - 'uncorrected' The sum of squared errors is divided by n
   *                        - 'biased'      The sum of squared errors is divided by (n + 1)
   * @return {Number | BigNumber} variance
   * @private
   */
  function _var(array, normalization) {
    var sum = 0;
    var num = 0;

    // calculate the mean and number of elements
    collection.deepForEach(array, function (value) {
      sum = math.add(sum, value);
      num++;
    });
    if (num === 0) throw new Error('Cannot calculate var of an empty array');

    var mean = math.divide(sum, num);

    // calculate the variance
    sum = 0;
    collection.deepForEach(array, function (value) {
      var diff = math.subtract(value, mean);
      sum = math.add(sum, math.multiply(diff, diff));
    });

    switch (normalization) {
      case 'uncorrected':
        return math.divide(sum, num);

      case 'biased':
        return math.divide(sum, num + 1);

      case 'unbiased':
        var zero = (sum instanceof BigNumber) ? new BigNumber(0) : 0;
        return (num == 1) ? zero : math.divide(sum, num - 1);

      default:
        throw new Error('Unknown normalization "' + normalization + '". ' +
            'Choose "unbiased" (default), "uncorrected", or "biased".');
    }
  }
};
