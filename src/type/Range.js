/**
 * @constructor Range
 * Create a range. A range contains a start, step and end.
 *
 * A range can be constructed as:
 *     var a = new Range(start, end);
 *     var b = new Range(start, step, end);
 *
 * To get the result of the range:
 *     range.toVector();
 *     range.toArray();
 *
 * Example usage:
 *     var c = new Range(2, 5);         // 2:1:5
 *     c.toArray();                     // [2, 3, 4, 5]
 *     var d = new Range(2, -1, -2);    // 2:-1:-2
 *     d.toArray();                     // [2, 1, 0, -1, -2]
 *
 * @param {Number} start    Default value is 0
 * @param {Number} [step]   Default value is 1
 * @param {Number} end      Default value is 0
 */
function Range(start, step, end) {
    if (this.constructor != Range) {
        throw new SyntaxError(
            'Range constructor must be called with the new operator');
    }

    if (end == null) {
        end = step;
        step = null;
    }

    if (arguments.length != 2 && arguments.length != 3) {
        throw new TypeError('Wrong number of parameters in Range constructor ' +
            '(2 or 3 expected, ' + arguments.length + ' provided)');
    }
    if (start != null && !isNumber(start)) {
        throw new TypeError('parameter start must be a number');
    }
    if (end != null && !isNumber(end)) {
        throw new TypeError('parameter end must be a number');
    }
    if (step != null && !isNumber(step)) {
        throw new TypeError('Parameter step must be a number');
    }

    this.start = (start != null) ? start : 0;
    this.end = (end != null) ? end : 0;
    this.step = (step != null) ? step : 1;
}

math.Range = Range;

/**
 * Create a clone of the range
 * @return {Range} clone
 */
Range.prototype.clone = function () {
    return new Range(this.start, this.step, this.end);
};

/**
 * Retrieve the size of the range.
 * @returns {Number[]} size
 */
Range.prototype.size = function () {
    // TODO: more efficient size calculation: calculate without writing down
    return [this.toArray().length];
};

/**
 * Get the range as a vector
 * @return {Vector} vector
 */
Range.prototype.toVector = function () {
    return new Vector(this.toArray());
};

/**
 * Get the range as an array
 * @returns {Array} array
 */
Range.prototype.toArray = function () {
    var range = [];
    var x = Number(this.start);
    var step = Number(this.step);
    var end = Number(this.end);

    if (step > 0) {
        while (x <= end) {
            range.push(x);
            x += step;
        }
    }
    else if (step < 0) {
        while (x >= end) {
            range.push(x);
            x += step;
        }
    }

    return range;
};

/**
 * Get the primitive value of the Range: a one dimensional array
 * @returns {Array} array
 */
Range.prototype.valueOf = function () {
    return this.toArray();
};

/**
 * Get the string representation of the range, for example '2:5' or '0:0.2:10'
 * @returns {String} str
 */
Range.prototype.toString = function () {
    var str = format(Number(this.start));
    if (this.step != 1) {
        str += ':' + format(Number(this.step));
    }
    str += ':' + format(Number(this.end));
    return str;
};