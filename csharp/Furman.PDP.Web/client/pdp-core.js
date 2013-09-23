
/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\json\json2.js ********************/
/*
    http://www.JSON.org/json2.js
    2010-11-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\json\json2.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\util\azavea.util.js ********************/
var Azavea = {};

/*
 * NOTE ON STRING CONCATENATION:
 *     Use:
 *         var foo = [];
 *         foo.push('bar');
 *         foo.push('bar2');
 *         return foo.join('');
 *     Rather than:
 *         var foo = 'bar';
 *         foo = foo + 'bar2';
 *         return foo;
 *     Array.join is marginally slower than + on modern browsers, but it
 *     is EXPONENTIALLY faster on IE 7 and below.  So for any substantial
 *     amount of string concatenation, be sure to use Array.join if you are
 *     supporting any older IEs.
 *     Here's a blog describing this:
 *         http://blogs.sitepoint.com/2010/09/14/javascript-fast-string-concatenation/
 */

(function(az) {
    // Defaults (feel free to set to something different):
    az.logUrl = 'handlers/logger.ashx';

    // Utility functions:

    az.isArray = function(o) {
        /// <summary>Determines whether the argument is an array.</summary>
        /// http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
        return Object.prototype.toString.call(o) === '[object Array]';
    };
    
    az.superEquals = function(thing1, thing2) {
        /// <summary>A somewhat generic object/array/primitive comparator.</summary>
        /// <returns>Boolean indicating equality</returns>
        var i;
        if (az.isArray(thing1) && az.isArray(thing2)) {
            //Compare two arrays
            
            if (thing1.length === thing2.length) {
                for (i=0; i<thing1.length; i++) {
                    if (!az.superEquals(thing1[i], thing2[i])) {
                        return false;
                    }
                }
            } else {
                return false;
            }
            
            return true;
        } else if (typeof(thing1) === 'object' && typeof(thing2) === 'object') {
            //Compare two objects
            
            if (thing1 !== null && thing2 !== null) {
                for (i in thing1) {
                    if (thing1.hasOwnProperty(i) && thing2.hasOwnProperty(i)) {
                        if (!az.superEquals(thing1[i], thing2[i])) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                
                for (i in thing2) {
                    if (thing1.hasOwnProperty(i) && thing2.hasOwnProperty(i)) {
                        if (!az.superEquals(thing1[i], thing2[i])) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            } else if (thing1 !== null || thing2 !== null) {
                return false;
            }
            return true;
        } else {
            // Compare two primitives OR two mismatch object types
            return thing1 === thing2;
        }
    };
    

    
    // Via http://www.webtoolkit.info/javascript-base64.html
    // Free for use: http://www.webtoolkit.info/licence.html
    // Base64 encoding
    var _base64Key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    az.encodeBase64 = function (input) {
        var output = '';
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = az.encodeUtf8(input);
 
        while (i < input.length) {
 
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
 
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
 
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
 
            output = output +
                _base64Key.charAt(enc1) + _base64Key.charAt(enc2) +
                _base64Key.charAt(enc3) + _base64Key.charAt(enc4);
        }
 
        return output;
    };
 
    // Via http://www.webtoolkit.info/javascript-base64.html
    // Free for use: http://www.webtoolkit.info/licence.html
    // Base64 decoding
    az.decodeBase64 = function (input) {
        var output = '';
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
 
        while (i < input.length) {
 
            enc1 = _base64Key.indexOf(input.charAt(i++));
            enc2 = _base64Key.indexOf(input.charAt(i++));
            enc3 = _base64Key.indexOf(input.charAt(i++));
            enc4 = _base64Key.indexOf(input.charAt(i++));
 
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
 
            output = output + String.fromCharCode(chr1);
 
            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
 
        }
 
        output = az.decodeUtf8(output);
 
        return output;
 
    };
 
    // Via http://www.webtoolkit.info/javascript-base64.html
    // Free for use: http://www.webtoolkit.info/licence.html
    // UTF-8 encoding
    az.encodeUtf8 = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = '', n;
 
        for (n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    };

    // Via http://www.webtoolkit.info/javascript-base64.html
    // Free for use: http://www.webtoolkit.info/licence.html
    // UTF-8 decoding
    az.decodeUtf8 = function (utftext) {
        var string = '';
        var i = 0;
        var c = 0,
            c1 = 0,
            c2 = 0;
 
        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
    };
    
    // Via http://jsolait.net/browser/trunk/jsolait/lib/codecs.js (LGPL)
    // LZW-compress a string
    az.compressLzw = function(s) {
        var dict = {};
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        var i;
        
        for (i=1; i<data.length; i++) {
            currChar=data[i];
            if (dict[phrase + currChar]) {
                phrase += currChar;
            }
            else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;
                code++;
                phrase=currChar;
            }
        }
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        for (i=0; i<out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        return out.join("");
    };

    // Via http://jsolait.net/browser/trunk/jsolait/lib/codecs.js (LGPL)
    // Decompress an LZW-encoded string
    az.decompressLzw = function(s) {
        var dict = {};
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        var i;
        
        for (i=1; i<data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            }
            else {
               phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    };

    az.isStringTruthy = function(str) {
        /// <summary>Determines whether the string represents a falsy value.</summary>

        if (str === 'false') {
            return false;
        } else if (str === '') {
            return false;
        } else if (str === 'NaN') {
            return false;
        } else if (str === 'null') {
            return false;
        } else if (str === 'undefined') {
            return false;
        } else if (str === '0') {
            return false;
        }

        return true;
    };
    
    az.stripTags = function(text) {
        //Courtesy of prototypejs.org (MIT License)
        if (text && text.replace) {
            return text.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
        } else {
            return text;
        }
    };
    
    az.unescapeHTML = function(text) {
        //Courtesy of prototypejs.org (MIT License)
        if (text && text.replace) {
            return az.stripTags(text).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
        } else {
            return text;
        }
    };

    az.escapeHTML = function(text) {
        //Courtesy of prototypejs.org (MIT License)
        if (text && text.replace) {
            return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        } else {
            return text;
        }
    };

    az.getQueryStrParam = function(name, valueRegExpStr) {
        var retVal;
        if (window.location.search) {
            var matches, parts, eqIndex;

            matches = window.location.search.match(new RegExp('[?&]' + name + '=' + valueRegExpStr, 'gi'));
            if (matches && matches.length) {
                // We matched "name=something", now get the something.
                retVal = matches[0].substring(matches[0].indexOf('=') + 1);
            }
        }
        return retVal;
    };

    az.getIntParam = function(name) {
        /// <summary>Gets an integer parameter from the query string.</summary>
        var retVal = az.getQueryStrParam(name, '[-+]?[0-9]+');
        // If we got something, convert it to an integer.
        if (retVal) {
            retVal = parseInt(retVal, 10);
        }
        return retVal;
    };

    az.getFloatParam = function(name) {
        /// <summary>Gets a floating-point parameter from the query string.</summary>
        var retVal = az.getQueryStrParam(name, '[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?');
        // If we got something, convert it to a float.
        if (retVal) {
            retVal = parseFloat(retVal);
        }
        return retVal;
    };

    az.getStringParam = function(name) {
        /// <summary>Gets a string value from the query string.  Assumes it is encoded (I.E.
        ///          & delimits another query string param).</summary>
        var retVal = az.getQueryStrParam(name, '[^&]+');
        if (retVal) {
            retVal = decodeURIComponent(retVal);
        }
        return retVal;
    };

    az.log = function(msg) {
        /// <summary>Ensures the console exists before attempting to log.</summary>
        try {
            if (window.console && window.console.log) {
                window.console.log(msg);
            }
        } catch (ex) {
            // Empty catch block ensures that we never generate errors because
            // we tried to log a message.
        }
    };

    //Deprecated!
    az.formatAsMoney = function(num, excludeCents) {
        Azavea.log('Azavea.formatAsMoney is a deprecated function. Please switch to Azavea.renderers.money');
        return Azavea.renderers.money(num, excludeCents);
    };
    
    az.getValidFloat = function(val, min, max) {
        ///<summary>If val contains just a valid number, returns that number.
        ///         Otherwise returns NaN.</summary>
        var retVal = NaN;
        if (val) {
            //Does it look like a number?
            if (/^[0-9,]*(\.)?[0-9]*$/.test(val)) {
                val = val.replace(',', '');
                if (val[0] === '.') {
                    val = '0' + val;
                }
                retVal = parseFloat(val);
                if (retVal || retVal === 0) {
                    // Min or max might not be specified, but 0 is falsy so check for that.
                    if (min || (min === 0)) {
                        if (retVal < min) {
                            retVal = NaN;
                        }
                    }
                    if (max || (max === 0)) {
                        if (retVal > max) {
                            retVal = NaN;
                        }
                    }
                }
            }
        }
        return retVal;
    };
    
    az.getValidPercentage = function(val) {
        ///<summary>If val contains just a valid percentage (0-100%), returns that percentage.
        ///         Otherwise returns NaN.</summary>
        var retVal = NaN;
        if (/^[0-9,]*(\.)?[0-9]*%?$/.test(val)) {
            val = val.replace(',', '');
            if (val[0] === '.') {
                val = '0' + val;
            }
            retVal = parseFloat(val);
            if ((retVal < 0) || (retVal > 100)) {
                retVal = NaN;
            }
        }
        return retVal;
    };
    
    az.doLast = function(delay, callback) {
        ///<summary>A wrapper to handle rapid function calls when you only
        ///         want to execute the last call. For example, if you set
        ///         a delay of 500ms and execute the callback 3 times within
        ///         500ms, only the last call will execute.</summary>
        
        var timeoutId;
        
        return function(){
            (function(args) {
                //Clear the last timeout, if applicable, then set a new one
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                //Call the function after the delay expires
                timeoutId = setTimeout(function() {
                    return callback.apply(this, args);
                }, delay);
            }(arguments));
        };
    };

    az.errorToString = function(error) {
        var errorStr = '';
        if (error) {
            if (typeof error === 'string') {
                errorStr = error;
            } else {
                $.each(error, function(i, val) {
                    if (errorStr === '') {
                        errorStr = '{ ';
                    } else {
                        errorStr += ', ';
                    }
                    errorStr += i + ': ' + val;
                });
                errorStr += ' }';
            }
        }
        return errorStr;
    };

    az.tryCatch = function(tryingTo, callMe) {
        /// <summary>
        ///     Wrap any call with this to do a little error handling cleanup if the call fails.
        ///
        ///     Instead of:
        ///         $.each(someList, function(i, thing) {
        ///                ...do something...
        ///             });
        ///
        ///     Use:
        ///         $.each(someList, Azavea.tryCatch("doing something", function(i, thing) {
        ///                ...do something...
        ///             }));
        ///
        /// </summary>
        return function() {
            if (az.timeTryCatch) {
                az.startTiming(tryingTo);
            }
            try {
                return callMe.apply(this, arguments);
            } catch (e) {
                az.logError('Unexpected error while calling:\n' + callMe +
                    '\nWith arguments:\n' + arguments, tryingTo, e);
                
                alert('Unable to ' + tryingTo + '.  An error occurred: ' + az.errorToString(e));
                throw e;
            } finally {
                if (az.timeTryCatch) {
                    az.endTiming(tryingTo);
                }
            }
        };
    };

    az.logError = function(message, triedTo, error) {
        /// <summary>Makes a call to a logging handler to log the error with the server-side log.
        ///          In order for this to work, Azavea.logHandlerUrl must be set.
        ///          Also logs to the console if possible.</summary>
        try {
            var errorStr = az.errorToString(error);
            $.ajax({
                url: az.logUrl,
                type: 'POST',
                data: { message: message,
                    triedTo: triedTo,
                    url: window.location.href,
                    level: 'ERROR'
                },
                dataType: 'text',
                success: function(resp) {
                    az.log("Successfully logged error to server, message '" +
                        message + "', attempted action '" + triedTo + "', error '" + errorStr +
                        "'.  Handler response: '" + resp + "'.");
                },
                error: function(resp) {
                    az.log("Unable to log error to server (" + az.logUrl + "), original message '" +
                        message + "', original attempted action '" + triedTo + "', original error '" + errorStr +
                        "'.  Handler response: '" + resp.responseText + "'.");
                }
            });
        } catch (e) {
            az.log("Error while attempting to handle an error, original message '" +
                message + "', original attempted action '" + triedTo + "', original error '" + error +
                "'.  New error: '" + e + "'.");
        }
    };
    
    az.inputOnFocus = function(defaultText, defaultTextStyle) {
        /// <summary>Returns a function to use in the jquery .focus(...) method.
        ///          Default text is the text to show if the user hasn't input anything.
        ///          Default text style is the style to use when displaying the default text. </summary>
        return az.tryCatch('respond to focus on input with default text "' + defaultText +
            '", default text style "' + defaultTextStyle + '"', function() {
                    // On focus, we blank out the default text if it is there
                    // and we remove the 'default text' styling.
                    if (defaultText) {
                        if ($(this).val() === defaultText) {
                            $(this).val('');
                        }
                    }
                    
                    this.select();
                    
                    if (defaultTextStyle) {
                        $(this).removeClass(defaultTextStyle);
                    }
                });
    };
    az.inputOnBlur = function(defaultText, defaultTextStyle) {
        /// <summary>Returns a function to use in the jquery .blur(...) method.
        ///          Default text is the text to show if the user hasn't input anything.
        ///          Default text style is the style to use when displaying the default text. </summary>
        return az.tryCatch('respond to blur on input with default text "' + defaultText +
            '", default text style "' + defaultTextStyle + '"', function() {
                    // On blur, we add the default text if the user has not entered anything
                    // and we add the 'default text' styling.
                    var val = $(this).val();
                    if (!val || (defaultText && (val === defaultText))) {
                        if (defaultTextStyle) {
                            $(this).addClass(defaultTextStyle);
                        }
                        if (defaultText) {
                            $(this).val(defaultText);
                        }
                    } else {
                        // In case this is called on a change or something where we didn't get
                        // a chance to disable the style on focus.
                        if (defaultTextStyle) {
                            $(this).removeClass(defaultTextStyle);
                        }
                    }
                });
    };


    /* Set this to true to automatically time every call that goes through Azavea.tryCatch */
    az.timeTryCatch = false;

    /* This is where we store the timings that have been measured. */
    var timings = {};
    az.startTiming = function(label) {
        /*
         * Begins timing a certain label.  Will count how many and when you
         * print the results you'll get total, count, and average.
         * NOTE: If you didn't call endTiming, your previous start time for
         *       this label will be lost.
         */
        if (!timings[label]) {
            timings[label] = { total: 0, count: 0, start: new Date().getTime() };
        } else {
            timings[label].start = new Date().getTime();
        }
    };
    az.endTiming = function(label) {
        /*
         * Finishes timing a certain label.
         * Print the results to get total, count, and average.
         * NOTE: If you didn't call startTiming, the time will be counted as zero.
         */
        var timing, totaltime;
        var endTime = new Date().getTime();
        if (!timings[label]) {
            timings[label] = { total: 0, count: 1, untimed: 1 };
        } else {
            timing = timings[label];
            if (!timing.count) {
                timing.count = 1;
            } else {
                timing.count += 1;
            }
            if (!timing.start) {
                if (!timing.untimed) {
                    timing.untimed = 1;
                } else {
                    timing.untimed += 1;
                }
            } else {
                totalTime = endTime - timing.start;
                if (!timing.total) {
                    timing.total = totalTime;
                } else {
                    timing.total += totalTime;
                }
            }
        }
    };
    az.timingToString = function(minMs) {
        /*
         * Prints the results (so far) of all the timing statements.
         * Includes total, count, and average.  If minMs is set, only
         * results with a total of at least that many ms will be displayed.
         */
        var retVal = ["Performance timings as of ", dateToISOString(new Date()), ":\n"];
        $.each(timings, function(label, timing) {
            if (timing.total && (!minMs || (timing.total > minMs))) {
                var realCount = timing.count;
                retVal.push(az.padRight(label, 50));
                retVal.push(" - Count: ");
                retVal.push(az.padLeft(timing.count, 6));
                retVal.push(", Total Time: ");
                retVal.push(az.padLeft(timing.total, 9));
                retVal.push("ms");
                if (realCount && timing.total) {
                    if (timing.untimed) {
                        realCount = realCount - timing.untimed;
                    }
                    retVal.push(", Average: ");
                    retVal.push(az.padLeft((timing.total / realCount).toFixed(3), 10));
                    retVal.push("ms");
                }
                retVal.push("\n");
                if (timing.untimed) {
                    retVal.push("    *** NOTE: ");
                    retVal.push(timing.untimed);
                    retVal.push(" runs were NOT TIMED due to having no start time.  Total and Average do not include these runs.\n");
                }
            }
        });
        return retVal.join('');
    };
    az.timingToHtml = function(minMs) {
        /*
         * Prints the results (so far) of all the timing statements in an HTML table.
         * Includes total, count, and average.  If minMs is set, only
         * results with a total of at least that many ms will be displayed.
         */
        var retVal = ['<div class="azPerf"><br/>Performance timings as of ', az.dateToISOString(new Date()),
                      ':<table><tr><th style="padding:3px">Label</th><th style="padding:3px">Count</th><th style="padding:3px">Total Time</th><th style="padding:3px">Average Time</th><th style="padding:3px">Notes</th></tr>'];
        $.each(timings, function(label, timing) {
            if (timing.total && (!minMs || (timing.total > minMs))) {
                var realCount = timing.count;
                retVal.push('<tr><td style="text-align:left">');
                retVal.push(label);
                retVal.push('</td><td style="text-align:right">');
                retVal.push(timing.count);
                retVal.push('</td><td style="text-align:right">');
                retVal.push(timing.total);
                retVal.push('ms</td><td style="text-align:right">');
                if (realCount && timing.total) {
                    if (timing.untimed) {
                        realCount = realCount - timing.untimed;
                    }
                    retVal.push((timing.total / realCount).toFixed(3));
                    retVal.push('ms');
                }
                retVal.push('</td><td style="text-align:left">');
                if (timing.untimed) {
                    retVal.push(timing.untimed);
                    retVal.push(" runs were NOT TIMED due to having no start time.  Total and Average do not include these runs.");
                }
                retVal.push('</td></tr>');
            }
        });
        retVal.push("</table>");
        return retVal.join('');
    };


    /** String utilities */

    az.trimString = function(str) {
        /*
         * Trims all whitespace from the front and end of this string.
         * Courtesy of prototypejs.org (MIT License)
         */
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    };

    az.padLeft = az.tryCatch('padleft a string', function(str, length, padding) {
        /*
         * Pads the input string with the given padding (or spaces if padding is not
         * specified) until the str length is greater than or equal to the specified length.
         */
        var s = str.toString();
        padding = padding || ' ';
        while (length && (s.length < length)) {
            s = padding + s;
        }
        return s;
    });
    az.padRight = az.tryCatch('padright a string', function(str, length, padding) {
        /*
         * Pads the input string with the given padding (or spaces if padding is not
         * specified) until the str length is greater than or equal to the specified length.
         */
        var s = str.toString();
        padding = padding || ' ';
        while (length && (s.length < length)) {
            s = s + padding;
        }
        return s;
    });

    /** Number utilities */
    az.numberToString = az.tryCatch('convert a number to a nicely formatted string', function(num, precision, split) {
        /// <summary>numeric toString to handle decimal precision and commas</summary>
        var str;
        if (precision !== undefined && typeof precision === "number") {
            str = num.toFixed(precision);
        } else {
            str = num.toString();
        }
        var t = '';
        if (split || split === undefined) {
            var lr = str.split('.'); // left/right pieces
            var lft = lr[0], rgt = lr.length === 2 ? lr[1] : ''; // left piece, right piece
            var i; len = lft.length;
            for (i = 0; i < len; i++) {
                if (i > 0 && (len - i) % 3 === 0) {
                    t += ',';
                }
                //t += lft[i]; // ie7 didn't like this, but seems to tolerate the following
                t += lft.slice(i, i + 1);
            }
            // if there was something after the ".", add it back in
            if (rgt) {
                t += '.' + rgt;
            }
        } else {
            t = str;
        }
        return t;
    });

    /** Date utilities */
    az.addToDate = Azavea.tryCatch('add time to a date', function(d, interval, amt) {
        /*
         * Adds an amount (amt) of time units specified by interval (I.E. 'SECOND') to
         * the date d.
         */
        var retVal = d;
        switch (interval.toUpperCase()) {
            case 'SECOND': retVal.setSeconds(d.getSeconds() + amt); break;
            case 'MINUTE': retVal.setMinutes(d.getMinutes() + amt); break;
            case 'HOUR': retVal.setHours(d.getHours() + amt); break;
            case 'DAY': retVal.setHours(d.getHours() + (amt * 24)); break;
            case 'WEEK': retVal.setHours(d.getHours() + ((amt * 7) * 24)); break;
            case 'MONTH': retVal.setMonth(d.getMonth() + amt); break;
            case 'YEAR': retVal.setFullYear(d.getFullYear() + amt); break;
        }
        return retVal;
    });

    az.cloneDate = Azavea.tryCatch('clone a date', function(d) { return new Date(d.getTime()); });

    az.dateToISOString = Azavea.tryCatch('convert a date to an ISO string', function(d) {
        // From http://www.json.org/json.js. Public Domain. 
        function f(n) {
            return n < 10 ? '0' + n : n;
        }
        // added for milliseconds by Azavea
        function f1(n) {
            if (n < 10) { return '00' + n; }
            if (n < 100) { return '0' + n; }
            return n;
        }

        return d.getUTCFullYear() + '-' +
            f(d.getUTCMonth() + 1) + '-' +
            f(d.getUTCDate()) + 'T' +
            f(d.getUTCHours()) + ':' +
            f(d.getUTCMinutes()) + ':' +
            f(d.getUTCSeconds()) + '.' +
            f1(d.getUTCMilliseconds()) + 'Z';
    });
}(Azavea));

/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\util\azavea.util.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\util\azavea.util.prototype.js ********************/
(function(az) {
    /*
     * For those who prefer prototype augmentation, here are a number of utility methods
     * handily grafted onto the prototypes for the base objects.
     */
    String.prototype.trim = String.prototype.trim || function() {
        return az.trimString(this);
    };
    String.prototype.padLeft = String.prototype.padLeft || function(length, padding) {
        return az.padLeft(this, length, padding);
    };
    String.prototype.padRight = String.prototype.padRight || function(length, padding) {
        return az.padRight(this, length, padding);
    };
    String.prototype.htmlEncode = String.prototype.htmlEncode || function() {
        return az.escapeHTML(this);
    };

    Number.prototype.superToString = Number.prototype.superToString || function(precision, split) {
        return az.numberToString(this, precision, split);
    };

    Date.prototype.add = Date.prototype.add || function(interval, amt) {
        return az.addToDate(this, interval, amt);
    };
    Date.prototype.clone = Date.prototype.clone || function() {
        return az.cloneDate(this);
    };
    Date.prototype.toISOString = Date.prototype.toISOString || function() {
        return az.dateToISOString(this);
    };
}(Azavea));

/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\util\azavea.util.prototype.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\util\azavea.renderers.js ********************/
(function(az) {
    az.renderers = {
        address: function(house, extension, unit, stprefix, stname, sttype, stsuffix) {
            var address = '';
            if (house && house.toString().trim().length > 0) {
                address += house;
            }
            if (extension && extension.toString().trim().length > 0) {
                address += ' - ' + extension;
            }
            if (unit && unit.toString().trim().length > 0) {
                address += ' ' + unit;
            }
            if (stprefix && stprefix.toString().trim().length > 0) {
                address += ' ' + stprefix;
            }
            if (stname && stname.toString().trim().length > 0) {
                address += ' ' + stname;
            }
            if (sttype && sttype.toString().trim().length > 0) {
                address += ' ' + sttype;
            }
            if (stsuffix && stsuffix.toString().trim().length > 0) {
                address += ' ' + stsuffix;
            }

            return address;
        },
        noValue: function(val) {
            if (typeof val === 'string') {
                val = val.trim();
            }
            if (val === 0) {
                return val;
            }
            return val || '[No Value]';
        },
        yesNo: function(yesNoVal) {
            var v = '';
            if (yesNoVal !== undefined) {
                v = yesNoVal ? 'Yes' : 'No';
            } else if (typeof yesNoVal === 'boolean' || typeof yesNoVal === 'number') {
                v = yesNoVal ? 'Yes' : 'No';
            } else if (typeof yesNoVal === 'string') {
                v = yesNoVal === '1' || yesNoVal.toLowerCase() === 'true';
            }
            return v;
        },
        date: function(dateVal) {
            var d = '';
            if (dateVal.getDate) {
                var dt = dateVal.getDate(), m = dateVal.getMonth() + 1;
                var day = (dt < 10 ? '0' : '') + dt;
                var month = (m < 10 ? '0' : '') + m;

                d = month + '-' + day + '-' + dateVal.getFullYear();
            }
            return d;
        },
        money: function(num, excludeCents) {
            /// <summary>Converts the input into a nicely formatted string ($##,###.##).</summary>
            // Inspiration for this function came from http://javascript.internet.com/forms/currency-format.html
            // This was determined to be public domain as the description said:
            //     Simply click inside the window below, use your cursor to highlight the script, and copy (type Control-c or Apple-c) the script into a new file in your text editor (such as Note Pad or Simple Text) and save (Control-s or Apple-s). The script is yours!!!
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num)) {
                num = "0";
            }
            // Convert back to a number since we need to check on value
            num = parseFloat(num);
            sign = (num === (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / 100).toString();
            
            if (cents < 10) {
                cents = "0" + cents;
            }
            var i;
            for (i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                    num.substring(num.length - (4 * i + 3));
            }
            
            var retVal = ((sign) ? '' : '-') + '$' + num;
            if (!excludeCents) {
                retVal += ('.' + cents);
            }
            return retVal;
        },
        length: function(lengthVal, units) {
            var n = '';
            if (typeof lengthVal === 'number') {
                n = Math.round(lengthVal, 0);
                n = n.superToString();
                n += ' ' + units;
            }
            return n;
        },
        area: function(areaVal, units) {
            var n = '';
            if (typeof areaVal === 'number') {
                n = Math.round(areaVal, 0);
                n = n.superToString();
                n += ' ' + units + '<sup>2</sup>';
            }
            return n;
        },
        elevation: function(bottom, top, flag) {
            var elev = '';
            if (flag && flag === 1) {
                if (typeof bottom === 'number') {
                    elev = bottom.toFixed(2);
                }
                if (typeof top === 'number') {
                    if (elev) { elev += ' to '; }
                    elev += top.toFixed(2);
                }
            }
            return elev;
        },
        merge: function(tokenizedStr, tokens) {
            // Looks for tokens like {ADDRESS} or {1} in tokenizedStr and merges
            // in the provided tokens.
            var s = tokenizedStr.trim(),
                token, key, i;
            for (i=0; i<tokens.length; i++) {
                token = tokens[i];
                if (isNaN(parseInt(i, 10))) {
                    //i is a string based key
                    key = i;
                } else {
                    //i is an index. Use a 1-based index.
                    key = i + 1;
                }

                s = s.replace('{' + key + '}', token);
            }

            return s;
        },
        concat: function() {
            var retVal = '', i;
            for(i=0; i<arguments.length; i++) {
                if (retVal) {
                    retVal += '-';
                }
                retVal += arguments[i];
            }
            return retVal;
        }
    };
}(Azavea));

/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\util\azavea.renderers.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-core.js ********************/
var PDP = {
    prefix: 'pdp-',
    Widget: {},
    Pdb: {},
    Nychanis: {}
};
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-core.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-data.js ********************/
(function(P) {
    P.Data = {
        // Override this for pages that live outside of the 
        // root path (for /admin/page.aspx, set it to '../')
        path: ''
    };

    // Helper to more easily call jQuery.ajax function.  Provides for parameterized
    // form method, handler url, data to include as query params and success/fail callbacks
    var _callHandler = function(type, url, data, callback, error) {       
        $.ajax({
            url: url,
            data: data,
            type: type,
            dataType: 'json',
            success: function(resp) {
                if (callback && typeof callback === 'function') {
                    callback(resp);
                }
            },
            error: function(resp, status, err) {
                if (error && typeof error === 'function') {
                    error(resp.responseText);
                } else {
                    Azavea.log(status);
                    Azavea.log(err);
                }
            }
        });
    };

    // Takes an associative array and convert it to a complete query string, including the "?"
    var _objectToQueryString = Azavea.tryCatch('convert object to querystring', function(obj){
        var qs = '?';
        var param;
        for(param in obj) {
            if (obj.hasOwnProperty(param) && (obj[param] || obj[param] === 0)) {
                qs += encodeURIComponent(param) + '=' + encodeURIComponent(obj[param]) + '&';
            }
        }        
        // Remove the trailing "&"
        return qs.substring(0,qs.length-1);
    });
    
    // Method that authenicates and logs a user in
    P.Data.login = Azavea.tryCatch('user login', function(username, password, callback, error) {
        var url = P.Data.path + 'handlers/login.ashx';
        var data = { username: username, password: password };
                
        _callHandler('POST', url, data, callback, error);
    });
    
    // Checks with the server to see if there is a currently authenticated user
    P.Data.checkLoginStatus = Azavea.tryCatch('user login', function(callback, error) {
        var url = P.Data.path + 'handlers/login.ashx';
        _callHandler('GET', url, {}, callback, error);
    });
    
    // Terminates the currently logged in users session
    P.Data.logout = Azavea.tryCatch('user login', function(callback, error) {
        var url = P.Data.path + 'handlers/logout.ashx';
        _callHandler('POST', url, {}, callback, error);
    });
    
    // Creates new random password for username and emails to address on file
    P.Data.resetPassword = Azavea.tryCatch('data reset password', function(username, callback, error) {
        var url = P.Data.path + 'handlers/reset-password.ashx';
        var data = { username: username };
        _callHandler('POST', url, data, callback, error);
    });

    // Create a new user and logs them in
    P.Data.createUser = Azavea.tryCatch('data create user', function(username, name, email, password, roles, callback, error) {
        var url = P.Data.path + 'handlers/users.ashx';
        var data = { username: username, name: name, email: email, password: password, roles: roles };
        _callHandler('POST', url, data, callback, error);
    });
    
    // Get details of single user
    P.Data.getUser = Azavea.tryCatch('data get user', function(username, callback, error) {
        var url = P.Data.path + 'handlers/users.ashx';
        var data = { username: username};
        _callHandler('GET', url, data, callback, error);
    });
    
    // Get details of all users
    P.Data.getUsers = Azavea.tryCatch('data get users', function(page, pageSize, sortBy, sortAsc, callback, error) {
        var url = P.Data.path + 'handlers/users.ashx';
        var data = {page: page, pageSize: pageSize, sortby: sortBy, sortasc: sortAsc };
        _callHandler('GET', url, data, callback, error);
    });
        
    // Update user details    
    P.Data.updateUser = Azavea.tryCatch('data create user', function(username, name, email, password, roles, callback, error) {
        var url = P.Data.path + 'handlers/users.ashx';
        var data = { username: username, name: name, email: email, password: password, roles: roles, _method: 'PUT' };
        _callHandler('POST', url, data, callback, error);
    });
    
    // Gets pdb search attributes
    P.Data.getAttributes = Azavea.tryCatch('data get attributes', function(callback, error) {
        var url = P.Data.path + 'handlers/attributes.ashx';
        _callHandler('GET', url, null, callback, error);
    });

    // Query properties database
    P.Data.getProperties = function(criteria, pagesize, page, orderby, orderasc, groupbys, callback, error) {
        // Encode the collections as JSON objects.
        if (criteria && typeof criteria === 'object') {
            criteria = JSON.stringify(criteria);
        }
        if (groupbys && typeof groupbys === 'object') {
            groupbys = JSON.stringify(groupbys);
        }

        var url = P.Data.path + 'handlers/properties.ashx';
        var data = { pagesize: pagesize, page:page, criteria: criteria, sortby: orderby, sortasc: orderasc, groupby:groupbys};
        _callHandler('GET', url, data, callback, error);
    };
    
    // Query properties database and initiate results as a CSV download
    P.Data.getPropertiesCsv = Azavea.tryCatch('get properties cvs', function(criteria, groupbys){
        // Encode the collections as JSON objects.
        if (criteria && typeof criteria === 'object') {
            criteria = JSON.stringify(criteria);
        }
        if (groupbys && typeof groupbys === 'object') {
            groupbys = JSON.stringify(groupbys);
        }
        var url = P.Data.path + 'handlers/properties.ashx';
        var data = { csv: true, pagesize: -1, page:-1, criteria: criteria, sortby: -1, sortasc: false, groupby:groupbys};
        
        window.location.href = url + _objectToQueryString(data);
    });
    
    // Initiate download for detailed property report
    P.Data.getPropertyReport = Azavea.tryCatch('get property report', function(propertyId){
        var url = P.Data.path + 'handlers/report-download.ashx';
        var data = { propertyId : propertyId };
        window.location.href = url + _objectToQueryString(data);
    });
    
    // Checks to see if a property report is available for download
    P.Data.checkPropertyReportExists = function(propertyId, callback, error) {
        var url = P.Data.path + 'handlers/report-download.ashx';
        var data = { propertyId : propertyId };
        _callHandler('POST', url, data, callback, error);
    };   
    
    // Queries for property location information within a bounding box
    P.Data.getPropertyLocations = function(criteria, minx, miny, maxx, maxy, minBoundsX, minBoundsY, maxBoundsX, maxBoundsY, callback, error) {
        // Encode the collections as JSON objects.
        if (criteria && typeof criteria === 'object') {
            criteria = JSON.stringify(criteria);
        }

        var url = P.Data.path + 'handlers/property-locations.ashx';
        var data = { criteria: criteria, minx:minx, miny:miny, maxx:maxx, maxy:maxy, minBx: minBoundsX, maxBx: maxBoundsX, minBy: minBoundsY, maxBy: maxBoundsY };
        _callHandler('GET', url, data, callback, error);
    };
    
    // Query property details for given list of property Ids
    P.Data.getPropertyDetails = function(ids, callback, error) {
        var url = P.Data.path + 'handlers/property-details.ashx';
        var data = { ids:ids };
        _callHandler('GET', url, data, callback, error);
    };

    //  Retreive Nychanis search metadata        
    P.Data.getNychanisMeta = Azavea.tryCatch('data get Nychanis metadata', function(callback, error) {
        var url = P.Data.path + 'handlers/nyc-meta.ashx';
        _callHandler('GET', url, null, callback, error);
    });

    // Query Nychanis database
    P.Data.getNychanis = Azavea.tryCatch('data get Nychanis', function(pagesize, page, orderby, orderasc,
            indicator, resolution, timetype, minyear, maxyear, scope, subscope, callback, error) {
        var url = P.Data.path + 'handlers/nychanis.ashx';
        var data = { pagesize: pagesize, page: page, sortby: orderby, sortasc: orderasc, indicator: indicator,
            resolution: resolution, timetype: timetype, minyear: minyear, maxyear: maxyear, 
            borough: scope, subborough: subscope };
        _callHandler('GET', url, data, callback, error);
    });
    
    // Query Nychanis database and initiate results as a CSV download
    P.Data.getNychanisCsv = Azavea.tryCatch('data get Nychanis csv', function(indicator, resolution, timetype, minyear, maxyear, scope, subscope) {
        var url = P.Data.path + 'handlers/nychanis.ashx';
        var data = { csv: true, pagesize: -1, page: -1, sortby: -1, sortasc: false, indicator: indicator,
            resolution: resolution, timetype: timetype, minyear: minyear, maxyear: maxyear, 
            borough: scope, subborough: subscope };
            
        window.location.href = url + _objectToQueryString(data);
    });
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-data.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-util.js ********************/
(function (P) {
    var _renderArray = Azavea.tryCatch('render an array', function(array, renderer) {
        var content;
        if (array && array.length) {
            content = '<ul class="pdp-rendered-list">';
            $.each(array, function(i, val) {
                content += '<li>' + renderer(val) + '</li>';
            });
            content += '</ul>';
        }
        
        return content;
    });
    
    P.StringBuffer = function() { 
           this.buffer = []; 
         }; 

         P.StringBuffer.prototype.append = function append(string) { 
           this.buffer.push(string);  
         }; 

         P.StringBuffer.prototype.toString = function toString() { 
           return this.buffer.join(""); 
    }; 
    
    P.Util = {
        prefix: Azavea.tryCatch('add prefix', function(prefix, word) {
            if (prefix) {
                return prefix + word;
            } else {
                return word;
            }
        }),
        
        renderers: {
            integer: function(val) {
                if ($.isArray(val)) {
                    return _renderArray(val, P.Util.renderers.integer);
                } else {
                    if (val || val === 0) {
                        return parseInt(val, 10).superToString(0);
                    } else {
                        return '[No Value]';
                    }
                }
            },
            money: function(val) {
                if ($.isArray(val)) {
                    return _renderArray(val, Azavea.renderers.money);
                } else {
                    if (val || val === 0) {
                        return Azavea.renderers.money(parseFloat(val), true);
                    } else {
                        return '[No Value]';
                    }
                }
            },
            text: function(val) {
                if ($.isArray(val)) {
                    return _renderArray(val, P.Util.renderers.text);
                } else {
                    if (val && typeof(val) === 'string') {
                        return val.trim();
                    } else {
                        return '[No Value]';
                    }
                }
            },
            numericText: function(val){
                if ($.isArray(val)) {
                    return _renderArray(val, P.Util.renderers.numericText);
                } else {
                    if (val) {
                        return val.toString().trim();
                    } else {
                        return '[No Value]';
                    }
                }                
            },
            address: function(val) {
                return P.Util.renderers.text(val);
            },
            year: function(val) {
                return P.Util.renderers.numericText(val);
            },
            count: function(val){
                return P.Util.renderers.integer(val);
            },
            percent: function(val) {
                if ($.isArray(val)) {
                    return _renderArray(val, P.Util.renderers.percent);
                } else {
                    if (val || val === 0) {
                        return val.toFixed(2).toString() + '%';
                    } else {
                        return '[No Value]';
                    }
                } 
            },
            dollars: function(val){
                return P.Util.renderers.money(val);
            },
            ratio: function(val){
                if ($.isArray(val)) {
                    return _renderArray(val, P.Util.renderers.ratio);
                } else {
                    if (val || val === 0) {
                        return val.toFixed(2).toString();
                    } else {
                        return '[No Value]';
                    }
                } 
                
            },
            sliderTicks: function($slider, ticksArray) {
                var i, 
                    left,
                    len = ticksArray.length;
                    
                //Remove any current gaps
                $('.pdp-nychanis-slider-tick', $slider).remove();

                for(i=0; i<ticksArray.length; i++) {
                    if (ticksArray[i]) {
                        // Don't divide by 0!
                        if (len === 1){
                            left = 0;
                        }
                        else{
                            left = (i / (len-1)) * 100;
                        }
                    
                        //Give the gap a helpful tooltip
                        $('<div class="pdp-nychanis-slider-tick" title="'+ ticksArray[i] +'"></div>')
                            .css({
                                'left': left + '%'
                            })
                            .appendTo($slider);
                    }
                }
            }         
        },
        
        getAttrIndex: function(attrs, name) {
            var i;
            for (i=0; i<attrs.length; i++) {
                if (attrs[i].UID === name) {
                    return i;
                }
            }
        },
        
        alert: function(message, title) {
            $('<div>' + message + '</div>').dialog({
			    modal: true,
			    title: title,
			    buttons: {
				    Ok: function() {
					    $(this).dialog('close');
				    }
			    }
		    });
        },
        error: function(error) {
            PDP.Util.alert(error);
        },
        quickAlert: function(message, title) {
            var $qa = $('<div class="pdp-quickalert ui-widget-header ui-corner-bottom pdp-shadow-drop">' + message + '</div>')
                .appendTo('body');
            
            $qa.slideDown(function(){
                setTimeout(function() {
                    $qa.slideUp(function() {
                        $qa.remove();
                    });
                }, 2500);
            });
        },
        quickError: function(message) {
            PDP.Util.quickAlert(message);
        },
        // Check the current login status and broadcast it so we don't have mulitple checks from
        //  various widgets who need to know
        initLoginStatus: function(){
            // Check the login status
            P.Data.checkLoginStatus(function(user) {
                $(P).trigger('pdp-login-status-refresh', [user]);
            }, 
            function(){
                // On error, we assume we are NOT loged in, pass something falsey
                $(P).trigger('pdp-login-status-refresh', [false]);
            });
        },
        trackMetric: function(category, action, label, value){
            _gaq.push(['_trackEvent', category, action, label, value]);
        }
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-util.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-form.js ********************/
(function (P) {
    var pre = P.Util.prefix;

    P.Form = {
        validators: {
            required: {
                // Check there are 2 password values for required password fields
                password: function(field, dataObj, prefix) {
                    var sel = '#' + pre(prefix, field.id);
                    if($(sel).is(':visible')) {
                        // If password fields are visible, ensure that there are values
                        if(!$(sel).val()) {
                            $(sel + ', ' + sel + '-2').addClass( pre(prefix, 'input-invalid') );
                        }
                    }
                    return true;
                },
                // Check for a value in a required field
                _default: function(field, dataObj, prefix) {
                    var sel = '#' + pre(prefix, field.id);
                    if(!$(sel).val()) {
                        $(sel).addClass( pre(prefix, 'input-invalid') );
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            // Perform password validations.  Assumes 2 password fields named the same with a "-2" appended to one.
            password: function(field, dataObj, prefix) {
                var sel = '#' + pre(prefix, field.id);
                // If password fields are visible, make sure both inputs have same values.
                if($(sel).is(':visible')) {
                    var pw1 = $(sel).val(),
                        pw2 = $(sel + '-2').val();
                    if(pw1 !== pw2) {
                        $(sel + ', ' + sel + '-2').addClass( pre(prefix, 'input-invalid') );
                        P.Form.validationMsg += 'Passwords do not match.';
                        return false;
                    }
                }
                return true;
            },
            // Perform email field validation, including "@" and "." exist
            email: function(field, dataObj, prefix) {
                var sel = '#' + pre(prefix, field.id);
                
                if($(sel).is(':visible')) {
                    var email = $(sel).val();
                    if (email.indexOf('@') === -1 || email.indexOf('.') === -1){
                        $(sel).addClass( pre(prefix, 'input-invalid') );
                        P.Form.validationMsg += 'Email is not valid.';
                        return false;
                    }
                }
                return true;
            },
            // Ensure a field value is numeric
            number: function(field, dataObj, prefix) {
                var sel = '#' + pre(prefix, field.id);
            
                var value = $(sel).val();
                if (value) {
                    value = value.replace(/[$,]/g, '');
                }
                var numberRegex = /^\d*\.?\d*$/;
                // We are allowing for the number 0 to be valid
                if (value === null || !numberRegex.test(value)) {
                    $(sel).addClass( pre(prefix, 'input-invalid') );
                    P.Form.validationMsg += 'Not a valid number';
                    return false;
                }
                return true;
            },
            // Ensure the lower range is lower than the upper range value from the dataObj parameter
            rangeLower: function(field, dataObj, prefix) {
                var sel = '#' + pre(prefix, field.id);
            
                // Must be a number to be in a range
                if (P.Form.validators.number(field, dataObj, prefix)) {
                    var lowerVal = parseFloat($(sel).val());
                    // Check the field value is less than the upper value passed in 
                    if (lowerVal === null || lowerVal > dataObj.upper) {
                        $(sel).addClass( pre(prefix, 'input-invalid') );
                        P.Form.validationMsg += 'The lower range value is greater than the upper range value.';
                        return false;
                    }
                } 
                else {
                    return false;
                }
                return true;    
            },
            // Ensure the upper range is high than the lower range value from the dataObj parameter            
            rangeUpper: function(field, dataObj, prefix) {
                var sel = '#' + pre(prefix, field.id);
                
                // Must be a number to be in a range
                if (P.Form.validators.number(field, dataObj, prefix)) {
                    var upperVal = parseFloat($(sel).val());
                    // Check the field value is more than the lower value passed in 
                    if (upperVal === null || upperVal < dataObj.lower) {
                        $(sel).addClass( pre(prefix, 'input-invalid') );
                        P.Form.validationMsg += 'The upper range value is less than the lower range value.';
                        return false;
                    }
                }
                else {
                    return false;
                }
                return true;    
            },
            // Checks that a field value (number) is between upper/lower values passed in dataObj
            range: function(field, dataObj, prefix) {
                var sel = '#' + pre(prefix, field.id);
                
                // Must be a number to be in a range
                if (P.Form.validators.number(field, dataObj, prefix)) {
                    var val = parseFloat($(sel).val());
                    // Check there is a value and that it is above the min/max from the dataObj
                    if (val === null || val < dataObj.min || val > dataObj.max) {
                        $(sel).addClass( pre(prefix, 'input-invalid') );
                        P.Form.validationMsg += 'The value is not between [' + dataObj.min + '] and [' + dataObj.max + ']';
                        return false;
                    }
                    return true; 
                 }
                 return false;   
            }
        },
        // Perform validation checks on a list of fields, using extra information in the dataObj param
        validate: function(fields, dataObj, container, prefix) {
            P.Form.validationMsg = '';
            // Remove any invalid classes from the fields before validation
            $( '.' + pre(prefix, 'input-invalid'), container || '.pdp-form').removeClass( pre(prefix, 'input-invalid') );

            var valid = true, requiredValid = true;
            
            // Loop through the fields, checking each according to its type
            $.each(fields, function(i, field) {
                if(field.required) {
                    // If this field is required, check to see if there is a custom required validator.
                    var vFn = P.Form.validators.required[field.type || ''] || P.Form.validators.required._default;
                    if(!vFn(field, dataObj, prefix)) {
                        valid = false;
                        if(requiredValid) {
                            P.Form.validationMsg += 'Please enter all required fields.';
                            requiredValid = false;
                        }
                    }
                }
                // If the field passed required validation, validate it against it's content type
                if(valid && field.validator && P.Form.validators[field.validator]) {
                    valid = P.Form.validators[field.validator](field, dataObj, prefix) && valid;
                }
            });
            
            return valid;
        },
        // Sets up a warning message label for any required fields
        setupRequired: function(fields, $context) {
            $.each(fields, function(i, field) {
                if(field.required) {
                    $('label[for=' + field.id + ']', $context).append('<span class="pdp-form-required-label">Required</span>');
                }
            });
        }
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-form.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-panel-closer.js ********************/
(function(P) {
    P.Widget.PanelCloser = function(options) {
        var _self = {},
            _options = $.extend({
                bindTo: P
            }, options);

        
        // When the user finishes a click, check to see if the target (or parent chain) had
        //  a .pdp-closable-panel class.  If it does, the element with that class will close
        _self.init = Azavea.tryCatch('init app', function() {

            $(document).bind('mouseup', function(event){
                // An absurdly long list of classes that do not cause the panel closer to close
                if ($(event.target).closest('.pdp-closable-panel').length <= 0) {
                    if ($(event.target).closest('.pdp-closable-panel-button').length <= 0) {
                        if ($(event.target).closest('.ui-dialog').length <= 0) {
                            if ($(event.target).closest('.ui-autocomplete').length <= 0){
                                if ($(event.target).closest('.pdp-pdb-control-tooltip').length <= 0){
                                    // Hide any closable panels
                                    $('.pdp-closable-panel').hide();
                                    
                                    // Tell anyone that we did
                                    $(_options.bindTo).trigger('pdp-panel-close-event');
                                }
                            }
                        }
                    }
                }
            });
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-panel-closer.js ********************/

