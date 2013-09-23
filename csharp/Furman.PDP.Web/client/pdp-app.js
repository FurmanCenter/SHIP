
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


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-login.js ********************/
(function(P) {
    P.Widget.Login = function(options) {
var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P,
                fields: [
                    { id:'pdp-login-username', required:true },
                    { id:'pdp-login-password', required:true }
                ],
                adminUrl: 'admin/manage-users.aspx',
                logoutUrl: 'default.aspx',
                profileUrl: 'user/profile.aspx',
                appUrl: ''
            }, options),
                _$form;

        var _clearErrors = Azavea.tryCatch('clear form errors', function(){
            $('.input-invalid', _$form).removeClass('input-invalid');
            $('.pdp-form-messages', _$form).remove();
        });

        // Create the html form for log in and password reset and render it to the screen
        var _renderLoginForm = Azavea.tryCatch('create and render the login form', function() {
            var forgotPassword = '',
                $loginLink = '';
                
            // Set up the container with a fieldset and fields for logging in and reseting password
            _$form = $('<div class="pdp-header-panel pdp-login-panel pdp-closable-panel ui-corner-all pdp-shadow-drop"><h2>Log In</h2>' + 
                        '<div id="pdp-login-panel-close"><span class="ui-icon ui-icon-circle-close"></span></div>' +
                        '<fieldset class=""><ul>' + 
                            '<li><label for="pdp-login-username" class="pdp-form-label">Username:</label>' + 
                            '<div class="pdp-form-ctrl"><input id="pdp-login-username" type="text" class="pdp-input pdp-input-shorttext" tabindex="1" /></div></li>' +         
                            '<li><label for="pdp-login-password" class="pdp-form-label">Password:</label>' + 
                            '<div class="pdp-form-ctrl"><input id="pdp-login-password" type="password" class="pdp-input pdp-input-shorttext" tabindex="2" /></div></li>' + 
                            '<li><div class="pdp-form-buttons"><button id="pdp-login-button" class="pdp-button pdp-input-button-primary" tabindex="3">Log In</button>' + 
                            '<a href="javascript:void(0);" id="pdp-show-password-reset">Forgot Password?</a></div></li>' + 
                        '</ul></fieldset></div>');

            forgotPassword = '<fieldset class="pdp-password-reset-container">' + 
                            '<h2>Reset Password</h2>' + 
                            '<ul>' + 
                                '<li>' + 
                                    '<label for="pdp-reset-password-username" class="">Enter your username to reset your password:</label>' + 
                                    '<div class="pdp-form-ctrl">' + 
                                        '<input id="pdp-reset-password-username" type="text" class="pdp-input pdp-input-shorttext" tabindex="4" />' + 
                                    '</div>' + 
                                '</li>' + 
                            '</ul>' + 
                            '<div class="pdp-form-buttons">' + 
                                '<button id="pdp-reset-password-button" value="Reset Password" class="pdp-button pdp-input-button-primary" tabindex="5">Reset Password</button>' + 
                            '</div>' + 
                        '</fieldset>';
                        
            // Assemble the form, make it invisible.
            _$form.append(forgotPassword).hide();
            $('.pdp-password-reset-container', _$form).hide();
            
            // Enable form submission by hitting "enter" (keycode = 13) in login or reset forms
            $('#pdp-login-password', _$form).keyup(function(event){
                if (event.which === 13){
                    $('#pdp-login-button').click();
                }
            });
            $('#pdp-reset-password-username', _$form).keyup(function(event){
                if (event.which === 13){
                    $('#pdp-reset-password-button').click();
                }
            });
            
            // Close the panel on clicking the X
            $('#pdp-login-panel-close', _$form).click(function(event){
                _$form.hide();
            });
            
            // Make forgot password show/hide
            $('#pdp-show-password-reset', _$form).click(function(event) {
                _clearErrors();
                $('.pdp-password-reset-container').toggle();
            });
            
            // Create the login link that will appear on the header, add it to the target
            $loginLink = $('<a href="javascript:void(0);" class="pdp-link pdp-header-link">Login</a>');
            $loginLink.click(function(event) {
                if (_$form.is(':visible')) {
                    _$form.hide();  
                } else {
                    _$form.show();
                    _clearErrors();
                    // Focus first input
                    $('.pdp-input:first', '.pdp-login-panel').focus();
                }
            });
            
            // Add the whole widget to the page target
            $(_options.target).empty().append($loginLink, _$form);    
        });
        

        // Display our login information on the widget, with profile, admin and logout links.
        var _displayLoginInfo = Azavea.tryCatch('display login info', function(user){
            var profile='',
                admin = '',
                $logout = {};
                
            // Hide our form, link
            $('pdp-login-panel').remove();
            $('pdp-login-link').remove();
            
            // Show our user name and a logout option
            profile = 'Welcome,<a href="' + decodeURI(_options.appUrl + _options.profileUrl) + '" class="pdp-link pdp-header-link">' + user.Name + '</a>';
            
            // If the user has roles, then it is a sysadmin, we can show the admin link
            if (user.Admin) {
                admin = '<a href="' + decodeURI(_options.appUrl +  _options.adminUrl) + '" class="pdp-link pdp-header-link">User Administration</a>';
            }
            
            // Setup a log out link that logs out and redirects to a safe page
            $logout = $('<a href="javascript:void(0);" class="pdp-link pdp-header-link">Logout</a>');
            $logout.click(function(event) {
                P.Data.logout(function() {
                    // A successful log-out procedure, now simply re-direct
                    window.location.href = decodeURIComponent(_options.logoutUrl);
                });
            });
            $(_options.target).empty().append(profile, admin, $logout);
        });
        
        // Setup actions on our form.
        var _initLogin = Azavea.tryCatch('init login', function() {
            // Submit our login data on the button click
            $('#pdp-login-button').button().click(function() {
                if(!$(this).hasClass('pdp-input-button-disabled')) {
                    $('.pdp-form-messages').remove();
                    $(this).addClass('pdp-input-button-disabled').val('Checking login...');
                    if(P.Form.validate(_options.fields, {}, _options.target)) {
                        var username = $('#pdp-login-username').val(),
                            password = $('#pdp-login-password').val();
                        P.Data.login(username, password, function(user) {
                            // Reload the page so the user gets any new attributes loaded.
                            //  If we decided we don't want a page refresh, take this line out
                            //  and figure out how to get the new criteria search controls in the
                            //  search and the results column selector
                            location.reload(true);
                            
                            // Annouce we have logged in, people might show/hide themselves
                            $(_options.bindTo).trigger('pdp-login-success', [user]);
                            
                            // Show our user info links
                            _displayLoginInfo(user);
                        }, function(respText) {
                            _displayErrorMsg(respText);
                        });
                    } else {
                        _displayErrorMsg(P.Form.validationMsg);
                        $('.pdp-input-invalid:first', '.pdp-login-panel').focus();
                    }
                }
            });
        });
        
        // Setup actions for our password reset form
        var _initResetPassword = Azavea.tryCatch('initialize password reset', function(){
            // Bind a click event to the button target
            $('#pdp-reset-password-button').button().click(function(){
                $('.pdp-form-messages').remove();
                if(P.Form.validate([{ id:'pdp-reset-password-username', required:true }], {}, _options.target)) {
                    var username = $('#pdp-reset-password-username').val();
                    P.Data.resetPassword(username, function(respText){
                        _displayInfoMsg(respText);
                    }, function(respText) {
                        _displayErrorMsg(respText);
                    }); 
                }else {
                    _displayErrorMsg(P.Form.validationMsg);
                    $('.pdp-input-invalid:first', '.pdp-login-panel').focus();
                }
              });
        });
        
        var _displayMsg = Azavea.tryCatch('display error message', function(msg, className) {
            $('<div class="pdp-form-messages ' + className + '">' + msg + '</div>').appendTo('.pdp-login-panel');
            $('#pdp-login-button').removeClass('pdp-input-button-disabled').val('Log In');
        });
        
        var _displayErrorMsg = Azavea.tryCatch('display error message', function(msg) {
            _displayMsg(msg, 'ui-state-error');
        });
        
        var _displayInfoMsg = Azavea.tryCatch('display error message', function(msg) {
            _displayMsg(msg, '');
        });
        
        // Refresh current login details
        var _initLoginPanel = Azavea.tryCatch('refresh login panel', function(event, user) {
                if (user) {
                    // We are logged in
                    _displayLoginInfo(user);
                } else {
                    // We are not logged in
                    _renderLoginForm();
                    _initLogin();
                    _initResetPassword();
                }              
        });
               
        // Initialization routine    
        _self.init = Azavea.tryCatch('init widget login', function() {
             
            // Bind to the page boss to recieve information on login status.
            // We don't do anything until we have this information.
            $(_options.bindTo).bind('pdp-login-status-refresh', _initLoginPanel);

            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-login.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-signup.js ********************/
(function(P) {
    P.Widget.Signup = function(options) {
            var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P,
                fields: [
                    { id:'pdp-signup-username', required:true },
                    { id:'pdp-signup-name', required:true },
                    { id:'pdp-signup-email', required:true, validator:'email' },
                    { id:'pdp-signup-password', required:true, validator:'password' },
                    { id:'pdp-signup-password-2', required:true }
                ],
                signupTarget:'pdp-header-signup',
                landingUrl: 'default.aspx'
            }, options),
            _$form;

        var _clearErrors = Azavea.tryCatch('clear form errors', function(){
            $('.input-invalid', _$form).removeClass('input-invalid');
            $('.pdp-form-messages', _$form).remove();
        });
        
        // Create the html form for log in and password reset and render it to the screen
        var _renderSignupForm = Azavea.tryCatch('create and render the signup form', function() {

            // Generate the markup for the form, and have it hidden
            var _$form = $(_generateFormMarkup()).hide();
                        
            // Enable form submission by hitting "enter" (keycode = 13) in signup form
            $('#pdp-signup-password-2', _$form).keyup(function(event){
                if (event.which === 13){
                    $('#pdp-signup-button').click();
                }
            });
            
            // Close the panel on clicking the X
            $('#pdp-signup-panel-close',_$form).click(function(event){
                _$form.hide();
            });
            
            // Create the signup link that will appear on the header, give it hide/show
            var $signUpLink = $('<a href="javascript:void(0);" class="pdp-link pdp-signup-link">Sign Up</a>');
            $signUpLink.click(function(event) {
                if (_$form.is(':visible')) {
                    _$form.hide();  
                } else {
                    // If I show, hide any other header menu panels
                    $('.pdp-header-panel').hide();
                    _$form.show();
                    _clearErrors();
                    $('#pdp-signup-username', '.pdp-signup-panel').focus();
                }
            });
            
            // Add the whole widget to the page target
            $(_options.target).empty().append($signUpLink, _$form);    
        });
       
        // Setup actions on our form.
        var _initSignup = Azavea.tryCatch('init signup', function() {
            /* NO TOS FOR NOW
            //Bind or TOS link
            $('#pdp-signup-terms-display').click(function(){
                // Dialog the TOS
                $('<iframe id="tos" class="" src="http://furmancenter.org/" />').dialog({
                            title: 'Terms of Service',
                            autoResize: true,
                            autoOpen: true,
                            height: 400,
                            width: 500,
                            modal: true,
		                    buttons: {
			                    Ok: function() {
				                    $(this).dialog('close');
			                    }
			                }
		                });
            });
            */
            
            // Submit our signup data on the button click
            $('#pdp-signup-button').button().click(function() {
                if(!$(this).hasClass('pdp-input-button-disabled')) {
                    $('.pdp-form-messages').remove();
                    $(this).addClass('pdp-input-button-disabled').val('Creating User...');
                    
                    // Try validating the user input
                    if(P.Form.validate(_options.fields, {}, '.pdp-signup-panel')) {
                        var username = $('#pdp-signup-username').val(),
                            password = $('#pdp-signup-password').val(),
                            name = $('#pdp-signup-name').val(),
                            email = $('#pdp-signup-email').val();
                            roles = '';
                        
                        P.Data.createUser(username, name, email, password, roles, function() {
                            //Redirect to the default page
                            P.Data.login(username, password, function(user) {
                                $(_options.bindTo).trigger('pdp-login-success', [user]);
                                $(_options.bindTo).trigger('pdp-login-status-refresh', [user]);
                            }, function() {
                                window.location.href = _options.landingUrl;
                            });
                        }, function(respText) {
                            _displayErrorMsg(respText);
                        });
                    } else {
                        _displayErrorMsg(P.Form.validationMsg);
                        $('.pdp-input-invalid:first', '.pdp-signup-panel').focus();
                    }

                }
            });
        });
        
        // Generate the html form markup
        var _generateFormMarkup = Azavea.tryCatch('generate signup form markup', function(){
            var html =  '<div class="pdp-header-panel pdp-signup-panel ui-corner-all pdp-closable-panel pdp-shadow-drop">' + 
                        '<div id="pdp-signup-panel-close"><span class="ui-icon ui-icon-circle-close"></span></div>' +
                        '<h2 class="pdp-header-panel-title">Sign Up</h2>' +
                        '<fieldset class="">' +
                            '<ul class="pdp-form-list">' +
                                '<li>' +
                                    '<label for="pdp-signup-username" class="pdp-form-label">User Name:</label>' +
                                    '<div class="pdp-form-ctrl">' +
                                        '<input id="pdp-signup-username" type="text" class="pdp-input-shorttext" tabindex="1" />' +
                                    '</div>' +
                                '</li>' +
                                '<li>' +
                                    '<label for="pdp-signup-name" class="pdp-form-label">Name:</label>' +
                                    '<div class="pdp-form-ctrl">' +
                                        '<input id="pdp-signup-name" type="text" class="pdp-input-shorttext" tabindex="2" />' +
                                    '</div>' +
                                '</li>' +
                                '<li>' +
                                    '<label for="pdp-signup-email" class="pdp-form-label">Email:</label>' +
                                    '<div class="pdp-form-ctrl">' +
                                        '<input id="pdp-signup-email" type="text" class="pdp-input-shorttext" tabindex="3" />' +
                                    '</div>' +
                                '</li>' +
                            '</ul>' +
                            '<ul class="pdp-form-list">' +
                                '<li>' +
                                    '<label for="pdp-signup-password" class="pdp-form-label">Password:</label>' +
                                    '<div class="pdp-form-ctrl">' +
                                        '<input id="pdp-signup-password" type="password" class="pdp-input-shorttext" tabindex="4" />' +
                                    '</div>' +
                                '</li>' +
                                '<li>' +
                                    '<label for="pdp-signup-password-2" class="pdp-form-label">Confirm Password:</label>' +
                                    '<div class="pdp-form-ctrl">' +
                                        '<input id="pdp-signup-password-2" type="password" class="pdp-input-shorttext" tabindex="5" />' +
                                    '</div>' +
                                '</li>' +
                                /*'<li>' +
                                    '<div class="pdp-form-ctrl">' +
                                        '<input id="pdp-signup-terms" type="checkbox" class="pdp-input pdp-input-checkbox" tabindex="6" />' +
                                        '<label class="pdp-form-label">I Agree to the <a id="pdp-signup-terms-display" href="javascript:void(0);">Terms of Service</a></label>' +
                                    '</div>' +
                                '</li>' +*/
                            '</ul>' +
                            '<div class="pdp-form-buttons">' +
                                '<button id="pdp-signup-button" class="pdp-button" tabindex="7">Sign Up</button>' +
                            '</div>' +
                        '</fieldset>' + 
                        '<div class="pdp-header-panel-desc">* Signing up allows you to view and filter by extra property characteristics in SHIP (Subsidized Housing Information Project).  This special access is granted to agency partners and others who have made arrangements with the Furman Center.</div>' +                                                 
                        '</div>';
                        
            return html;
        });
              
        var _displayErrorMsg = Azavea.tryCatch('display error message', function(msg) {
            $('<div class="pdp-form-messages ui-state-error">' + msg + '</div>').appendTo('.pdp-signup-panel');
            $('#pdp-signup-button').removeClass('pdp-input-button-disabled').val('Sign Up');
        });
        
        // Initialization routine    
        _self.init = Azavea.tryCatch('init widget signup', function() {
            
            // Bind to the page boss to recieve information on login status.
            // We don't do anything until we have this information.
            $(_options.bindTo).bind('pdp-login-status-refresh', function(event, user){
                if (!user) {
                    // We are not logged in, make thyself
                    _renderSignupForm();
                    _initSignup();
                    $(_options.target).show();
                    
                }
            });
            
            // We want to hide ourselves on a successful login
            $(_options.bindTo).bind('pdp-login-success', function(){
                $(_options.target).hide();
            });
            
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-signup.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-column-selector.js ********************/
(function(P) {
    P.Widget.ColumnSelector = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P
            }, options),
            _eventObj = P,
            _curTableAttrs = {},
            _colVisCache = {},
            _$button;
        
        // Trigger the event for column visibility
        var _triggerVisibilityEvent = Azavea.tryCatch('trigger visibility event', function(idx){
                var cols = _getColVisibilityArray();
                $(_options.bindTo).trigger('pdb-column-visibility', [cols, idx]);                        
        });
        
        // Takes a structured Attrs list and makes a panel out of it
        var _renderAttributePanel = Azavea.tryCatch('render select columns panel', function(data) {
            var _renderAttrs = Azavea.tryCatch('render pdb counts attrs', function(data, $target) {
                $.each(data, function(i, obj) {
                    if (obj.Attrs) {
                        //This is a cat description
                        var $cat = $('<li rel="' + obj.Order + '"><div class="pdb-column-select-category"><label class="pdb-column-select-category-label">'+obj.Name+'</label></div>' + 
                            '<ul class="pdp-column-select-category"></ul></li>').appendTo($target);

                        var prevNumber = parseInt(obj.Order, 10) - 1;
                        var $previousOrderedElement = $target.children('li[rel="' + prevNumber.toString() + '"]');
                        if ($previousOrderedElement.length){
                            // Insert this on the DOM after the found element
                            $cat.insertAfter($previousOrderedElement);                         
                        } else {
                             // Nothing to order with, just append to the end
                            $cat.appendTo($target);  
                        }
                        
                        // Render top level controls
                        _renderAttrs(obj.Attrs, $cat.children('ul.pdp-column-select-category'));
                        
                        // Render sub cats
                        if (obj.SubCats && obj.SubCats.length) {
                            _renderAttrs(obj.SubCats, $('ul.pdp-column-select-category', $cat));
                        }
                        
                    } else {
                        // Handle the attributes, if there is no Category or Name, we don't want the choice
                        if(obj.Category && obj.Name){
                            // This is a criteria attribute
                            $('<li rel="' + obj.CategoryOrder + '"><input type="checkbox" id="col-sel-'+obj.UID+'" /><label for="col-sel-'+obj.UID+'" class="pdp-pdb-column-label">'+obj.QueryName+'</label></li>').appendTo($target);
                        }
                    }    
                });
            });
            
            $('<div id="pdp-column-select-panel" class="pdp-closable-panel pdp-shadow-drop">' + 
                '<div id="pdp-column-select-panel-content">' + 
                    '<a id="pdp-col-select-all" class="pdp-link" href="javascript:void(0);">Select All</a><a id="pdp-col-select-none" class="pdp-link" href="javascript:void(0);">Select None</a>' + 
                    '<div id="pdp-column-select-panel-close"><span class="ui-icon ui-icon-circle-close"></span></div>' +
                    '<ul id="pdp-column-select-panel-cols"></ul>' + 
                '</div>' + 
            '</div>').appendTo(_options.target).hide();
            
            _renderAttrs(data, $('#pdp-column-select-panel-cols'));
            
            //Remove empty categories
            $('ul.pdp-column-category:empty').parent().remove();
        });
        
        // Show/hide the column list panel
        var _showColumnList = Azavea.tryCatch('show column list', function(attrResp) {
            var $panel = $('#pdp-column-select-panel');
            
            // Display panel
            $panel.toggle();
            
            // Toggle the button state
            $(this).toggleClass('pdp-column-selector-active');

            if (!$panel.attr('visible')){
                
                // Set the checkbox for those who's columns are currently not/displayed
                $.each(_colVisCache, function(i, col) {
                    $('#col-sel-' + col.UID, $panel).attr('checked', col.visible);
                });            
            }
        });
        
        // Set all columns visibility to the value supplied
        var _setAllColumnVisibility = Azavea.tryCatch('set all column visibility', function(val, $panel){
             // Check/uncheck the actual inputs
            $('input:checkbox', $panel).attr('checked', val);
                                            
            // Update cache values
            $.each(_colVisCache, function(i, col){
                col.visible = val;
            });
            
            // Trigger event
            _triggerVisibilityEvent();
        });
        
        // Compute the index of the id in our cache
        var _getColumnIndex = Azavea.tryCatch('get column index', function(id){
            var i, idx = -1;
            // Loop through our cache and count the index value until we found our id
            for (i in _colVisCache){
                if (_colVisCache.hasOwnProperty(i, false)){
                    idx++;
                    if (i === id){
                        return idx;
                    }
                }
            }
            return false;
        });
               
        // Show the list of colums
        var _createColumnPanel = Azavea.tryCatch('create column panel', function(event, attrResp) {
            var $panel = {};

            // Remove any panel that's currently there
            $(_options.target).empty();
            
            // Create the button, and give it something to do onclick
            _$button = $('<button class="pdp-column-selector pdp-closable-panel-button">Choose Columns</button>');
            _$button
                .click(_showColumnList)
                .hide()
                .button();
            
            // Add it to the page
            $(_options.target).append(_$button);
            
            // Render our panel to the screen
            _renderAttributePanel(attrResp.List);                

            $panel = $('#pdp-column-select-panel');
            
            // Close the panel on clicking the X
            $('#pdp-column-select-panel-close').click(function(event){
                $panel.hide();
            });
            
            // Select all + none
            $('#pdp-col-select-all').click(function(event){
                _setAllColumnVisibility(true, $panel);
            });
            $('#pdp-col-select-none').click(function(event){
                _setAllColumnVisibility(false, $panel);
            });
                        
            // Raise a trigger when the columns checkboxs are changed
            $('input:checkbox', $panel).change(function(event){
                
                // Update my cache status
                _colVisCache[this.id].visible = $(this).attr('checked');
                
                // Trigger an event to alert anyone who wants to know the latest cache
                //  and the individual column index that was changed
                
                _triggerVisibilityEvent(_getColumnIndex(this.id));
            });
     
        });    
        
        // We need to store more information in our cache than the table widget needs since we match up
        //  Attributes to Categories, checkboxes and colIndexes.  This translates that cache to a simple 
        //  array for the table widget to consume
        var _getColVisibilityArray = Azavea.tryCatch('get column visibility array', function(){
            var cols = [];
            
            // Grab our vis values from the cache, if they have a name
            $.each(_curTableAttrs.Attrs, function(i, attr){
                if (attr.Name){
                    cols.push(_colVisCache['col-sel-' + attr.UID].visible);
                }
                else {
                    cols.push(false);
                }
            }); 
            return cols;
        });
        
        // When a new data response occurs, we need to grab that to construct our visibility cache
        var _handleNewDataResponse = Azavea.tryCatch('col-sel handle new data response', function(event, newTableAttrs){
            
            if (!_$button){
                return;
            }
            
            
            // Do not show if this was a groupby query
            if (newTableAttrs.GroupByQuery){
                _$button.hide();    
            } else {
                _$button.show();    
            }
            
            // Check if this has the same colums as we had before
            var gotSameCols = Azavea.superEquals(_curTableAttrs.Attrs, newTableAttrs.Attrs);
            
            _curTableAttrs = newTableAttrs;
            
            // If we have different columns, update our cache - if not, they remain the same across
            //  different data requests.
            if (!gotSameCols) {
                
                // Loop through our cache, and update our index,viz for each column/attr
                $.each(_curTableAttrs.Attrs, function (i, attr){
                        _colVisCache['col-sel-' + attr.UID] = { colIndex : i, 
                                                   visible : attr.OnByDefault, 
                                                   UID : attr.UID };
                });
            }
        });
                    
        _self.init = Azavea.tryCatch('init app', function() {
            // Bind, so we know what the current Attribute Table Headers are
            $(_options.bindTo).bind('pdp-data-response', _handleNewDataResponse);
            
            // Bind, so we know what the current structured attribute list is
            $(_options.bindTo).bind('pdp-pdb-attributes', _createColumnPanel);
            
            $(_options.bindTo).bind('pdp-criteria-reset', function() {
                if (_$button){
                    _$button.hide();
                }
            });

            return _self;
        });
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-column-selector.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-pdb-controls.js ********************/
(function (P) {
    var _triggerPropertyCriteriaChange = Azavea.tryCatch('trigger property criteria change', function(critArray) {
        $(P.Widget.PdbControls.bindTo).trigger('pdp-pdb-control-change', [ critArray ]);
    });
    
    var _bindReset = Azavea.tryCatch('resetting a control widget', function(callback) {
        $(P.Widget.PdbControls.bindTo).bind('pdp-criteria-reset', function(event) {
            if (callback) {
                callback();
            }
        });
    });

    // All controls will be in identical containers, which are created here
    var _makeContainer = Azavea.tryCatch('creating control container', function(id, name, desc) {
        return $('<div class="pdp-pdb-control"><div class="pdp-pdb-control-label ui-state-default"><label class="">' + name + '</label><span class="pdp-pdb-control-label-help ui-icon ui-icon-help" title="'+desc+'"></span></div></div>'); //add a help icon here-ish
    });
    
    //<summary>
    //A basic string comparer for sorting an array of objects which have Value property
    //</summary>
    var _compareValues = Azavea.tryCatch('sort: compare dropdown values', function(a, b) {
        var valA = a.Value.toLowerCase( );
        var valB = b.Value.toLowerCase( );
        if (valA < valB) {return -1;}
        if (valA > valB) {return 1;}
        return 0;
    });
    //<summary>
    //A basic string comparer for sorting an array of objects which might have a Group property
    //</summary>    
    var _compareGroups = Azavea.tryCatch('sort: compare group dropdown values', function(a, b) {
        var valA, valB;
        
        if (a.Group) {
            valA = a.Group.toLowerCase( );
        } else {
            return 0;
        }
        if (b.Group) {
            valB = b.Group.toLowerCase( );
        } else {
            return 0;
        }
        
        if (valA < valB) {return -1;}
        if (valA > valB) {return 1;}
        return 0;
    });
                
    P.Widget.PdbControls = {
        bindTo: P.Pdb,
        
        dropdown: Azavea.tryCatch('creating dropdown control', function($target, attr) {
            var $container = _makeContainer(attr.UID, attr.QueryName || attr.Name, attr.Desc),
                _critList = [], //dropdowns can have multiple values, so we need to track them
                optionList = '';
                
            // Dropdowns don't really need validation. Either it is selected or it is not.
            // Build our select element
            var $select = $('<select id="' + attr.UID + '"></select>');
            
            // Handle dropdown selection changes
            var _onChange = Azavea.tryCatch('dropdown control change', function(event) {
                var val = this.value;
                
                if (val) {
                    
                    // Hide this entry from the dropdown if possible.  Some browsers don't support
                    //  display:none on options, so we disable it also.  Some don't support disabled options
                    //  so we also check to make sure it's not already on the critList
                    if ($.inArray(val, _critList) !== -1){
                        //Reset the selection
                        $select.val('');
                        return;
                    }
                    
                    // Bug fix right before production, so I am leaving the original code.  This appears to 
                    // cause an error when there is an apostrophe in the value of a dropdown.  Instead I 
                    // am selecting the options by :selectd
                    //$('option[value="' + val + '"]', $select).attr('disabled', 'disabled').hide();
                    var selectedOption = $('option:selected', $(this)).attr('disabled', 'disabled').hide();
                    
                    // if i have a value, then update my container to active
                    $container.addClass('pdp-pdb-control-active');
                    
                    // Make a span with this value
                    var $crit = $('<div class="pdp-selected-criteria"><span class="ui-icon ui-icon-close left" title="Remove this filter"></span><label title="' + val + '">' + val + '</label></div>')
                        .insertBefore(this);
                    
                    _critList.push(val);
                    
                    //Bind event to remove a selection
                    $('.ui-icon', $crit).click(function(event) {                       
                        var curVal = $('label', $crit).text();
                        
                        $.each(_critList, function(i, val) {
                            if (val === curVal) {
                                _critList.splice(i, 1);
                                
                                //break loop
                                return false;
                            }
                        });
                        
                        // NOTE: Same as above - production release tomorrow, so leaving the orig code - sorry.
                        //Show this in the dropdown again
                        //$('option[value="' + curVal + '"]', $select).removeAttr('disabled').show();
                        selectedOption.removeAttr('disabled').show();
                        
                        //Remove list item
                        $crit.remove(); 
                        
                        _triggerPropertyCriteriaChange( [ { attr:$select.attr('id'), oper:'eq', val:_critList } ]);

                        // If there are no more children, remove the active class
                        if ($('.pdp-selected-criteria', $container).length === 0){
                            $container.removeClass('pdp-pdb-control-active');
                            
                        }
                    });
 
                    //Reset the selection
                    $select.val('');

                    // trigger an event for someone to handle
                    _triggerPropertyCriteriaChange( [ { attr:this.id, oper:'eq', val:_critList } ]);
                } else {
                    // If there are no more children, remove the active class
                    if ($('.pdp-selected-criteria', $container).length === 0){
                        $container.removeClass('pdp-pdb-control-active');
                    }
                }
                
            });
            
            var _getSelectOptions = Azavea.tryCatch('get select options', function(attr){
                var options = '<option value="">- - All - -</option>',
                    group = {}, groups=[], g;
            
                // Sort our option
                attr.Values.sort(_compareValues);
                //attr.Values.sort(_compareGroups);

                $.each (attr.Values, function(i, val) {
                    if (val.Group){
                        if (group[val.Group]){
                            // Add this value to this grouping
                            group[val.Group].push(val.Value);
                        } else {
                            group[val.Group] = [val.Value];
                            groups.push(val.Group);
                        }
                    } else {
                        // Just add stright to the option list
                        options += '<option value="' + val.Value + '">' + val.Value + '</option>';
                    }
                });    
                
                // If we have groups, add options accordingly
                if (groups.length){
                    groups.sort();
                    $.each(groups, function(idx, groupName){
                        
                        options += '<optgroup label="' + groupName + '">';
                        var i;
                        for (i=0; i < group[groupName].length; i++){
                            // Add this under the category
                            options += '<option value="' + group[groupName][i] + '">' + group[groupName][i] + '</option>';
                        }
                        options += '</optgroup>';
                    
                    });
                }   
                
                return options;
            });
            
            // Add our options
            var optionsList = _getSelectOptions(attr);
            
            // Add the options to our select, and bind a function to the change event
            $select.append(optionsList).change(_onChange);
                
            // Add the completed control to a control container and then to the page target
            $container
                .append($select)
                .appendTo($target);
            
            _bindReset(function() {
                // Only reset the control if there are values, to prevent needless trigger calls
                if ($('.ui-icon', $container).length > 0) {
                    $('.ui-icon', $container).click();
                    $select.val('').change();
                }
            });
        }),
        autocomplete: Azavea.tryCatch('', function($target, attr) {
            var $container = _makeContainer(attr.UID, attr.QueryName || attr.Name, attr.Desc),
                valuesArray = [],
                selection = false,
                critAdded = false,
                _critList = []; //autocompletes can have multiple values, so we need to track them

            
            // Build our select element
            var $input = $('<input id="' + attr.UID + '" class="pdp-input pdp-control-autocomplete" type="text" />');            
            
            // Validation: matches a value to an item in the list
            $.expr[':'].textEquals = function (a, i, m) {
                return $(a).text().match("^" + m[3] + "$");
            };

            // Handle the case of selecting an item from the autocomplete, which re-adds the text
            // to the input - which we want cleared after a criteria has been added
            var _onClose = Azavea.tryCatch('autocomplete control close', function(event, ui) {
                if (critAdded){
                    $input.val('');
                    critAdded = false;
                }
            });
            
            // Handle autocomplete selection changes, if they click on a autocomplete suggestion
            var _onSelect = Azavea.tryCatch('autocomplete control select', function(event, ui) {
                // This was a selection
                selection = true;
                
                // Remove any validation markup
                $input.removeClass('input-invalid');
                                        
                // Use the selection as the new value
                _valueChanged(ui.item.value);
                
            });
            
            // Handle autocomplete value changes, if it was typed manually in
            var _onChange = Azavea.tryCatch('autocomplete control change', function(event, ui) {
                // Remove any validation markup
                $input.removeClass('input-invalid');
                                
                // If the selection event did not already take care of this, ie. this value was 
                // only typed in and then lost focus.
                if (!selection) {
                    // If the value of the textbox does not match a suggestion, clear its value
                    if ($(".ui-autocomplete li:textEquals('" + $input.val() + "')").size() === 0 && ($input.val() || $input.val() === 0)) {
                        $input.addClass('input-invalid');
                    }
                    
                    // Use the value of the input as the new value
                    _valueChanged(this.value);
                }
                
                // Clear selection state
                selection = false;
            });
            
            // When the value is changed either by selecting a suggestion or 
            // typing a valid item into the input
            var _valueChanged = Azavea.tryCatch('control value changed', function(val) {
                // The value of the input, whether typed or selected - could have changed to nothing
                if (val && !$input.hasClass('input-invalid')) {
                    // if i have a value, then update my container to active
                    $container.addClass('pdp-pdb-control-active');
                    
                   // Make a span with this value
                    var $crit = $('<div class="pdp-selected-criteria"><span title="Remove this filter" class="ui-icon ui-icon-close left"></span><label title="' + val + '">' + val + '</label></div>')
                        .insertBefore($input);
                    
                    _critList.push(val);
                    
                    //Bind event to remove a selection
                    $('.ui-icon', $crit).click(function(event) {                       
                        var curVal = $('label', $crit).text();
                        
                        $.each(_critList, function(i, val) {
                            if (val === curVal) {
                                _critList.splice(i, 1);
                                
                                //break loop
                                return false;
                            }
                        });
                        
                        //Show this in the dropdown again
                        //$('option[value="' + curVal + '"]', $select).show();
                        
                        //Remove list item
                        $crit.remove(); 
                        
                        _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper:'eq', val:_critList } ]);

                        // If there are no more children, remove the active class
                        if ($('.pdp-selected-criteria', $container).length === 0){
                            $container.removeClass('pdp-pdb-control-active');
                        }
                    }); 
                    
                    // Hide this entry from the dropdown
                    //$('option[value="' + val + '"]', $select).hide();
                    
                    //Reset the selection
                    $input.val('');
                    critAdded = true;
                    
                    // trigger an event for someone to handle
                    _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper:'eq', val:_critList } ]);
                                       
                                        
                } else {
                    // If there are no more children, remove the active class
                    if ($('.pdp-selected-criteria', $container).length === 0){
                        $container.removeClass('pdp-pdb-control-active');
                    }
                        
                    // Remove the previous value
                    val='';
                }

                // trigger an event for someone to handle
                //_triggerPropertyCriteriaChange( [ { attr:attr.UID, oper:'eq', val:val } ]);
            });
                        
            // Build our autocomplete value list
            $.each(attr.Values, function(i, valObj) {
                valuesArray.push(valObj.Value);
            });
            
            // Add our available values, and bind on select and change events
            $input.autocomplete({
			    source: valuesArray,
			    change: _onChange,
			    select: _onSelect,
			    close: _onClose,
			    minLength: 2
		    });

            // Add the completed control to a control container and then to the page target
            $target.append($container.append($input));
            
            // Listen for a reset trigger to change the value
            _bindReset(function() {
                // Only reset the control if there is a value, to prevent needless trigger calls
                if ($('.ui-icon', $container).length > 0) {
                    $('.ui-icon', $container).click();
                    $input.val('');
                }
            });

          }),
        range: Azavea.tryCatch('creating range control', function($target, attr) {
            var $container = _makeContainer(attr.UID, attr.QueryName || attr.Name, attr.Desc),
                blurMinText = 'No Min', 
                blurMaxText = 'No Max',
                $lowerContainer,
                $upperContainer;
            
            
            // Create lower and upper boundry inputs
            var $lower = $('<input type="text" class="pdp-input pdp-input-uninit pdp-control-range pdp-control-range-lower" id="l' + attr.UID + '" value="No Min"/>');
            var $upper = $('<input type="text" class="pdp-input pdp-input-uninit pdp-control-range pdp-control-range-upper" id="u' + attr.UID + '" value="No Max"/>'); 
            

            var _onChange = Azavea.tryCatch('range values changed', function(event) {
                var lowerInit = false, 
                    upperInit = false,
                    $upperClear,
                    $lowerClear;
                
                // We could end up where the user has deleted a value, and the input has not
                // been set to uninit because onChange fires before onBlur.  Call onBlur directly, 
                // to accomodate this.
                $(this).blur();
                    
                // Get these values now, so we don't have to keep looking for that class
                if (!$lower.hasClass('pdp-input-uninit')) {
                    lowerInit = true;
                }
                if (!$upper.hasClass('pdp-input-uninit')) {
                    upperInit = true;
                }
                
                // Only attempt to validate if these conditions are met:
                //  a) both lower and upper bounds exist and are not '.pdp-input-uninitialized'
                //  b) upper OR lower exists, and the other is '.pdp-input-uninitialized'
                if ((!upperInit && ($lower.val() || $lower.val() === '0') && lowerInit) || 
                    (!lowerInit && ($upper.val() || $upper.val() === '0') && upperInit) || 
                    (($lower.val() || $lower.val() ==='0') && lowerInit) && (($upper.val() || $upper.val() ==='0') && upperInit)){
                    // Give an X before the control to clear the text
                    $lowerClear = $('.ui-icon-close', $lowerContainer);
                    $upperClear = $('.ui-icon-close', $upperContainer);
                    
                    // Add a lower clear icon
                    if (lowerInit && $lowerClear.length === 0){
                        $lower
                            .before('<span class="ui-icon ui-icon-close left" title="Remove this filter"></span>')
                            .addClass('pdp-pdb-control-input-range-clearable');
                        
                        // This element should now exist
                        $lowerClear = $('.ui-icon-close', $lowerContainer);
                        
                        $lowerClear.click(function(event) { 
                            // Clear the input and call the change event so all our checks are called
                            $lower.val('').change();
                        }); 
                        
                    } else if(!lowerInit && $lowerClear.length > 0){
                        $lowerClear.remove();
                        $lower.removeClass('pdp-pdb-control-input-range-clearable');
                    }
                    
                    // Add an upper clear icon
                    if (upperInit && $upperClear.length === 0){
                        $upper
                            .before('<span class="ui-icon ui-icon-close left" title="Remove this filter"></span>')
                            .addClass('pdp-pdb-control-input-range-clearable');
                        
                        // This element should now exist
                        $upperClear = $('.ui-icon-close', $upperContainer);
                        
                        $upperClear.click(function(event) { 
                            // Clear the input and call the change event so all our checks are called
                            $upper.val('').change();
                        }); 
                        
                    } else if(!upperInit && $upperClear.length > 0){
                        $upperClear.remove();
                        $upper.removeClass('pdp-pdb-control-input-range-clearable');
                    }
                                        
                    _validate();  
                    
                    // Move the input back, because we are also listening for a "enter" down to search
                    $(this).focus();
                }
                else {
                    // No value, remove the clear icon if it exists
                    $('.ui-icon-close', $container).remove();
                    $upper.removeClass('pdp-pdb-control-input-range-clearable');
                    $lower.removeClass('pdp-pdb-control-input-range-clearable');
                    
                    _setNoCriteria();
                }
            });
            
            // When an input on the range gets the focus, remove the class and clear the value
            var _onFocus = Azavea.tryCatch('range input focus', function(event) {
                var $text = $(this);
                if ($text.hasClass('pdp-input-uninit')){
                    // Remove the class, wipe out value
                    $text.removeClass('pdp-input-uninit').val('');
                }                 
            });
            
            // When input blurs, if empty apply class and give default text
            var _onBlur = Azavea.tryCatch('range input blur', function(event) {
                var $text = $(this),
                    msg = blurMaxText;
                    
                // Deterimine which end of the range control this is, and apply the appropriate msg
                if ($text.hasClass('pdp-control-range-lower')){
                    msg = blurMinText;
                }  
                
                if (!$text.val() || $text.val() === msg){
                    // Add the class, give default value
                    $text.addClass('pdp-input-uninit').val(msg);
                    
                    // Remove any invalidation markup
                    $text.removeClass('input-invalid');
                }       
            });
            
            // Send a message, if needed, that this control no longer has valid criteria, and update 
            //  the state for the UI as well
            var _setNoCriteria = Azavea.tryCatch('trigger invalid criteria', function() {
                    // If we were previously active, alert that we no longer are and wipe out any criteria
                    if ($container.hasClass('pdp-pdb-control-active')) {
                        // There are problems with no value or one missing value, remove me from the list
                         _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper:'le', val:null } ]);
                         _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper:'ge', val:null } ]);
                    }
                    
                    // Update my container display, we are now inactive
                    $container.removeClass('pdp-pdb-control-active');
                    
                    $('.ui-icon-close', $container).remove();
                    $upper.removeClass('pdp-pdb-control-input-range-clearable');
                    $lower.removeClass('pdp-pdb-control-input-range-clearable');                    
            });
            
            var _validate = Azavea.tryCatch('lower bound range changed', function(event) {
                var fields = [],
                    lowerInit = false, 
                    upperInit = false;
                
                // Get these values now, so we don't have to keep looking for that class
                if (!$lower.hasClass('pdp-input-uninit')) {
                    lowerInit = true;
                }
                if (!$upper.hasClass('pdp-input-uninit')) {
                    upperInit = true;
                }
                
                // To accomodate 'No Min' and 'No Max': don't evaluate the rangeUpper/Lower unless 
                // it is a true range with values in each.  Don't evaluate the range unless
                // the input has an actual value.
                if (lowerInit && upperInit) {
                    fields.push({ id: 'u' + attr.UID, required: false, validator: 'rangeUpper' }); 
                    fields.push({ id: 'l' + attr.UID, required: false, validator: 'rangeLower' });
                    fields.push({ id: 'l' + attr.UID, required: false, validator: 'range' });
                    fields.push({ id: 'u' + attr.UID, required: false, validator: 'range' });
                } else if (lowerInit) {
                    fields.push({ id: 'l' + attr.UID, required: false, validator: 'range' });
                } else if (upperInit) {
                    fields.push({ id: 'u' + attr.UID, required: false, validator: 'range' });
                }
                    
                // Validate normal form fields
                var lower = $lower.val().replace(/[$,]/g, ''),
                    upper = $upper.val().replace(/[$,]/g, '');

                if (P.Form.validate(fields, { lower: lower, upper: upper, min: parseFloat(attr.Min), max: parseFloat(attr.Max) })) {
                    // They exist and are numeric, and respect their criteria bounds
                    // The value of the input, whether typed or selected - could have changed to nothing



                    // Update container to active
                    $container.addClass('pdp-pdb-control-active');
                    
                    // Remove any invalidation markup
                    $lower.removeClass('input-invalid');
                    $upper.removeClass('input-invalid');
                    
                    // Trigger an event for someone to handle both values of range, if they have values
                    if (lowerInit) {
                        _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper:'ge', val:lower } ]);
                    } else {
                        // It may have been removed, send out a blank value call
                        _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper:'ge', val:null } ]);
                    }
                    if (upperInit) {
                        _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper:'le', val:upper } ]);
                    } else {
                        // It may have been removed, send out a blank value call
                        _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper:'le', val:null } ]);
                    }
                } else {
                    // Tell everyone that we failed validation, in case we had passed before
                    _setNoCriteria();
                }
                
                //Format the number (money, etc)
                if (parseFloat(upper)) {
                    $upper.val(P.Util.renderers[attr.ValType](upper));
                }
                if (parseFloat(lower)) {
                    $lower.val(P.Util.renderers[attr.ValType](lower));
                }
            });
              
            // Bind events to changes in value (when the controls lose focus)
            $lower
                .blur(_onBlur)
                .change(_onChange)
                .focus(_onFocus);
                
            $upper
                .blur(_onBlur)
                .change(_onChange)
                .focus(_onFocus);
                
            // Append the input with some labeling inbetween
            $container
                .append('<span class="pdp-pdb-control-range-text">Between</span><div class="pdp-pdb-control-lower pdp-pdb-control-input-range"></div><span class="pdp-pdb-control-range-text">and</span><div class="pdp-pdb-control-upper pdp-pdb-control-input-range"></div>')
                .appendTo($target);
            
            // Put the input in the input control container
            $lowerContainer = $('.pdp-pdb-control-lower', $container).append($lower);
            $upperContainer = $('.pdp-pdb-control-upper', $container).append($upper);
            
            // Listen for a reset trigger to change the value
            _bindReset(function() {
                // Only reset the control if there is a value, to prevent needless trigger calls
                if ($lower.val()) {
                    $lower
                        .val(blurMinText)
                        .addClass('pdp-input-uninit')
                        .removeClass('input-invalid');
                }
                if ($upper.val()) {
                    $upper
                        .val(blurMaxText)
                        .addClass('pdp-input-uninit')
                        .removeClass('input-invalid');
                }

                // Tell the control that it has changed
                _setNoCriteria();
            });
        }), 
        wildcard: function($target, attr){
            PDP.Widget.PdbControls.free($target, attr, 'lk');
        },
        free: Azavea.tryCatch('creating freetext control', function($target, attr, operator) {
            var $container = _makeContainer(attr.UID, attr.QueryName || attr.Name, attr.Desc),
                $input = $('<input id="' + attr.UID + '" type="text" class="pdp-input pdp-control-free" />'),
                op = operator ? operator : 'eq';
            
            var _onChange = Azavea.tryCatch('free text control changed', function (event) {
                var valid = true,
                    $clear;
                
                // Remove any validation markup
                $input.removeClass('input-invalid');
                                              
                if (valid && $input.val()) {
                    $input.val(P.Util.renderers[attr.ValType]($input.val()));
                
                    // If i have a value, then update my container to active
                    $container.addClass('pdp-pdb-control-active');
                    _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper: op, val:$input.val() } ]); 
                    
                    // Give an X before the control to clear the text
                    $clear = $('.ui-icon-close', $container);
                    if ($clear.length === 0){
                        $input.before('<span class="ui-icon ui-icon-close left" title="Remove this filter"></span>');
                        
                        // This element should now exist
                        $clear = $('.ui-icon-close', $container);
                        
                        $clear.click(function(event) { 
                            // Clear the input and call the change event so all our checks are called
                            $input.val('').change();
                        });   
                    }
                }
                else {
                    // No value, remove the clear icon if it exists
                    $('.ui-icon-close', $container).remove();
                    
                    // Not valid
                    if ($container.hasClass('pdp-pdb-control-active')) {
                        // No longer active
                        $container.removeClass('pdp-pdb-control-active');   
                        
                        // Trigger an event for someone to handle
                        _triggerPropertyCriteriaChange( [ { attr:attr.UID, oper: op, val:null }]); 
                        
                    }
                }
            });
           
            // Bind the change event
            $input.change(_onChange);
                
            // Append the control container 
            $container
                .append('<div class="pdp-pdb-control-input"></div>')
                .appendTo($target);
            
            // Put the input in the input control container
            $('.pdp-pdb-control-input', $container).append($input);
            
            // Listen for a reset trigger to change the value
            _bindReset(function() {
                // Only reset the control if there is a value, to prevent needless trigger calls
                if ($input.val()) {
                    // Clear the value
                    $input.val('');
                    
                    // Tell the control that it has changed
                    _onChange();
                }
            });
        })
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-pdb-controls.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-export.js ********************/
(function(P) {
    P.Widget.Export = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P,
                defaultText: 'Export To CSV'
            }, options),
            _manager = {},
            _curCriteria = {};
                    
        _self.init = Azavea.tryCatch('init app', function() {
            var $link = {}, $container;
            
            // Render myself to the page
            $container = $(_options.target).append('<div class="pdp-export-link"><img class="pdp-export-image" src="client/css/images/export-icon.png"/><a id="pdp-export" href="javascript:void(0)">' + _options.defaultText + '</a>').hide(); 
            
            $link = $('#pdp-export', _options.target);
            
            // Bind to click
            $link.click(function(){
                // Request the export - this will open a new window, so there's not 
                // much need to do any visual indicators that something is happening.
                // The new window should show a busy indicator, etc.
                $(_options.bindTo).trigger('pdp-export-request');
            });
           
            // Bind to results ready event, and show thyself
            $(_options.bindTo).bind('pdp-data-response', function(){
                $container.show();
            });
            
            $(_options.bindTo).bind('pdp-criteria-reset', function() {
                $container.hide();
            });
           
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-export.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-pdb-longview.js ********************/
(function(P) {
    P.Widget.Longview = function(options) {
        var _self = {},
            _options = $.extend({
                bindTo: P.Pdb,
                hideNoValues: false,
                resizable: false,
                modal: true,
                height: 750,
                width: 750,
                title: 'Property Description',
                linkText: 'Download Full Report'
            }, options),
            _$container = {},
            _panorama,
            _sv, 
            _$street,
            _userRole;
       
        var _displayNoData = Azavea.tryCatch('display no street view data', function(){
            // No data for this location, display text it
            _$street.empty().html('<div class="pdp-longview-street-none">No image available for this location.</div>');
        });
        
        // When the download link is clicked
        var _downloadReport = Azavea.tryCatch('download full longview report', function(propertyId) { 
            // Track report download
            P.Util.trackMetric(_userRole, 'Properties | Detailed Report Download');
            
            // Make the call into the handler
            P.Data.getPropertyReport(propertyId);
        });
        
        // For the given record and attribute list, render the list and display the dialog
        var _showLongView = Azavea.tryCatch('show long view details window', function(attrs, record) {
            var listItems = '', 
                label = '',
                $table,
                caption = '',
                lat = 0,
                lng = 0,
                show = true,
                propId = -1,
                $link = $('#pdp-download-report'),
                v;
                
            // Loop through each attribute to see if it should be included in the long view
            // and build a list of label/values
            $.each(attrs, function(i, attr) {
                show = true;
                // Locate the Property Name for our caption, which may be null and mark it to not show in list
                if (attr.UID === 'PropertyName') {
                    caption = record[i] ? record[i] : '';
                    show = false;
                }
                
                // Pluck out the lat/lng so we can find it on Street View
                if (attr.UID === 'Lat') {
                    lat = record[i];
                }
                if (attr.UID === 'Lon') {
                    lng = record[i];
                }
                
                // Also find the Property Id to pass to the download report function
                if (attr.UID === 'UID') {   
                    propId = record[i];
                }

                // Show this attribute value (unless hideNoValues = true and there is no value)
                if (show && attr.LongOrder && (_options.hideNoValues ? record[i] || record[i] === 0 : true) ) {
                    label = '<label class="pdp-longview-label">' + attr.Name + ':</label>';
                    if ($.isArray(record[i])){
                        // For this list, we just want to comma delimit the array
                        v = record[i].join(', ');
                    }
                    else if (P.Util.renderers[attr.ValType]){
                        v = P.Util.renderers[attr.ValType](record[i]);
                    }else{
                        v = record[i];
                    }
                    listItems += '<tr><td>' + label + '</td>' + 
                                     '<td><div class="pdp-longview-value">' + v + '</div></td></tr>'; 
                }
            });
            
 
            
            // Track longview showing
            P.Util.trackMetric(_userRole, 'Properties | Display Longview');
            
            // If we didn't find a propertyId, don't show a link
            if (propId === -1){
                $($link, _$container).hide();
            }else {
                P.Data.checkPropertyReportExists(propId, function(resp){
                    if (resp.Exists){
                        // The link is valid, register the click event for our download link and 
                        //  remove any previous bindings
                        $($link, _$container).unbind('click').click(function(){
                            _downloadReport(propId);
                        }).show();
                    }else{
                        // The report doesn't exist, don't give the option
                        $link.hide();
                    }
                });
            }
            
            // Remove any existing list and append new list to the dialog container
            $table = $('#pdp-longview-table', _$container).empty().append(listItems);
           
            // The table is made, style the alt rows
            $('tr:odd', $table).addClass('pdp-table-row-alt-pdb');
            
            // Append the caption, it may be '', in which case there is no caption
            $('.pdp-longview-caption', _$container).empty().append('<span>' + caption + '</span>');
            
            // Get the Google Street View data and add it to container if we have valid coords
            if (lat && lng){
                _getStreetView(lat, lng);
            } else {
               _displayNoData();
            }
            
            // Show the dialog
            _$container.dialog('open');
            
        });
        
        // Determines the yaw between two lat/longs
        var _computeAngle = Azavea.tryCatch('compute streetview angle', function (endLatLng, startLatLng) {
            var DEGREE_PER_RADIAN = 57.2957795;
            var RADIAN_PER_DEGREE = 0.017453;

            var dlat = endLatLng.lat() - startLatLng.lat();
            var dlng = endLatLng.lng() - startLatLng.lng();
            // We multiply dlng with cos(endLat), since the two points are very closeby,
            // so we assume their cos values are approximately equal.
            var yaw = Math.atan2(dlng * Math.cos(endLatLng.lat() * RADIAN_PER_DEGREE), dlat)* DEGREE_PER_RADIAN;
            return _wrapAngle(yaw);
        });

        var _wrapAngle = Azavea.tryCatch('compute wrap angle yaw', function (angle) {
            if (angle >= 360) {
              angle -= 360;
            } else if (angle < 0) {
             angle += 360;
            }
            return angle;
          });

        // Caches the highest role of the current user, for analytics only
        var _setUserRole = Azavea.tryCatch('set user role nychanis', function(user){
                if (user){
                    if (user.Admin || user.Limited){
                        _userRole = 'Agency';
                        return;
                    }
                }        
                _userRole = 'Public';
        });
                          
        // Attempt to get a Google Street View snap of an address
        var _getStreetView = Azavea.tryCatch('get street view data', function(lat, lng) {
            try{
                // Cache our street view here in case google goes down
                if (!_sv){
                    _sv = new google.maps.StreetViewService();
                }
                
                var propLatLng = new google.maps.LatLng(lat.toFixed(6), lng.toFixed(6));
                
                _panorama = new google.maps.StreetViewPanorama(_$street.get(0));
                _panorama.enableCloseButton = false;
                _panorama.linksControl = false;
                
                // Request a panorama with the property lat long.  50 is the smallest radius we can search.          
                _sv.getPanoramaByLocation(propLatLng, 50, function(data, status) {
                    if (status === google.maps.StreetViewStatus.OK){
                        // We have valid street vew data, show the view
                        _$street.show();
                        
                        // Try to determine the yaw/heading towards the property by comparing what we
                        //  asked for to what we got (lat/long) when we requested the panorama.                 
                        var angle = _computeAngle(propLatLng, data.location.latLng);
                        var panoId = data.location.pano;
                        _panorama.setPano(panoId);
                        _panorama.setPov({
                            heading: angle,
                            pitch: 0, 
                            zoom: 1
                            });
                            
                        _panorama.setVisible(true);    
                    }
                    else {
                        _displayNoData();
                    }
                });
            }
            catch(err){
                // If google is having a hard time, just display no data
                _displayNoData();
            }
        });
        
        // Create the dialog that will show longview details, including space for streetview and title
        var _createLongviewDialog = Azavea.tryCatch('create dialog container', function(){            
            // Create div container for caption, the list, and GSV
            _$container = $('<div class="pdp-longview"><div class="pdp-longview-caption"></div><table id="pdp-longview-table" class="pdp-longview-list"></table><div id="pdp-streetview-title">Approximate View</div><div class="pdp-longview-street"></div></div>');
            _$street = $('.pdp-longview-street', _$container);
            
            // Create a link to report download link
            _$container.append('<a id="pdp-download-report" style="display=none;" href="javascript:void(0)">' + _options.linkText + '</a>');
            
            // Tell the DialogUI about the container, with options
            _$container.dialog({
		        autoOpen: false,
		        resizable: _options.resizable,
		        height: _options.height,
		        width: _options.width,
		        modal: _options.modal,
		        title: _options.title,
		        buttons: {
	                Close: function() {
		                $(this).dialog('close');
	                }}
                });
                
                $('button', _$container).addClass('pdp-button');
        });
        
        // Override the P.Util.renderer to place custom code in the ExtraCol
        P.Util.renderers.propertyDetails = function(value, id, record, attrs) {
            // Bind an event for this particular row for later
            $('.pdp-property-details-' + id).die().live('click', function(event) {
                _showLongView(attrs, record);
            });
            
            // Return the link markup
            return '<a class="pdp-property-details-' + id + '" href="javascript:void(0);">'+value+'</a>';
        };
                    
        // Initialize and render dialog
        _self.init = Azavea.tryCatch('init longview widget', function() {
            // Login status            
            $(P).bind('pdp-login-status-refresh', function(event, user){
                _setUserRole(user);
            });
             $(P).bind('pdp-login-success', function(event, user){
                _setUserRole(user);
            });
            
            // Create the container for the UI Dialog
            _createLongviewDialog();
            
            $(_options.bindTo).bind('pdp-pdb-show-longview', function(event, record, attrs){
                _showLongView(attrs, record);
            });
            
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-pdb-longview.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-map.js ********************/
(function(P) {
    P.Widget.Map = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'map',
                bindTo: P,
                layers: [
                    new OpenLayers.Layer.Google("Street", {numZoomLevels: 20}),
                    new OpenLayers.Layer.Google("Satellite", {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}),
                    new OpenLayers.Layer.Google("Hybrid", {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}),
                    new OpenLayers.Layer.Google("Terrain", {type: google.maps.MapTypeId.TERRAIN})                
                ],
                defaultBbox: new OpenLayers.Bounds(-8266466, 4936833, -8204248, 5000206),
                maxBbox: new OpenLayers.Bounds(-8306466, 4896833, -8164248, 5040206)
            }, options),
            $target,
            _map,
            _$flashPointElement,
            _pointToFlash,
            _nychanisLayer,
            _pdbLayer,
            _outlineLayer,
            _popup,
            // Used for reprojection from lat/lon.
            _proj = new OpenLayers.Projection("EPSG:4326"),
            _popupPropertyId = -1,
            _trackPopup = false,
            _popupPropertyIdByIndex,
            _popupIndexByPropertyId;
        
        // The base layer has changed, update map.
        var _handleBaseLayerChange = Azavea.tryCatch('base layer changed', function(event, name){
             var layers = _map.getLayersByName(name);
             if (layers.length) {  
                _map.setBaseLayer(layers[0]);
                P.Util.trackMetric('Map', 'Base Layer Change', name);
             } else {
                P.Util.quickError('Could not switch to base layer: [' + name + '], does not exist in map.');
             }
        });
        
        // Add a nychanis layer to the map, using the index from the current reponse
        var _updateNychanisLayer = Azavea.tryCatch('add nychanis layer', function(data, layerIndex){
            
            // Make sure we have layer at this position
            if (data.MapInfo && data.MapInfo.Layers && data.MapInfo.Layers.length && data.MapInfo.Layers.length > layerIndex) {
                if (_nychanisLayer) {
                    // Merge the new layer params into the nychanis layer currently displayed on the map
                    _nychanisLayer.mergeNewParams(data.MapInfo.Layers[layerIndex].Config);
                } else {
                    //Init the nychanis layer with the params from the data response
                    _nychanisLayer = new OpenLayers.Layer.WMS(
                        'nychanis', data.MapInfo.Server,
                        data.MapInfo.Layers[layerIndex].Config,
                            {
                                isBaseLayer: false,
                                tileSize: new OpenLayers.Size(500,500),
                                buffer: 0,
                                displayOutsideMaxExtent: true
                            } 
                        );
                    _map.addLayer(_nychanisLayer);
                    // This is a bit hacky.  We need to make sure the pdb marker layer is on top
                    // of the nychanis layer, but the nychanis layer is being added dynamicly and
                    // the pdb layer is not.  So for now when we add the nychanis layer, make sure
                    // the pdb layer is pushed to the top.
                    if (_pdbLayer) {
                        _map.raiseLayer(_pdbLayer, 50);
                    }
                }
            } else {
                // Can't add requested layer, remove the previously added one so the title/display matches
                if (_nychanisLayer){
                    _map.removeLayer(_nychanisLayer);
                    _nychanisLayer = null;
                } 
            }
        });
              
        // The base layer has changed, update map using the index of the response layer
        var _handleNychanisLayerChange = Azavea.tryCatch('nychanis layer changed', function(event, nychanisData, layerIndex){
            _updateNychanisLayer(nychanisData, layerIndex);            
        });
        
        // Add a nychanis layer to the map, using the index from the current reponse
        var _updateOutlineLayer = Azavea.tryCatch('change outline layer', function(layerIndex){
            // See if there is such a layer config.
            var layerConfig = P.Config.Outlines.Layers[layerIndex];
            if (layerConfig) {
                // Reconfigure the layer and make sure it's visible.
                _outlineLayer.mergeNewParams(layerConfig.Config);
                if (!_outlineLayer.getVisibility()) {
                    _outlineLayer.setVisibility(true);
                }
            } else {
                // Just hide the layer, they presumably selected "none".
                _outlineLayer.setVisibility(false);
            }
        });
        // The base layer has changed, update map using the index of the response layer
        var _handleOutlineLayerChange = Azavea.tryCatch('outline layer changed', function(event, layerIndex){
            _updateOutlineLayer(layerIndex);            
        });

        // Remove any info popup bubble on the map
        var _removePopup = Azavea.tryCatch('remove popup', function() {
            if (_popup) {
                _map.removePopup(_popup);
            }
        }); 

        // Render a button on the target to zoom into the coordinates provided
        var _renderPopupZoom = Azavea.tryCatch('render popup zoom', function(lonlat, $target) {
            $('<button id="pdp-map-popup-zoom-button" class="pdp-button left">Zoom Here</button>')
                .button()
                .appendTo($target)
                .click(function() {
                    _trackPopup = true;
                    _removePopup();
                    _map.setCenter(lonlat, (_map.getZoom() + 3));
                });
        });

        // For clustered markers, create a pager for the bubble that the user can cycle through
        var _renderPopupPager = Azavea.tryCatch('render popup pager', function(length, $target, resultsTruncated) {
            //One based!
            var curIndex = 1,
                labelDelim = resultsTruncated ? ' of first ' : ' of ';
            
            // Figure out our current index.  We start at one, unless there is a propertyId we're tracking, in
            // which case we need to use the index of that propertyID, unless it does not exist, in which case we
            // just use one also.
            if (_trackPopup &&  _popupIndexByPropertyId[_popupPropertyId]) {
                // 1 based
                curIndex = _popupIndexByPropertyId[_popupPropertyId] + 1;
            }
            
            // Call for a click event on the pager
            function handlePagerClick($next, $prev) {
                // Determine if we're at begining or end of the list
                if (curIndex > length) {
                    curIndex = 1;
                }

                if (curIndex < 1) {
                    curIndex = length;
                }
                
                // Set the tracked popup propertyId from the index
                _popupPropertyId = _popupPropertyIdByIndex[curIndex -1];
                
                // Hide any open popup panels, and show the current panel for the index
                $('.pdp-shortview-property').hide();
                $('#pdp-popup-property-' + curIndex).show();
                $('.pdp-map-popup-pager-summary').text(curIndex + labelDelim + length + ' Properties');
            }
            
            if (length > 1) {
                // Create the markup for the pager
                $target.append(
                    '<div class="ui-corner-all pdp-map-popup-prev" title="View Previous Property">' +
                        '<span class="ui-icon ui-icon-triangle-1-w"></span>' +
                    '</div>' +
                    '<div class="ui-corner-all pdp-map-popup-next" title="View Next Property">' +
                        '<span class="ui-icon ui-icon-triangle-1-e"></span>' +
                    '</div>' +
                    '<div class="ui-widget-content ui-corner-all pdp-map-popup-pager-summary">' + curIndex + labelDelim + length + ' Properties</div>'
                ).show();
                
                // Cache the selectors for the prev/next buttons
                var $next = $('.pdp-map-popup-next', $target),
                    $prev = $('.pdp-map-popup-prev', $target);
                
                // Bind click event for next    
                $next.click(function(){
                    curIndex++;
                    handlePagerClick($next, $prev);
                });
                
                // Bind click event for prev
                $prev.click(function(){
                    curIndex--;
                    handlePagerClick($next, $prev);
                });
            } else {
                $target.hide();
            }
        });
        
        // Render a short info panel for each property on this popup.
        var _renderPopupContents = Azavea.tryCatch('render popup contents', function(idIndex, data, $target) {
            var listItems, 
                label,
                value,
                caption,
                id,
                $property;

            $target.empty();
            _popupPropertyIdByIndex = [];
            _popupIndexByPropertyId = {};
            
            //Manually add a decent looking jQueryUI close icon
            $('.olPopupCloseBox')
                .html('<span class="ui-icon ui-icon-circle-close"></span>')
                .click(function() {
                    // Function on popup click to no longer track the popup
                    _trackPopup = false;
                    _popupPropertyId = -1;
            });

            $.each(data.Values, function(j, record) {
                $property = $('<div id="pdp-popup-property-' + (j+1) + '" class="pdp-shortview-property"><div class="pdp-shortview-caption"></div><ul class="pdp-shortview-list"></ul><div class="pdp-shortview-link"></div></div>');
                listItems = '';
                id = record[idIndex];
                
                // Keep a cache so the pager can quickly find what PropertyId is selected
                _popupPropertyIdByIndex.push(id);
                _popupIndexByPropertyId[id] = j;
                
                $.each(data.Attrs, function(i, attr) {
                    show = true;
                    // Locate the Property Name for our caption, which may be null and mark it to not show in list
                    if (attr.Name === 'Property Name') {
                        caption = record[i] || '';
                    } else if (attr.ShortOrder && (_options.hideNoValues ? (record[i] || record[i] === 0) : true) ) {
                        // Show this attribute value (unless hideNoValues = true and there is no value)
                        label = '<label class="pdp-shortview-label">' + attr.Name + ':</label>';
                        value = '<label class="pdp-shortview-value">' + P.Util.renderers[attr.ValType](record[i]) + '</label>';
                        listItems += '<li class="pdp-shortview-list-item">' + label + value + '</li>'; 
                    }
                });
                
                // Remove any existing list and append new list to the dialog container
                $('.pdp-shortview-list', $property).empty().append(listItems);
                $('.pdp-shortview-caption', $property).html(caption);
                
                $('.pdp-shortview-link', $property)
                    .html('<a class="pdp-property-details-' + id + '" href="javascript:void(0);">More Details</a>')
                    .click(function(){
                        $(P.Pdb).trigger('pdp-pdb-show-longview', [record, data.Attrs]);
                    });

                //Only show the first one by default
                
                if (j > 0 ) {
                    $property.hide();
                } else if (_popupPropertyId === -1){
                    // Track the property Id of the selected for the purpose of adding the popup after a zoom
                    _popupPropertyId = id;
                }
                
               if (_trackPopup && id === _popupPropertyId) {
                    // Clear any previously displayed property pages
                    $('.pdp-shortview-property').hide();
                    
                    // Show our particular property that we're trackingID
                    $property.show();
                }
                
                $target.append($property);
            });
        });

        // For a given marker, display a popup for the array of property ids
        var _addPopup = Azavea.tryCatch('add popup', function(marker, idArray) {
            var max = 100, 
                truncateResults = (idArray.length > max),
                ids;
                // Only display results up to max number
                if (truncateResults) {
                    ids = idArray.slice(0, max).join(',');
                } else {
                    ids = idArray.join(',');
                }
            
            // Remove any existing popups
            _removePopup(_popup);
            
            // Create a basic info bubble with loading... text
            var content = '<div class="pdp-map-popup-pager"></div><div id="pdp-map-popup-container">Loading...</div><div class="pdp-map-popup-footer"><div class="pdp-map-popup-zoom"></div></div>';
            
            // Track clicking on a map marker, type and number of properties represented by marker
            P.Util.trackMetric('Map', 'Click Marker', idArray.length > 1 ? 'Cluster' : 'Single', idArray ? idArray.length : 1);
            
            // Create and cache the popup
            _popup = new OpenLayers.Popup.FramedCloud('pdb-popup',
                marker.lonlat,
                new OpenLayers.Size(200, 200),
                content,
                null, true
            );
            
            // Display it on the map
            _map.addPopup(_popup, true);
            
            // Get property details for this group of ids
            P.Data.getPropertyDetails(ids, function(data) {
                var idIndex = P.Util.getAttrIndex(data.Attrs, 'UID');
                // Display the popup info and controls
                _renderPopupContents(idIndex, data, $('#pdp-map-popup-container'));
                _renderPopupPager(data.Values.length, $('.pdp-map-popup-pager'), truncateResults);
                _renderPopupZoom(marker.lonlat, $('.pdp-map-popup-zoom'));
                
                // We are done tracking anything.  A zoom will re-enable the flag
                _trackPopup = false;
            });
        });

        // Add single property markers to the map
        var _addMarker = Azavea.tryCatch('add marker', function(property) {
            //var markerPath = 'client/css/images/markers/map-indicator.png';
            // Client requested image be hosted off-domain to give them more styling options
            var markerPath = 'http://www.furmancenter.org/tweaks/map-indicator.png';
            
            // Add the marker and assign a click function
            var size = new OpenLayers.Size(24,24);  // previous size: 21, 25
            var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
            var icon = new OpenLayers.Icon(markerPath, size, offset);
            
            var marker = new OpenLayers.Marker(new OpenLayers.LonLat(property.X, property.Y), icon);
            marker.events.register('click', marker, function() {
                _addPopup(marker, [ property.Key ]);
            });
            
            _pdbLayer.addMarker(marker);
            
           // If this is the marker that contains our property that had a popup before, add the popup back
            if (_trackPopup === true && _popupPropertyId === property.Key ) {
                _addPopup(marker, [ property.Key ]);
            }           
                        
            $('#' + icon.imageDiv.id).addClass('pdp-map-icon');
        });

        // Add markers that represent clustered properties to the map
        var _addClusterMarker = Azavea.tryCatch('add cluster marker', function(cluster) {
            var radius = 22 + Math.floor((Math.log(cluster.Keys.length) * 2) + Math.log(cluster.Keys.length / 10) * 5);

            // Create the icon the for the, including size (based of off the radius of the cluster area)
            var markerPath = 'client/css/images/markers/marker-cluster-bg.png';
            var size = new OpenLayers.Size(1, 1);
            var offset = new OpenLayers.Pixel(-(radius/2), -(radius/2));
            var icon = new OpenLayers.Icon(markerPath, size, offset);

            // Create the marker, add it to the map and add a click event to it to display a popup
            var marker = new OpenLayers.Marker(new OpenLayers.LonLat(cluster.X, cluster.Y), icon);
            marker.events.register('click', marker, function() {
                _addPopup(marker, cluster.Keys);
            });

            _pdbLayer.addMarker(marker);

            // If this is the marker that contains our property that had a popup before, add the popup back
            if (_trackPopup === true) {
                if ($.inArray(_popupPropertyId, cluster.Keys) > -1 ){
                    _addPopup(marker, cluster.Keys);
                }
            }
            
            // Display for marker label
            var labelCss = { opacity:0.9, height:radius, width:radius, lineHeight:radius + 'px', '-moz-border-radius': radius + 'px', '-webkit-border-radius': radius + 'px' };
        
            // Add a label over the image, make the image the correct size, and the clustered property keys to the [rel] of the market div
            var $markerDiv = $('#' + icon.imageDiv.id).css('width', radius).addClass('pdp-map-aggregated-icon').attr('rel', cluster.Keys.join(','));
            $('img', $markerDiv).css({ width: radius + 'px', height: radius + 'px' });
            $('<span class="pdp-map-marker-aggregated-label">' + cluster.Keys.length + '</span>').css(labelCss).appendTo($markerDiv);
        });

        // Data is returned for property info, place markers on the map.  Results are in two groups:
        //  Singles - which are non-clustered individual properties, and Clusters - which are points representing
        //  multiple results near the same lat/long.  These get different markers and popups.
        var _handlePdbMapResponse = Azavea.tryCatch('handle pdb map response', function(event, data){
            
            // Clear the current results from the map
            _pdbLayer.clearMarkers();
            _removePopup();
            
            // Add both signle and clustered markers
            var i;
            if (data.Singles){
                for (i=0; i<data.Singles.length; i++) {
                    _addMarker(data.Singles[i]);
                }
            }
            if (data.Clusters){
                for (i=0; i<data.Clusters.length; i++) {
                    _addClusterMarker(data.Clusters[i]);
                }
            }
        });

        var _handleMapZoomTo = Azavea.tryCatch('Zoom to a specific region of the map', function(event, left, bottom, right, top, flashx, flashy) {
            // This is coming in as lat/lon, we want spherical mercator.
            var bounds = new OpenLayers.Bounds(left, bottom, right, top);
            bounds.transform(_proj, _map.getProjectionObject());
            // Mark the flash point to be flashed once the zoom is complete.
            if (flashx && flashy) {
                _pointToFlash = {x: flashx, y: flashy};
            }
            _map.zoomToExtent(bounds, true);
        });
        
        var _flashMapPoint = Azavea.tryCatch('flash map point', function(event) {
            if (_pointToFlash) {
                setTimeout(function () {
                    var point = new OpenLayers.LonLat(_pointToFlash.x, _pointToFlash.y);
                    point.transform(_proj, _map.getProjectionObject());
                    var pixel = _map.getPixelFromLonLat(point);
                    _$flashPointElement.css('left', pixel.x).css('top', pixel.y).show().effect('puff');
                    _pointToFlash = null;
                }, 500);
            }
        });

        // Trigger a data request for the current map extent
        var _triggerPdbDataRequest = Azavea.tryCatch('pdb data request', function(event){
            //Transform from mercator to lat/lon
            var bbox = _map.getExtent();
            $(P.Pdb).trigger('pdp-map-data-request', [ bbox.left, bbox.bottom, bbox.right, bbox.top ]);
        });
        
        var _onMoveEnd = Azavea.tryCatch('on moveend', 
            Azavea.doLast(200, function(event) {
                // Update PDB data if necessary.
                _triggerPdbDataRequest(event);
                // Flash a point on the map if necessary.
                _flashMapPoint(event);
                _trackPopup = true;
                
            })
        );
                            
        // Bind to events this widget cares about 
        var _bindEvents = Azavea.tryCatch('bind map events', function(){
            
            // Handles event for changing of base layer for layer control
            $(_options.bindTo).bind('pdp-map-base-layer-changed', _handleBaseLayerChange);
            
            // Handles event for changing the current nychanis layer from the layer control slider
            $(P.Nychanis).bind('pdp-nychanis-layer-change', _handleNychanisLayerChange);
            
            // Handles event for changing the current outline layer from the outline layer control
            $(_options.bindTo).bind('pdp-map-outline-layer-changed', _handleOutlineLayerChange);

            // Handles event for changing the current outline layer from the outline layer control
            $(_options.bindTo).bind('pdp-map-zoom-to', _handleMapZoomTo);
            
            // Handle the return of pdb map data
            $(P.Pdb).bind('pdp-map-data-response', _handlePdbMapResponse);
            
            // When we force a data request
            $(P.Pdb).bind('pdp-data-force-update', _triggerPdbDataRequest);
            
            // Show hide pdb marker layer from layer control
            $(P.Pdb).bind('pdp-pdb-layer-toggle', function(event, show){
                // Track the toggling of property markets
                P.Util.trackMetric('Map', 'Property Markers', show ? 'Display' : 'Hide');
                
                _pdbLayer.setVisibility(show);
            });
            
            // Show hide nychanis layer from layer control
            $(P.Nychanis).bind('pdp-nyc-layer-toggle', function(event, show){
                if (_nychanisLayer) {
                    // Track the toggling of property markets
                    P.Util.trackMetric('Map', 'Nychanis Layer', show ? 'Display' : 'Hide');
                    _nychanisLayer.setVisibility(show);
                }
            });
                        
            // Reset request from pdb - clear the map
            $(P.Pdb).bind('pdp-criteria-reset', function(event) {
                _pdbLayer.clearMarkers();
                _popupPropertyId = -1;
                _removePopup();
            });
            
            // Reset request from nychanis - clear the map
            $(P.Nychanis).bind('pdp-criteria-reset', function(event) {
                if (_nychanisLayer){
                    _map.removeLayer(_nychanisLayer);
                }
                _nychanisLayer = null;
            });
            
            // Ask for more pdb property data when the map is moved 
            _map.events.register('moveend', _map, _onMoveEnd);
        });
        
        // Render the map to the display
        var _render = Azavea.tryCatch('render map', function() {
            $target = $(_options.target);
            _$flashPointElement = $('<div id="pdp-map-flash-point"/>').appendTo($target).hide();
        
            // Initialize the map and controls
            _map = new OpenLayers.Map($target[0].id, {
                projection: new OpenLayers.Projection('EPSG:900913'),
                displayProjection: new OpenLayers.Projection('EPSG:4326'),
                units: 'm',
                maxZoomLevel: 17,
                minZoomLevel: 9,
                maxExtent: _options.defaultBbox,
                restrictedExtent: _options.maxBbox,
                controls: [
                    new OpenLayers.Control.PanPanel(),
                    new OpenLayers.Control.ZoomPanel(),
                    new OpenLayers.Control.Navigation(),
                    new OpenLayers.Control.ArgParser(),
                    new OpenLayers.Control.Attribution(),
                    new OpenLayers.Control.ScaleLine()
                ]
            });
            
            // Set up map defaults
            _map.addLayers(_options.layers);

            // Create and add a layer for the area outlines (like boroughs, etc).
            _outlineLayer = new OpenLayers.Layer.WMS(
                'outlines', P.Config.Outlines.Server,
                    { /* before one is chosen, no layer config is available. */ },
                    {
                        isBaseLayer: false,
                        tileSize: new OpenLayers.Size(500,500),
                        buffer: 0,
                        displayOutsideMaxExtent: true
                    }
                );
            // It starts out invisibile.
            _outlineLayer.setVisibility(false);
            _map.addLayer(_outlineLayer);
            
            // Create and add a pdb marker layer
            _pdbLayer = new OpenLayers.Layer.Markers('pdb');
            _map.addLayer(_pdbLayer);

            // Zoop to the default area
            _map.zoomToExtent(_options.defaultBbox, true);
        });
            
        // Initialize the map    
        _self.init = Azavea.tryCatch('init map and related controls', function() {
            _render();
            
            // Bind to events this widgets needs to hear
            _bindEvents();
            
            // Set up layer widget
            P.Widget.Map.Layers({
                target: '#pdp-map-layers-content'
            }).init();
            
            // Set up geocode widget
            P.Widget.Map.Geocode({
                target: '#pdp-map-geocode-content'
            }).init();
            
            // Trigger an event with the max bbox 
            $(P).trigger('pdp-map-max-bbox', [_options.maxBbox.toArray()]);
            
            return _self;
        });
        
        return _self;
    };
}(PDP));

/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-map.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-map-layers.js ********************/
(function(P) {
    P.Widget.Map.Layers = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'maplayer',
                bindTo: P
            }, options),
            _curResponse,
            _$button,
            _$panel,
            _$layerButtons,
            $timeSlider, 
            $timeLabel,
            _availableTimes,
            _mostRecentTimeIndex,
            _$nychanisContainer;


        // Grab the last (most recent) time that exists which is also not null
        var _setMostRecentAvailableTime = Azavea.tryCatch('get most recent available time', function(){
            
            // Loop through the available times from most recent down, and find the first non-null;
            var i;
            for(i=_availableTimes.length-1; i >-1; i--){
                if (_availableTimes[i]){
                    _mostRecentTimeIndex = i;
                    break;
                }
            }
        });

        // Event for when the slider value changes, not while it is being dragged
        var _sliderChanged = Azavea.tryCatch('slider changed', function(index){           
            // Indicate to the map that a new nychanis layer has been selected
            $(P.Nychanis).trigger('pdp-nychanis-layer-change', [_curResponse, index, _availableTimes[index]]);
        });
        
        // Event for when the slider is being dragged
        var _sliderMoved = Azavea.tryCatch('slider moved', function(val){
            // Update the display, the change event handles actual requests when 
            //  the slider value is updated
            $timeLabel.text('Displaying results from: ' + _availableTimes[val]);
        });
        
       // When a new base layer is selected, trigger an event to tell the map                               
        var _layerChange = Azavea.tryCatch('layer change click', function(event) {
            var name = $('input[name="pdp-map-layers-buttons"]:checked').val();           
            $(_options.bindTo).trigger('pdp-map-base-layer-changed', [name]);
        });

        // Stops events from going to the map.                             
        var _stopPropagation = Azavea.tryCatch('panel mousedown', function(event) {            
            // We don't want click events passing through to the map layer underneath
            event.stopPropagation();
        });
        
        // Show or hide the panel                              
        var _togglePanel = Azavea.tryCatch('toggle map layer panel', function(event) {            
            // Change panel state.  It might seem like you should hide the closable-panel once, 
            //  outside of the if, but then you could never hide the map layer panel.  Do it seperately.
            if (_$panel.is(':visible')){
                // Hide any panels
                $('.pdp-closable-panel').hide();
            }else{
                $('.pdp-closable-panel').hide();
                _$panel.show();
            }
            
        });

        // Render the legend after a data response                             
        var _renderLegend = Azavea.tryCatch('render legend', function() {            
            var legend = '<div id="pdp-nychanis-map-legend">';
            
            // Loop through each legend item
            $.each(_curResponse.LegendInfo.Elements, function(i, item){
                var colorStr = item.Color;
                var colorR = parseInt(colorStr.substring(1,3), 16);
                var colorG = parseInt(colorStr.substring(3,5), 16);
                var colorB = parseInt(colorStr.substring(5), 16);
                var opacity = _curResponse.LegendInfo.Opacity;
                if (!opacity) {
                    opacity = '1.0';
                }
                var minToShow = item.MinValue;
                var maxToShow = item.MaxValue;
                if (_curResponse.LegendInfo.ValueType) {
                    var renderFunc = P.Util.renderers[_curResponse.LegendInfo.ValueType];
                    if (renderFunc) {
                        minToShow = renderFunc(minToShow);
                        maxToShow = renderFunc(maxToShow);
                    } else {
                        maxToShow += ' (unable to render type ' + _curResponse.LegendInfo.ValueType + ')';
                    }
                }
                var backgroundColorCss = 
                        // Start by declaring background with rgb, which works in older browsers and IE.
                        // Also note that for IE 6 and 7 you can't use "background-color", it has to be
                        // "background".
                        'background: rgb(' + colorR + ',' + colorG + ',' + colorB + ');' +
                        'background: rgba(' + colorR + ',' + colorG + ',' + colorB + ',' + opacity + ');';
                legend += '<div class="pdp-nychanis-legend-row"><span class="pdp-nychanis-legend-swatch" style="' + backgroundColorCss +
                        '"/><span class="pdp-nychanis-legend-info pdp-nychanis-legend-info-min">' +
                        minToShow + '</span><span class="pdp-nychanis-legend-info pdp-nychanis-legend-info-sep">-</span><span class="pdp-nychanis-legend-info pdp-nychanis-legend-info-max">' + maxToShow + '</span></div>';
            });
            
            legend += '<div>';
            
            // Append it to the target
            $('#pdp-nychanis-legend-container')
                .empty()
                .append(legend);
        });
        
        // Setup the fancy Nychanis layer picker
        var _renderNychanisSlider = Azavea.tryCatch('render legend', function() {
            $timeLabel.text('Displaying results from: ' + _availableTimes[_mostRecentTimeIndex]);        
            $timeSlider.slider('option', {max: _mostRecentTimeIndex, min: 0, value: _mostRecentTimeIndex, disabled: false});
            
            P.Util.renderers.sliderTicks($timeSlider, _availableTimes);
            
            _$nychanisContainer.show();
        });
        
        // When we recieve a nychanis data response
        var _handleNychanisResponse = Azavea.tryCatch('handle nychanis data', function(event, data){
            // Cache response
            _curResponse = data;
            
            // If we got any layers, allow the user to toggle between them
            if (data.MapInfo && data.MapInfo.Layers && data.MapInfo.Layers.length) {
                _availableTimes = [];
                _mostRecentTimeIndex = null;
                var i;
                
                // Always show the Nychanis layer when a new search is done
                $('#pdp-map-layers-show-nyc').attr('checked', true);
                $('#pdp-nyc-map-title').show();
                $(P.Nychanis).trigger('pdp-nyc-layer-toggle', true);
                
                // Create a list of availabe time frames
                for(i=0; i <_curResponse.MapInfo.Layers.length;  i++) {
                    if (_curResponse.MapInfo.Layers[i].Config) {
                        _availableTimes.push(_curResponse.MapInfo.Layers[i].Name);
                    } else {
                        _availableTimes.push(null);
                    }
                }
                // In our collection, the most recent time index is the last one.
                //_mostRecentTimeIndex = _availableTimes.length - 1;
                _setMostRecentAvailableTime();
                
                // Enable and set the controls to the correct data state
                _renderLegend();
                _renderNychanisSlider();
                
                // Trigger the layer change to the default layer
                $(P.Nychanis).trigger('pdp-nychanis-layer-change', [_curResponse, _mostRecentTimeIndex, _availableTimes[_mostRecentTimeIndex]]);
            } else {
                // No layers, force the map to remove the previous
                _$nychanisContainer.hide();
                $(P.Nychanis).trigger('pdp-nychanis-layer-change', [_curResponse, -1, '']);
            }
        });
        
        // Bind to events that this widget cares about                                
        var _bindEvents = Azavea.tryCatch('bind map layer events', function() {
            _$button.click(_togglePanel);
            _$button.mousedown(_stopPropagation)
                    .dblclick(_stopPropagation);
            _$panel.mousedown(_stopPropagation)
                    .dblclick(_stopPropagation);
            _$layerButtons.change(_layerChange);
            
            $('#pdp-map-layers-show-pdb').click(function() {
                
                // Show/hide the map title if we are show/hiding the layer
                if (this.checked){
                    $('#pdp-pdb-map-title').show();
                }else{
                    $('#pdp-pdb-map-title').hide();
                }
                
                $(P.Pdb).trigger('pdp-pdb-layer-toggle', [ this.checked ]);
            });

            $('#pdp-map-layers-show-nyc').click(function() {
                // Show/hide the map title if we are show/hiding the layer
                if (this.checked){
                    $('#pdp-nychanis-map-title').show();
                }else{
                    $('#pdp-nychanis-map-title').hide();
                }            
                $(P.Nychanis).trigger('pdp-nyc-layer-toggle', [ this.checked ]);
            });
                        
            // We will display nychanis controls when we have data
            $(P.Nychanis).bind('pdp-data-response', _handleNychanisResponse);
            $(P.Pdb).bind('pdp-data-response', function() {
                // Always show the Pdb layer when a new search is done
                $('#pdp-map-layers-show-pdb').attr('checked', true);
                $('#pdp-pdb-map-title').show();
                $(P.Pdb).trigger('pdp-pdb-layer-toggle', true);
            });
                         
            // We will display nychanis controls when we have data
            $(P.Nychanis).bind('pdp-criteria-reset', function(){
                if (_$nychanisContainer){
                    _$nychanisContainer.hide();
                }
            });
        }); 
        
        var _addStaticLayers = Azavea.tryCatch('append static layers to map layer widget', function() {
            var $container = $('#pdp-map-layers-outlines');
            $('<label for="pdp-map-layers-outlines-select" class="pdp-map-layers-label">Municipal Boundaries</label>').appendTo($container);
            var $select = $('<select id="pdp-map-layers-outlines-select"/>').appendTo($container);
            // Now we have an empty select.  First add the "none" option:
            $('<option value="none">-- None --</option>').appendTo($select);
            // Now add the actual map options.
            $.each(P.Config.Outlines.Layers, function(name, layer) {
                $('<option value="' + name + '">' + layer.Name + '</option>').appendTo($select);
            });
            
            // Now add the event handling.
            $select.change(function() {
                $(_options.bindTo).trigger('pdp-map-outline-layer-changed', $select.val());
            });
        });       
        
        // Render the basic markup that this widget uses   
        var _render = Azavea.tryCatch('render map layer widget', function() {
            // We need a button and a panel, which holds elements
            $('<button id="pdp-map-layers" class="pdp-closable-panel-button pdp-shadow-drop">Legend</button>' + 
                '<div id="pdp-map-layers-panel" class="pdp-closable-panel pdp-shadow-drop">' + 
                    '<div id="pdp-map-layers-panel-buttonset" class="pdp-map-layers-section">' +
                        '<input id="pdp-map-layers-street" name="pdp-map-layers-buttons" class="pdp-map-layer-button" value="Street" type="radio" checked="checked"/>' +
                        '<label for="pdp-map-layers-street">Street</label>' +
                        '<input id="pdp-map-layers-hybrid" name="pdp-map-layers-buttons" class="pdp-map-layer-button" value="Hybrid" type="radio"/>' +
                        '<label for="pdp-map-layers-hybrid">Hybrid</label>' +
                        '<input id="pdp-map-layers-sat" name="pdp-map-layers-buttons" class="pdp-map-layer-button" value="Satellite" type="radio"/>' +
                        '<label for="pdp-map-layers-sat">Satellite</label>' +
                        '<input id="pdp-map-layers-terrain" name="pdp-map-layers-buttons" class="pdp-map-layer-button" value="Terrain" type="radio"/>' +
                        '<label for="pdp-map-layers-terrain">Terrain</label>' +
                    '</div>' +
                    '<div id="pdp-map-layers-outlines" class="pdp-map-layers-section"/>' +
                    '<div  class="pdp-map-layers-section"><input id="pdp-map-layers-show-pdb" type="checkbox" checked="checked" class="pdp-input"/>' +
                        '<span id="pdp-pdb-map-layers-help" class="pdp-map-marker-aggregated-label" title="Property results are shown in groupings when many properties are near one another.  The number indicates how many properties are represented.">?</span><label for="pdp-map-layers-show-pdb" class="pdp-map-layers-label">Housing (SHIP) Results</label></div>' +
                    '<div id="pdp-nychanis-results-container" class="pdp-map-layers-section">' + 
                        '<div class="pdp-map-layers-header"><input id="pdp-map-layers-show-nyc" type="checkbox" checked="checked" class="pdp-input"/>' +
                            '<label for="pdp-map-layers-show-nyc" class="pdp-map-layers-label">Neighborhood Info Results</label>' + 
                        '</div>' +
                        '<div class="pdp-map-layers-content"><label id="pdp-map-layers-year-value"></label>' + 
                            '<div id="pdp-map-layers-year-slider"></div>' + 
                            '<label class="pdp-map-layers-header">Legend</label>' +
                            '<div id="pdp-nychanis-legend-container"></div>' +
                        '</div>' +
                     '</div>' +
                '</div>').appendTo(_options.target);
              
            $('#pdp-pdb-map-layers-help').tooltip({
                tipClass: 'pdp-pdb-control-tooltip-left pdp-map-layers-tooltip',
                
	            // place tooltip on the right edge
	            position: 'center left',

	            // use the built-in fadeIn/fadeOut effect
	            effect: "fade"
            });
                
            // Set default state and get vars for common selectors
            _$button = $('#pdp-map-layers').button();
            _$panel = $('#pdp-map-layers-panel').hide();
            _$layerButtons = $('#pdp-map-layers-panel-buttonset').buttonset(); 
            $timeLabel = $('#pdp-map-layers-year-value');   
            _$nychanisContainer = $('#pdp-nychanis-results-container');                    
            $timeSlider = $('#pdp-map-layers-year-slider').slider({
                range: false,
                disabled: true,
                min: 1975,
                max: 2010,
                value: 2000,
                slide: function(event, ui) {
			        if (_availableTimes[ui.value]) {
			            _sliderMoved(ui.value);
			        } else {
			        return false;
                    }
                },
                change: function(event, ui){
                    _sliderChanged(ui.value);
                }
            });
            
            _addStaticLayers();
        });
        
        // Initiate the widget    
        _self.init = Azavea.tryCatch('init map layer selector widget', function() {
            
            // Render controls
            _render();

            // Bind events to our elements
            _bindEvents();
                        
            return _self;
        });
        return _self;
    };
}(PDP));

/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-map-layers.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-map-geocode.js ********************/
(function(P) {
    P.Widget.Map.Geocode = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'maplayer',
                bindTo: P
            }, options),
            _$button,
            _$geocodeInput,
            _$submitButton,
            _$geocodeFailure,
            _$resultsContainer,
            _$resultsList,
            _$panel,
            _nycBounds, 
            _geocoder;

       // When a new base layer is selected, trigger an event to tell the map                               
        var _zoomTo = Azavea.tryCatch('successful geocode', function(resultGeom) {
            $(_options.bindTo).trigger('pdp-map-zoom-to',
                [resultGeom.viewport.getSouthWest().lng(), resultGeom.viewport.getSouthWest().lat(), 
                 resultGeom.viewport.getNorthEast().lng(), resultGeom.viewport.getNorthEast().lat(),
                 resultGeom.location.lng(), resultGeom.location.lat()]);
            _togglePanel();
        });

        // Stops events from going to the map.                             
        var _stopPropagation = Azavea.tryCatch('panel mousedown', function(event) {            
            // We don't want click events passing through to the map layer underneath
            event.stopPropagation();
        });
        
        // Show or hide the panel                              
        var _togglePanel = Azavea.tryCatch('toggle map layer panel', function(event) {            
            // Change panel state.  It might seem like you should hide the closable-panel once, 
            //  outside of the if, but then you could never hide the map layer panel.  Do it seperately.
            if (_$panel.is(':visible')){
                // Hide any panels
                $('.pdp-closable-panel').hide();
                
            }else{
                
                // Also clear the failure messages and the value in the text box, since they're
                // left over from last time.
                _$geocodeInput.val('');
                _$geocodeFailure.hide();
                _$resultsContainer.hide();
                
                $('.pdp-closable-panel').hide();
                _$panel.show();
                
                // When the panel becomes visible, focus should jump to the text box.  This has to be
                //  after the show()
                _$geocodeInput.focus();
            }

        });
        

        
        var _geocode = Azavea.tryCatch('geocode an input', function() {
            // Do all this google stuff in a try block so we can still run the app if google is down
            try{
                // This is a bounding box (in lat/lon) that will "bias" the results toward NYC.
                if(!_nycBounds){
                    _nycBounds = new google.maps.LatLngBounds(new google.maps.LatLng(40.496, -74.257),new google.maps.LatLng(40.916, -73.699));
                }
                if (!_geocoder){
                    _geocoder = new google.maps.Geocoder();
                }
            
                var text = _$geocodeInput.val();
                if (text === 'asteroids') {
                    // Whee!
                    var s = document.createElement('script');
                    s.type='text/javascript';
                    document.body.appendChild(s);
                    s.src='http://erkie.github.com/asteroids.min.js';
                    _$geocodeInput.val('Thanks to Erik Rothoff Andersson!');
                } else {
                    // When we attempt a geocode, we start by clearing all the old results, errors, etc.
                    _$resultsContainer.hide();
                    _$geocodeFailure.hide();
                    if (text) {
                        var geocodeParams = {
                                address: text,
                                bounds: _nycBounds
                            };
                        _geocoder.geocode(geocodeParams, _processGeocodeResults);
                    }
                }
            }
            catch(err){
                // Tell the user we cannot geocode at the moment
                P.Util.quickAlert('Go To Location is temporarily unavailable.');
            }
            
        });
        
        var _processGeocodeResults = Azavea.tryCatch('process geocode results', function(results, status) {
            // Check that we got a good result or results back.
            if ((status === google.maps.GeocoderStatus.OK) && results && (results.length > 0)) {
                if (results.length === 1) {
                    // When there's only one, we want to zoom straight there.
                    _zoomTo(results[0].geometry);
                } else {
                    // Give the user a list of results to choose from.
                    _$resultsList.empty();
                    $.each(results, function (i, result) {
                        $('<li><a href="javascript:void(0);">' + result.formatted_address + '</a></li>').appendTo(_$resultsList).click(function() {
                            _zoomTo(result.geometry);
                        });
                    });
                    _$resultsContainer.show();
                }
                _$geocodeInput.val('');
            } else {
                _$geocodeFailure.show();
            }
        });


        // Bind to events that this widget cares about                                
        var _bindEvents = Azavea.tryCatch('bind map layer events', function() {
            _$button.click(_togglePanel);
            _$button.mousedown(_stopPropagation)
                    .dblclick(_stopPropagation);
            _$panel.mousedown(_stopPropagation)
                    .dblclick(_stopPropagation);
            _$submitButton.click(_geocode);
            // Enable form submission by hitting "enter" (keycode = 13) in form
            _$geocodeInput.keyup(function(event){
                if (event.which === 13){
                    _$submitButton.click();
                }
            });
        }); 
        
        // Render the basic markup that this widget uses   
        var _render = Azavea.tryCatch('render map geocode widget', function() {
            // We need a button and a panel, which holds elements
            $('<button id="pdp-map-geocode" class="pdp-closable-panel-button pdp-shadow-drop">Go To</button>' + 
                '<div id="pdp-map-geocode-panel" class="pdp-closable-panel pdp-shadow-drop">' + 
                    '<div id="pdp-map-geocode-panel-search" class="pdp-map-geocode-section">' +
                        '<label for="pdp-map-geocode-input">Address / Intersection / Place Name</label>' +
                        '<input id="pdp-map-geocode-input" type="text"/>' +
                        '<button id="pdp-map-geocode-submit" class="pdp-button">Go</button>' +
                    '</div>' +
                    '<div id="pdp-map-geocode-failure" class="ui-state-error ui-corner-all">Unable to find that location.</div>' +
                    '<div id="pdp-map-geocode-results-container" class="pdp-map-geocode-section">' + 
                        '<div id="pdp-map-geocode-results-header">Did you mean:</div>' +
                        '<ul id="pdp-map-geocode-results-content"/>' + 
                    '</div>' +
                '</div>').appendTo(_options.target);
                
            // Set default state and get vars for common selectors
            _$geocodeInput = $('#pdp-map-geocode-input');
            _$geocodeFailure = $('#pdp-map-geocode-failure');
            _$submitButton = $('#pdp-map-geocode-submit').button();
            _$resultsContainer = $('#pdp-map-geocode-results-container');
            _$resultsList = $('#pdp-map-geocode-results-content');
            _$button = $('#pdp-map-geocode').button();
            _$panel = $('#pdp-map-geocode-panel').hide();
        });
        
        // Initiate the widget    
        _self.init = Azavea.tryCatch('init map geocoder widget', function() {
            
            // Render controls
            _render();

            // Bind events to our elements
            _bindEvents();
                        
            return _self;
        });
        return _self;
    };
}(PDP));

/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-map-geocode.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-pdb-aggregations.js ********************/
(function(P) {
    P.Widget.PdbAggregations = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P.Pdb
            }, options),
            _groupBys = [],
            _groupBysDesc = [],
            _$countsPanel;

        //Update the context list (under the button) of selected group by columns
        var _setGroupByList = Azavea.tryCatch('update group by list', function($target) {
            _groupBys = [];
            _groupBysDesc = [];
            $('input:checked', '#pdp-pdb-search-counts-panel-cols').each(function(i, el) {
                _groupBys.push($(el).attr('id'));
                _groupBysDesc.push(el.value);
            });
        });
        
        var _focusDetails = Azavea.tryCatch('focus details', function() {
            $('#pdp-pdb-search-counts').slideUp();
            _$countsPanel.hide();
            
            // Take away the group by criteria, so we can search by details
            $(_options.bindTo).trigger('pdp-pdb-aggregations-change', [[], false]);
            
            // Enable the search button, search at anytime for property details
            $('#pdp-pdb-button-search').button('enable');
        });
        
        var _focusCounts = Azavea.tryCatch('focus counts', function() {
            var $statusMsg = $('#pdp-pdb-search-counts');
            if (!$statusMsg.is(':visible')) {
                $statusMsg.slideDown();
            }
            
            //Show counts panel
            if (_$countsPanel.is(':visible')) {
                _$countsPanel.hide();
            } else {
                _$countsPanel.show();
            }
                               
            // Bring back the possible groupbys selected before a search by details
            $(_options.bindTo).trigger('pdp-pdb-aggregations-change', [ _groupBys, true ]);
        });
        
        var _bindEvents = Azavea.tryCatch('bind pdb aggregation events', function(){
            // Show the counts panel
            $(_options.bindTo).bind('pdp-show-counts-panel', function(event) {
                $('label[for="pdp-pdb-search-result-counts"]').click();
                _$countsPanel.show();
            });
            
            //Reset the criteria
            $(_options.bindTo).bind('pdp-criteria-reset', function(event) {
                $('input:checked', '#pdp-pdb-search-counts-panel-cols')
                    .attr('checked', '')
                    .removeAttr('disabled')
                    .change();
            });
            
            //Turn the radio buttons into a buttonset
            $('#pdp-pdb-search-result-type').buttonset();
            
            //Toggle list view vs aggregation view
            $('label[for="pdp-pdb-search-result-details"]')
                .click(_focusDetails);
            
            //Show the group by panel when counts is selected
            $('label[for="pdp-pdb-search-result-counts"]')
                .click(_focusCounts);

            //Show the panel when the "change" link is clicked
            $('#pdp-pdb-search-counts-change').click(function(){
                if (!_$countsPanel.is(':visible')) {
                    _$countsPanel.show();
                } else {
                    _$countsPanel.hide();
                }
            });
            
            //Close the panel when the X is clicked
            $('#pdp-pdb-search-counts-panel-close').click(function(event) {
                _$countsPanel.hide();
            });
            
            //These windows are weird so we're handing the mutual exclusivity manually
            $(document).bind('mouseup', function(event){
                if (!$(event.target).is('#pdp-pdb-search-counts-change') && 
                    $(event.target).closest('#pdp-pdb-search-counts-panel').length === 0) {
                    _$countsPanel.hide();
                }
            });
            
            //Update everything when a checkbox is checked
            $('input', '#pdp-pdb-search-counts-panel-cols').change(function(event) {
                _setGroupByList();
                
                $(_options.bindTo).trigger('pdp-pdb-aggregations-change', [ _groupBys, true ]);
                
                var $groupByList = $('#pdp-pdb-search-counts-cols > strong');
                if (_groupBys.length) {
                    $groupByList.text(_groupBysDesc.join(', '));
                } else {
                    $groupByList.text('none selected');
                }
                
                if (_groupBys.length >= 3) {
                    $('input:not(:checked)', '#pdp-pdb-search-counts-panel-cols').attr('disabled', 'disabled');
                } else {
                    $('input:not(:checked)', '#pdp-pdb-search-counts-panel-cols').removeAttr('disabled');
                }
            });
        });

        //Render the buttons and the panel
        var _render = Azavea.tryCatch('render pdb counts panel', function(data) {
            var _renderCountsAttrs = Azavea.tryCatch('render pdb counts attrs', function(data, $target) {
                $.each(data, function(i, obj) {
                    if (obj.Attrs) {
                        //This is a cat description
                        var $cat = $('<li rel="' + obj.Order + '"><div class="pdb-pdb-search-counts-category"><label class="pdb-pdb-search-counts-category-label">'+obj.Name+'</label></div>' + 
                            '<ul class="pdp-pdb-search-counts-category"></ul></li>');//.appendTo($target);
                        var prevNumber = parseInt(obj.Order, 10) - 1;
                        var $previousOrderedElement = $target.children('li[rel="' + prevNumber.toString() + '"]');
                        if ($previousOrderedElement.length){
                            // Insert this on the DOM after the found element
                            $cat.insertAfter($previousOrderedElement);                         
                        } else {
                             // Nothing to order with, just append to the end
                            $cat.appendTo($target);  
                        }
                        
                        // Render top level controls
                        _renderCountsAttrs(obj.Attrs, $cat.children('ul.pdp-pdb-search-counts-category'));
                        
                        // Render sub cats
                        if (obj.SubCats && obj.SubCats.length) {
                            _renderCountsAttrs(obj.SubCats, $('ul.pdp-pdb-search-counts-category', $cat));
                        }                        
                    } else {
                        // This is a criteria attribute
                        if (obj.CanGroup) {
                            // Test out renderer
                            $('<li rel="' + obj.CategoryOrder + '"><input type="checkbox" id="'+obj.UID+'" value="' + obj.Name + '"/><label for="'+obj.UID+'" class="pdp-pdb-column-label">'+obj.QueryName+'</label></li>').appendTo($target);
                        }
                    }    
                });
            });
            
            $('<div id="pdp-pdb-search-result-type">'+
                '<input type="radio" id="pdp-pdb-search-result-details" name="pdp-pdb-search-result-type" checked="checked" /><label for="pdp-pdb-search-result-details">Details</label>' + 
		        '<input type="radio" id="pdp-pdb-search-result-counts" name="pdp-pdb-search-result-type" /><label for="pdp-pdb-search-result-counts">Counts</label>' + 
            '</div>' + 
            '<div id="pdp-pdb-search-counts">' +
                '<div id="pdp-pdb-search-counts-cols">Count data by (<strong>none selected</strong>)</div>' +
                '<a id="pdp-pdb-search-counts-change" href="javascript:void(0);">(change)</a>' +
            '</div>' +
            '<div id="pdp-pdb-search-counts-container" class="pdp-shadow-drop ui-corner-all">' +
                '<div id="pdp-pdb-search-counts-panel">' + 
                    '<div id="pdp-pdb-search-counts-panel-content">' +
                        '<div id="pdp-pdb-search-counts-panel-close"><span class="ui-icon ui-icon-circle-close"></span></div>' +
                        '<p id="pdp-pdb-search-counts-caption" class="ui-corner-all ui-widget-content">Choose 1, 2 or 3 characteristics to group your filtered property results.</p>' + 
                        '<ul id="pdp-pdb-search-counts-panel-cols"></ul>' + 
                    '</div>' + 
                '</div>' +
            '</div>').appendTo(_options.target);
            
            _renderCountsAttrs(data, $('#pdp-pdb-search-counts-panel-cols'));
            
            //Remove empty categories
            $('ul.pdp-pdb-search-counts-category:empty').parent().remove();
            
            _$countsPanel = $('#pdp-pdb-search-counts-container');
        });

        _self.init = Azavea.tryCatch('init pdb aggregations', function() {
            $(_options.bindTo).bind('pdp-pdb-attributes', function(event, attrResp) {
                _render(attrResp.List);
                _bindEvents();
            });
        
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-pdb-aggregations.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-pdb-criteria.js ********************/
(function(P) {
    P.Widget.PdbCriteria = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P.Pdb
            }, options),
            _flatAttrGroups = {},
            _criteria = [];

        // Flatten attribute cats to be keyed by the attribute with an value of each parent
        // cat.  Ie. { 'LIHTCStatus': ['LIHTC Details', 'Subsidy Information'], ... }
        var _flattenAttrGroups = Azavea.tryCatch('flatten attr cats', function(attrGroups) {
            $.each(attrGroups, function(i, obj) {
                if (obj.Attrs) {
                    $.each(obj.Attrs, function(j, attr) {
                        _flatAttrGroups[attr.UID] = [ attr.Category ];
                        
                        if (attr.SubCat) {
                            _flatAttrGroups[attr.UID].push(attr.SubCat);
                        }
                    });
                
                    // Flatten sub cats
                    if (obj.SubCats && obj.SubCats.length) {
                        _flattenAttrGroups(obj.SubCats);
                    }
                }    
            });
        });
        
        // Update the UI with the necessary indicators to show that controls are active or not.
        var _updateCriteriaUi = Azavea.tryCatch('update property criteria ui', function() {
            var groupCounts = {};
            // For each active criteria
            $.each(_criteria, function(i, crit) {
                // For each category for that criteria
                $.each(_flatAttrGroups[crit.attr], function(j, cat) {
                    // Count the number of active criteria
                    if (groupCounts[cat]) {
                        groupCounts[cat]++;
                    } else {
                        groupCounts[cat] = 1;
                    }
                });
                
                //Allow the controls to set the active class themselves.  Some of them need
                //some special control (like range)
            });
            
            //Activate the categories
            $('.pdp-pdb-search-category-header').removeClass('pdp-pdb-control-active');
            $('.pdp-pdb-search-active-count')
                .text('');
            $.each(groupCounts, function(name, count) {
                $('.pdp-pdb-search-category-header-label:contains("' + name + '")').parent('.pdp-pdb-search-category-header')
                    .addClass('pdp-pdb-control-active')
                    .find('.pdp-pdb-search-active-count')
                    .text(count);
            });
        });
        
        // Update the current criteria with new criteria. Handles removing falsely (non-zero)
        // values from the list, updating truthy values, and adding new ones.
        var _updateCriteriaCache = Azavea.tryCatch('update property criteria', function(newCrit) {
            var indexesToRemove =[],
                needToAdd = true;
                            
            // Loop through and mark to add, or mark for deletion if a new one should override an existing criteria
            if (_criteria && _criteria.length) {
                $.each(_criteria, function(i, curCrit) {
                    //Same attr and operator, and updating a crit with a particular value
                    if (curCrit.attr === newCrit.attr && curCrit.oper === newCrit.oper) {
                        // Must be truthy, zero and if truthy not be an array
                        if ((newCrit.val && !$.isArray(newCrit.val)) || newCrit.val === 0 || ( $.isArray(newCrit.val) && newCrit.val.length > 0 )) {
                            curCrit.val = newCrit.val;
                            needToAdd = false;
                        } else {
                            needToAdd = false;
                            indexesToRemove.push(i);
                        }
                    }
                });
            } else {
                // Only add if there is a value
                if (newCrit.val || newCrit.val === 0) {
                    _criteria.push(newCrit);
                    needToAdd = false;
                }
            }
            
            // If this criteria was not updating an existing criteria, nor removing one, add it now
            //  if it has a truthy value.
            if (needToAdd && (newCrit.val || newCrit.val === 0)){
                _criteria.push(newCrit);
            }
            
            // Remove the indexes in reverse order, so the array indexes don't change as we splice
            var i;
            for(i=indexesToRemove.length -1; i>-1; i--) {
                _criteria.splice(indexesToRemove[i], 1);
            }
        });
        
        //Hides the subcategories if a parent category is hidden - we don't want any orphans.
        var _hideLevel = Azavea.tryCatch('hide levels', function(level) {
            var i, $level, $levelUp;
            for(i=2; i>=level; i--) {
                
                // Hide the panel and remove the transparent layer
                $level = $('#pdp-pdb-search-level-' + i);
                $level
                    .hide()
                    .find('.pdp-pdb-search-transparency').remove();
                
                // Remove any active states from yourself and your ancestor    
                $('.pdp-pdb-search-category-header-viewing', $level).removeClass('pdp-pdb-search-category-header-viewing');
                
                // These crazy numbers mean: if we are hiding anything but level2, on anything but the second time around (ie, the main panel) clear it.
                //  Unless we are on the first time around of a level 2 close (which means, hide the level 1 class).
                if ((level !== 2 && i !== 2) || (level === 2 && i === 2)) {
                    $('.pdp-pdb-search-category-header-viewing', '#pdp-pdb-search-level-' + (i - 1)).removeClass('pdp-pdb-search-category-header-viewing');
                }
                
                // Hide the actual list
                $('ul', '#pdp-pdb-search-level-' + i).hide();
            }
        });
        
        // Updates the size of $trans, based off of properties on $subcat
        var _updateTransparentLayerSize = Azavea.tryCatch('update size of transparent layer', function($subcat, $caption, $trans){
            var i, h=0;
            
            // There may be multiple subcat items, add up the cumulative height
            $subcat.each(function(i, sub){
                h+= $(sub).outerHeight(true);
            });
            
            // Account for our caption
            h+= $caption.outerHeight(true);
            
            // Set the positioning and size of the flyout, based off subcats
            //  height + 1 is a magic number, need one more pixel at the bottom for it to really match
            $trans.height(h + 1);
            $trans.width($subcat.width());
            pos = $subcat.position();
            $trans.css({left: pos.left, top: 0});
                  
        });
        
        //Bind criteria events
        var _bindEvents = Azavea.tryCatch('bind pdb-search events', function($content) {
            
            //A control value changed - update the cache and the UI
            $(_options.bindTo).bind('pdp-pdb-control-change', function(event, newCritArray) {
                // each crit object looks like this: { a:'attrId', o:'operator', v:'value' }
                $.each(newCritArray, function(i, crit) {
                    _updateCriteriaCache(crit);
                    _updateCriteriaUi();
                });
                
                //Trigger a criteria change event
                $(_options.bindTo).trigger('pdp-pdb-criteria-change', [ _criteria ]);
            });
            
            //Someone clicked on a category header. Close other panels and open this one.
            $('.pdp-pdb-search-category-header', $content).click(function(event) {
                var catName = $('label', this).text(),
                    $subcat = $('ul[rel="'+catName+'"]'),
                    $parent,
                    level = parseInt($subcat.parents('.pdp-pdb-search-level').attr('rel'), 10),
                    $trans,
                    $caption,
                    pos,
                    $this = $(this);
                
                if ($subcat.is(':visible')) {
                    //This is the second click. Make it go away.
                    _hideLevel(level);
                } else {
                    //Hide sibling subcategories
                    _hideLevel(level);
                    
                    //Show the new one
                    $parent = $subcat.parents('.pdp-pdb-search-level').show();
                    $subcat.show();
                    
                    // Add the caption to the subcat window
                    $('.pdp-pdb-search-category-title', $parent).text(catName);
                    
                    // The parent should remain active looking while it's children are displayed.
                    // Remove any "viewing" classes from this category's parents, siblings children (ie, other category panels)
                    $this.parent().siblings().children().removeClass('pdp-pdb-search-category-header-viewing');
                    $this.addClass('pdp-pdb-search-category-header-viewing');
                    
                    // Everything is rendered, we now need to place our transparency div under the container
                    $trans = $('<div class="pdp-pdb-search-transparency"></div>');
                    $caption = $('div.pdp-pdb-search-category-top', $parent);
                    
                    // When it resizes, we need to update the dimensions of the trans layer
                    $(_options.bindTo).bind('pdp-pdb-control-change', function(event){
                        _updateTransparentLayerSize($subcat, $caption, $trans);
                    });
                    
                    _updateTransparentLayerSize($subcat, $caption, $trans);
                    $trans.appendTo($parent); 
                }
            });
            
            $(P).bind('pdp-panel-close-event', function(){
                // Remove any highlights from category headers when a panel is closed by our closer widget
                $('.pdp-pdb-search-category-header-viewing', '#pdp-pdb-search-level-container').removeClass('pdp-pdb-search-category-header-viewing');
            });
            
            $('.pdp-pdb-search-category-close').click(function(event) {
                var level = parseInt($(this).parent().parent('.pdp-pdb-search-level').attr('rel'), 10);
                _hideLevel(level);
            });
            
            $(_options.bindTo).bind('pdp-criteria-reset', function(event) {
                _criteria = [];
                _updateCriteriaUi();
            });
        });

        
        var _renderAttributes = Azavea.tryCatch('render pdb attributes', function(data, level, parentName, orderedList) {
            var $container, isSubcat;
            
            if (data.length) {
                $container = $('[rel="'+parentName+'"]');
                //Make the container if it doesn't already exist
                if ($container.length === 0) {
                    $container = $('<ul rel="'+ (parentName || '') +'"></ul>').appendTo('#pdp-pdb-search-level-' + level);
                }
                
                //Add category labels and containers for the next level
                $.each(data, function(i, cat) {
                    // Create an array for everything that will get listed on this panel, it will be as big as
                    // the number of attributes + the number of sub cats.  
                    if (!orderedList) {
                        var size = cat.Attrs.length;
                        if (cat.SubCats && cat.SubCats.length) {
                            size += cat.SubCats.length;
                        }
                        orderedList = [];
                        orderedList.length = size;
                        isSubcat = false;
                    } else {
                        // We are in a subcategory if an ordered list was passed in
                        isSubcat = true;
                    }
                    
                                                    
                    var $header = $('<li><div class="pdp-pdb-search-category-header"><span class="pdp-pdb-search-arrow ui-icon ui-icon-play right"></span>' +
                         '<span class="pdp-pdb-search-active-count right"></span>' + 
                        '<label class="pdp-pdb-search-category-header-label">'+cat.Name+'</label></div></li>');
                    if (isSubcat) {
                        orderedList[parseInt(cat.Order, 10) - 1] = {li: $header, target: $container};
                    } else {    
                        $header.appendTo($container);
                    }
                
                    if(cat.SubCats && cat.SubCats.length) {
                        _renderAttributes(cat.SubCats, 1, cat.Name, orderedList);
                    }
                
                    var $subContainer = $('<ul rel="'+ (cat.Name || '') +'" class="pdp-shadow-drop"></ul>').appendTo('#pdp-pdb-search-level-' + (level+1));
                    $.each(cat.Attrs, function(i, attr) {
                        var $widget;
                        if (attr.CanQuery) {
                            // Test out renderer
                            if (P.Widget.PdbControls[attr.UiType]) {
                                $widget = $('<li></li>');//.appendTo($subContainer);
                                if (P.Widget.PdbControls[attr.UiType]){
                                    P.Widget.PdbControls[attr.UiType]($widget, attr);
                                    if (isSubcat){
                                        // A subcategory attribute gets rendered right away
                                        $widget.appendTo($subContainer);
                                    } else {
                                        // Add this control to our ordered list
                                        orderedList[parseInt(attr.CategoryOrder, 10) - 1] = {li: $widget, target: $subContainer};
                                    }
                                }
                                else {
                                    // There is no renderer for this type of control.
                                    Azavea.log('No control renderer defined for: [' + attr.UiType + '].  Control [' + attr.UID + '] was not rendered!');
                                }
                            }
                        }
                    });
                    
                    if (!isSubcat){
                        // We now have an ordered list, render it to the screen
                        $.each(orderedList, function(i, item){
                            // Append each item to the container it belongs to
                            if (item){
                                item.li.appendTo($subContainer);
                            }
                        });
                        
                        // Clear our sortedList, we're done with this one
                        orderedList = null;
                    }
                    
                    
                });
                
            }
        });
        
        //Render placeholders to the target
        var _render = Azavea.tryCatch('render pdb criteria', function() {
            $('<div id="pdp-pdb-search-level-container" class="pdp-closable-panel-button">' + 
                '<div id="pdp-pdb-search-level-0" rel="0" class="pdp-pdb-search-level"><span class="pdp-pdb-search-category-close ui-icon ui-icon-circle-close"></span></div>' + 
                '<div id="pdp-pdb-search-level-1" rel="1" class="pdp-pdb-search-level pdp-closable-panel"><div class="pdp-pdb-search-category-top ui-state-default"><span class="pdp-pdb-search-category-close ui-icon ui-icon-circle-close right"></span><label class="pdp-pdb-search-category-title"></label></div></div>' + 
                '<div id="pdp-pdb-search-level-2" rel="2" class="pdp-pdb-search-level pdp-closable-panel"><div class="pdp-pdb-search-category-top ui-state-default"><span class="pdp-pdb-search-category-close ui-icon ui-icon-circle-close right"></span><label class="pdp-pdb-search-category-title"></label></div></div>' + 
            '</div>')
                .appendTo(_options.target);
            
            //Build the criteria panel
            _renderAttributes(_attributes, 0);
            
            // After all controls are rendered, apply an event to submit the search on enter
            //  We want keyUP because the control may have yet to complete its change event to update
            //  criteria
            $('.pdp-pdb-search-level input, .pdp-pdb-search-level select').keyup(function(event){
                if (event.keyCode === 13){
                    $(_options.bindTo).trigger('pdp-data-force-update');
                    
                    // Close any panels
                    $('.pdp-closable-panel').hide();
                }
            });
                
            $('.pdp-pdb-control-label-help').tooltip({
                tipClass: 'pdp-pdb-control-tooltip',
                
	            // place tooltip on the right edge
	            position: 'center right',

	            // a little tweaking of the position
	            offset: [-2, 10],

	            // use the built-in fadeIn/fadeOut effect
	            effect: "fade"
            });
        });
            
        _self.init = Azavea.tryCatch('init pdb criteria', function() {
            $(_options.bindTo).bind('pdp-pdb-attributes', function(event, attrResp) {
                try {
                    _attributes = attrResp.List;
                    _flattenAttrGroups(_attributes);
                    _render();
                    _bindEvents();
                }
                finally {
                    // Stop the loading indicator
                    $(_options.bindTo).trigger('pdp-loading-finished');
                }
            });

            return _self;
        });
        
        return _self;
    };
}(PDP));

/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-pdb-criteria.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-nychanis-indicator.js ********************/
(function(P) {
    P.Widget.NychanisIndicator = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P.Nychanis
            }, options),
            _state = {},
            _curMetadata={},
            _indicatorsById ={},
            $indicator ={},
            $category ={},
            $subCategory ={},
            $indicatorTip,
            $indContainer,
            $subContainer,
            $catContainer;

        // Trigger the event for this widget's state
        var _triggerChange = Azavea.tryCatch('trigger indicator change', function() {
            $(_options.bindTo).trigger('pdp-nychanis-indicator-change', [ _state ]);
        });

        // Update the current state object, trigger the event
        var _updateState = Azavea.tryCatch('trigger indicator change', function(indicator) {

            // Make the indicator object available, it has resolution and time types on it
            if (indicator || indicator === 0){
                _state = _indicatorsById[indicator];
                // Show the ? image specific to this indicator
                if ($indicatorTip){
                    $indicatorTip.remove();
                }
                
                // Hide the default tooltip
                $indicatorDefaultTip.hide();
                
                $indicatorTip = $('<span id="pdp-nyc-indicator-help" class="ui-icon ui-icon-help pdp-nyc-control-label-help"></span>').appendTo($indContainer);
                
                // Set up the tooltip component.  You need to do it this way because the tooltip widget
                // will cache the title, even if you update the title of the element later.  You need to 
                // recreate the entire span element each time it changes.
                $indicatorTip
                    .attr('title', _state.Description)
                    .tooltip({
                        tipClass: 'pdp-pdb-control-tooltip',
                        
                        // place tooltip on the right edge
                        position: 'center right',

                        // a little tweaking of the position
                        offset: [-2, 10],

                        // use the built-in fadeIn/fadeOut effect
                        effect: "fade"
                    });
            } else {
                if ($indicatorTip) {
                    $indicatorTip.remove();
                }
                
                // Show the default tooltip
                $indicatorDefaultTip.show();
                
                _state = {};
            }
            
            // Tell whomever about our current state
            _triggerChange();     
        });
        
        // Generic method for populating indicator select options
        var _renderSelectOptions = Azavea.tryCatch('create select options', function(title, items, target, valueProperty){
            var indOptions = '<option id="" value="" selected=selected>- - ' + title + '- -</option>',
                $target;
            
            $.each(items, function(i, item){
                var val = valueProperty ? item[valueProperty] : i;
                indOptions += '<option value="' + val + '" title="' + item.Name + '">' + item.Name + '</option>';
            });
            
            $target = $(target);
            
            // A bug in IE prevents new options from being loaded, clear them from the screen manually.
            $target[0].options.length = 0;
            
            // Empty and add the new options
            $target.empty().append(indOptions);
        });
        
        // Indicator Category has changed, update UI and State
        var _indCatChanged = Azavea.tryCatch('indicator category changed', function() {
            
            if (this.value || this.value === 0){
                // Create our subcategory dropdown, make sure indicator is still hidden
                _renderSelectOptions('Subcategory', _curMetadata.IndCats[this.value].SubCats, '#pdp-nyc-indicator-sub-category');
                $subContainer.show();
                $indicator.empty();
                $indContainer.hide();
            }else{
                // Default category, hide the sub and ind
                $subContainer.hide();
                $indicator.empty();
                $indContainer.hide();      
            }
            _updateState($indicator.val());            
        });

        // Indicator SubCategory has changed, update UI and State
        var _indSubCatChanged = Azavea.tryCatch('indicator sub category changed', function() {
            if (this.value || this.value === 0){
                // Create our indicator dropdown, make sure indicator is still hidden
                var cat = $category.val(),
                    subCat = this.value;
                
                _renderSelectOptions('Must Choose an Indicator', _curMetadata.IndCats[cat].SubCats[subCat].Indicators, '#pdp-nyc-indicator', "UID");
                $indContainer.show();
            }else{
                // Default category, hide the ind
                $indicator.empty();
                $indContainer.hide();            
            }     
                            
            _updateState($indicator.val());
        });
        
        // Indicator has changed, update state
        var _indChanged = Azavea.tryCatch('indicator changed', function() {
            // We have our indicator
            _updateState(this.value);           
        });
        
        // Reset widget to default state
        var _resetIndicators = Azavea.tryCatch('reset indicator values', function(){
            
            // Hide Sub Cat and indicator
            if ($subCategory) {
                $subContainer.hide();
                $subCategory.empty();
            }
            if ($indicator) {
                $indicator.empty();
                $indContainer.hide();
            }
                        
            // Select default category
            $category.attr('selectedIndex', 0);

            // Make sure state is blanked out
            _state = {};
        });
        
        // Bind to events that this widget cares about
        var _bindEvents = Azavea.tryCatch('bind nychanis indicator events', function() {
            // Setup Category dropdown
            $category.change(_indCatChanged);
            
            // Sub Cat
            $subCategory.change(_indSubCatChanged);
            
            // Indicator
            $indicator.change(_indChanged);
            
            $(_options.bindTo).bind('pdp-criteria-reset', _resetIndicators);
        });
               
        // Render the basic markup that this widget uses                        
        var _render = Azavea.tryCatch('render nychanis indicator', function() {
            $('<div id="pdp-nyc-container-cat" class="pdp-nyc-indicator-selector pdp-nyc-control"><select id="pdp-nyc-indicator-category"></select><span id="pdp-nyc-help-ind-cat" title="Indicators are grouped into categories. You must select one." class="ui-icon ui-icon-help pdp-nyc-control-label-help"></span></div>' + 
                    '<div id="pdp-nyc-container-sub" class="pdp-nyc-indicator-selector pdp-nyc-control"><select id="pdp-nyc-indicator-sub-category"></select><span id="pdp-nyc-help-ind-sub" title="Categories are divided into subcategories.  You must select one." class="ui-icon ui-icon-help pdp-nyc-control-label-help"></span></div>' + 
                    '<div id="pdp-nyc-container-ind" class="pdp-nyc-indicator-selector pdp-nyc-control"><select id="pdp-nyc-indicator"></select><span id="pdp-nyc-help-ind" title="You must choose an individual indicator to display on the map or table." class="ui-icon ui-icon-help pdp-nyc-control-label-help"></span></div>').appendTo(_options.target);
            
            // Render the categories immediately
            _renderSelectOptions('Category', _curMetadata.IndCats, '#pdp-nyc-indicator-category');
                        
        });
            
        // Initialize the widget            
        _self.init = Azavea.tryCatch('init nychanis indicator', function() {
            $(_options.bindTo).bind('pdp-nychanis-attributes', function(event, meta) {
                _curMetadata = meta;
                _render();
                
                // Local cache for these common selectors
                $category = $('#pdp-nyc-indicator-category');
                $subCategory = $('#pdp-nyc-indicator-sub-category');
                $indicator = $('#pdp-nyc-indicator');
                
                $indContainer = $('#pdp-nyc-container-ind');
                $subContainer = $('#pdp-nyc-container-sub');
                $catContainer = $('#pdp-nyc-container-cat');

                // Hide the div with the  ? 
                $subContainer.hide();
                $indContainer.hide();
                
//                // Enable the tooltips
//                $('.pdp-nyc-control-label-help').tooltip({
//                    tipClass: 'pdp-pdb-control-tooltip',
//                    
//                    // place tooltip on the right edge
//                    position: 'center right',

//                    // a little tweaking of the position
//                    offset: [-2, 10],

//                    // use the built-in fadeIn/fadeOut effect
//                    effect: "fade"
//                });
                
                // The default indicator tooltip will be swapped out when an actual indicator is selected
                $indicatorDefaultTip = $('#pdp-nyc-help-ind');
                
                _bindEvents();

                // Get a lookup for each indicator, by ID
                $.each(meta.IndCats, function(i, cat) {
                    $.each(cat.SubCats, function(i, subcat) {
                        $.each(subcat.Indicators, function(i, ind) {
                            _indicatorsById[ind.UID] = ind;
                        });
                    }); 
                });
            });
            return _self;
        });
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-nychanis-indicator.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-nychanis-resolution.js ********************/
(function(P) {
    P.Widget.NychanisResolution = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P.Nychanis
            }, options),
            _state = {
                resolutionName: '',
                resolution: '',
                scope: '',
                scopeName: '',
                subScope: '',
                subScopeName: ''
            }, 
            _curMetadata = {},
            _resolutionsById = {},
            _$resolution = {},
            _$scope = {},
            _$subScope = {},
            _boroughUID = -1,
            _subBoroughUID = -1;

        // Trigger the event for this widget's state
        var _triggerChange = Azavea.tryCatch('trigger resolution change', function() {
            $(_options.bindTo).trigger('pdp-nychanis-resolution-change', [ _state ]);
        });

        // Update the current state object, trigger the event
        var _updateState = Azavea.tryCatch('trigger indicator change', function(resolution, scope, subScope) {
            _state.resolutionName = _resolutionsById[resolution] ? _resolutionsById[resolution].Name : '';
            _state.resolution = resolution;
            _state.scope = scope;
            
            // Figure out the name of the scope, for tracking purposes
            if (scope){
                _state.scopeName = $('#pdp-nyc-scope :selected').text();
            } else if(_$scope && _$scope.is(':visible')) {
                // If there is no scope selected, but the input is visible, then they are searching for all
                _state.scopeName = 'All Boroughs';
            }else{
                _state.scopeName = '';
            }
            
            // Figure out the name of the subscope, for tracking purposes
            _state.subScope = subScope;  
            if (subScope){
                _state.subScopeName = $('#pdp-nyc-subscope :selected').text();
            } else if(_$subScope && _$subScope.is(':visible')) {
                // If there is no subscope selected, but the input is visible, then they are searching for all
                _state.subScopeName = 'All Sub Boroughs';
            }else{
                _state.subScopeName = '';
            }
            
            // Tell whomever about our current state
            _triggerChange();     
        });
        
        // Generic method for populating resolution select options
        var _renderSelectOptions = Azavea.tryCatch('create select options', function(title, items, target, valueProperty, restrictTo){
            var indOptions = '<option id="" value="" selected=selected>- - ' + title + '- -</option>';
            $.each(items, function(i, item){
                var val = valueProperty ? item[valueProperty] : i;
                
                if (!restrictTo || $.inArray(val, restrictTo) > -1){
                    indOptions += '<option value="' + val + '">' + item.Name + '</option>';
                }
            });
        
            $(target).empty().append(indOptions);
        });
        
        // Gets a list of subboroughs of a particular bourough
        var _getSubBoroughsOfBorough = Azavea.tryCatch('get subboroughs', function(borough){
            var subs = [];

            // Check each subborough and get a list of those that belong to this borough
            $.each(_resolutionsById[_subBoroughUID].Geographies, function(i, sub){
                if (sub.Borough === borough){
                    subs.push(sub);
                }
            });
            
            return subs;
        });
        
        // Reset widget to default state
        var _resetInputs = Azavea.tryCatch('reset resolution inputs', function() {
            // Clear our state
            _updateState('', '', '', '');
            
            // Re-render the controls to blank state
            _$scope.hide();
            _$subScope.hide();  
            _$resolution
                .attr('selectedIndex', 0)
                .attr('disabled', true);
        });        

        // Resolution has changed, update the state and UI
        var _resolutionChanged = Azavea.tryCatch('resolution change', function() {
            if (this.value || this.value === 0){
                // Create our subcategory dropdown, make sure indicator is still hidden
                if (_resolutionsById[parseInt(this.value, 10)].HasBoroughData){
                    _renderSelectOptions('All Boroughs', _resolutionsById[_boroughUID].Geographies , '#pdp-nyc-scope', 'Borough');
                                            
                    _$scope.show();
                    _$subScope.hide();
                } else {
                    // Default category, hide the sub and ind
                    _$scope.hide();
                    _$subScope.hide();     
                } 
             } else {
                _$scope.hide();
                _$subScope.hide();                 
             }
             
            // Announce our state change
            _updateState(this.value, '', '');            
        });  
        
        // Scope has changed, update the state and UI
        var _scopeChanged = Azavea.tryCatch('scope resolution change', function() {
            if ((this.value || this.value === 0) && (_state.resolution || _state.resolution === 0)){
                // Create our subcategory dropdown, make sure subscope is still hidden
                if (_resolutionsById[parseInt(_state.resolution, 10)].HasSubBoroughData){
                    _renderSelectOptions('All Sub Boroughs', _getSubBoroughsOfBorough(this.value) , '#pdp-nyc-subscope', 'SubBorough');                     
                    _$subScope.show();
                }else{
                    // No subscope, hide
                    _$subScope.hide();            
                }
             } else {
                // No subscope, hide
                _$subScope.hide();    
             }
                      
            // Announce our state change
            _updateState(_state.resolution, this.value, '');   
        });  
        
        // Subscope  has changed, update the state
        var _subscopeChanged = Azavea.tryCatch('subscope resolution change', function() {
            // Announce our state change
            _updateState(_state.resolution, _state.scope, this.value);             
        });  

        // Listen for the indicator changed event to fire, which tells this widget to become active
        var _indicatorChanged = Azavea.tryCatch('resolution indicator change', function(event, ind) {
            
            // Check that we have an actual indicator Id. 
            if (ind.AvailableYearsByResolution){
                // Get an array of the UIDs of the available resolutions for this indicator.
                var resolutions = [];
                $.each(ind.AvailableYearsByResolution, function (uid) {
                    resolutions.push(parseInt(uid, 10));
                });
                // Display resolution, ensure other controls must start over
                _renderSelectOptions('Select Geography Level', _curMetadata.Resolutions, '#pdp-nyc-resolution', 'UID', resolutions);
                
                _$scope.hide();
                _$subScope.hide();              
                _$resolution
                    .attr('selectedIndex', 0)
                    .removeAttr('disabled');                
            } else {
                _resetInputs();
            }
            
            // No resolution picked.
            _updateState('', '', '');
        });  

        // Bind to events that this widget cares about                                
        var _bindEvents = Azavea.tryCatch('bind nychanis resolution events', function() {
            
            // Listen for Indicator
            $(_options.bindTo).bind('pdp-nychanis-indicator-change', _indicatorChanged);
            
            // Listen for a reset command
            $(_options.bindTo).bind('pdp-criteria-reset', _resetInputs);
            
            // Setup Category dropdown
            _$resolution
                .attr('disabled', true)
                .change(_resolutionChanged);
            
            // Sub Cat
            $('#pdp-nyc-scope')
                .change(_scopeChanged)
                .parent();
                
            // Indicator
            $('#pdp-nyc-subscope')
                .change(_subscopeChanged)
                .parent();
                
        });

        // Render the basic markup that this widget uses   
        var _render = Azavea.tryCatch('render nychanis resolution', function() {
            $('<div id="pdp-nyc-resolution-container" class="pdp-nyc-control"><select id="pdp-nyc-resolution"><option val="">-- Select --</option></select><span id="pdp-nyc-help-res" title="You must choose a geographic level to calculate your indicator.  All indicators have data for the whole city and borough.  Community districts, police precincts, school districts, subborough areas and census tracts may be available as well." class="ui-icon ui-icon-help pdp-nyc-control-label-help"></span></div>' + 
              '<div id="pdp-nyc-scope-container" class="pdp-nyc-control"><label for"pdp-nyc-scope">But only those in</label><select id="pdp-nyc-scope"></select><span id="pdp-nyc-help-scope" title="You may choose to limit the neighborhoods on the map or table to a single borough." class="ui-icon ui-icon-help pdp-nyc-control-label-help"></span></div>' + 
              '<div id="pdp-nyc-subscope-container" class="pdp-nyc-control"><select id="pdp-nyc-subscope"></select><span id="pdp-nyc-help-subscope" title="You may choose to limit the census tracts displayed on the map or table to a single sub-borough area." class="ui-icon ui-icon-help pdp-nyc-control-label-help"></span></div>'
            ).appendTo(_options.target);
        });

         // Initialize the widget  
        _self.init = Azavea.tryCatch('init nychanis resolution', function() {
            $(_options.bindTo).bind('pdp-nychanis-attributes', function(event, meta) {
                _curMetadata = meta;
                _render();
                
                _$resolution = $('#pdp-nyc-resolution');
                _$scope = $('#pdp-nyc-scope-container').hide();
                _$subScope = $('#pdp-nyc-subscope-container').hide();
                                
                _bindEvents();
                
                // Get the list of resolutions by id so we can do lookups, cache the id of borough and subborough
                $.each(meta.Resolutions, function(i, res) {
                    if (res.Name === 'Borough'){
                        _boroughUID = res.UID;
                    }
                    else if(res.Name === 'Subborough Area'){
                        _subBoroughUID = res.UID;
                    }
                    _resolutionsById[res.UID] = res;
                    _resolutionsById[res.UID].GeogsByActualId = {};
                    $.each(res.Geographies, function(g, geog) {
                        _resolutionsById[res.UID].GeogsByActualId[geog.ActualId] = geog;
                    });
                                    
                });
            });
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-nychanis-resolution.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-nychanis-time.js ********************/
(function(P) {
    P.Widget.NychanisTime = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P.Nychanis
            }, options),
            _state = {
                type: '',
                typeName: '',
                minYear: '',
                maxYear: ''
            }, 
            _fields= [
                { id:'pdp-nyc-result-min', required:false, validator: 'number' },
                { id:'pdp-nyc-result-max', required:false, validator: 'number' }
            ],
            _curIndicator = {},
            _curTimeResponse = {},
            _timeTypeInputsById = {},
            _$range ={},
            _$details = {},
            _$minYear,
            _$maxYear,
            _$timeSelector = {},
            _$timeTypes = {},
            _availableYears,
            _resId;
            
        
        //Helper to determine if a year is in a gap
        var _isGapYear = Azavea.tryCatch('is year in gap', function(year) {
            var i;
            for(i=0; i<_availableYears.length; i++) {
                if (year === _availableYears[i]) {
                    return false;
                }
            }
            
            return true;
        });
        
        //Function to change the min/max year input value and do a smart highlight 
        var _changeYearInputVal = Azavea.tryCatch('change year input', function($input, val) {
            $input.val(val);
            
            var timeoutId = $input.data('highlightTimeout');
            //Clear the last timeout, if applicable, then set a new one
            if (timeoutId) {
                clearTimeout(timeoutId);
            } else {
                //Highlight the input
                $input.effect('highlight', {}, 1000);
            }
            
            //Set a new timeout
            timeoutId = setTimeout(function() {
                $input.data('highlightTimeout', null);
            }, 500);
            //Set the latest timeout id
            $input.data('highlightTimeout', timeoutId);
        });
        
        var _updateYearControls = Azavea.tryCatch('update year controls', function(curResTimeType){
            //Helper to search the years array to see if this year is in the list
            function isInList(year, yearsArray) {
                var j;
                for (j=0; j<yearsArray.length; j++) {
                    if (year === yearsArray[j]) {
                        return true;
                    }
                }
                return false;
            }
            
            //Array to track the year gaps
            _availableYears = [];
            var year,
                min = curResTimeType[0],
                max = curResTimeType[curResTimeType.length -1],
                range = max - min;

            for(year=min; year<=max; year++) {
                if (isInList(year, curResTimeType)) {
                    //Is this year missing from list of years?
                    _availableYears.push(year);
                } else {
                    _availableYears.push(null);
                }
            }
            
            P.Util.renderers.sliderTicks(_$range, _availableYears);
            
            //Set the min/max inputs
            _$minYear.val(min);
            _$maxYear.val(max);
            
            //Set the slider range and handles
            _$range.slider('option', 'min', min);
            _$range.slider('option', 'max', max);
            _$range.slider('option', 'values', [min, max]);
        });
        
        // Trigger the event which lets everyone know we are valid
        var _triggerChange = Azavea.tryCatch('trigger time change', function() {
            $(_options.bindTo).trigger('pdp-nychanis-time-change', [ _state ]);
        });

       //  Update our current state and trigger our event
       var _updateState = Azavea.tryCatch('nyc time update state', function(type, min, max) {
            _state.type = type;
            _state.typeName = type || type === 0 ? _curTimeResponse[type].Name : '';
            _state.minYear = min;
            _state.maxYear = max;  

            // Tell whomever about our current state
            _triggerChange();     
        });
        
        // Listen for event to clear our form fields
        var _resetInputs = Azavea.tryCatch('reset resolution inputs', function() {
            // Clear the state
            _updateState('', '','');
            
            // Clear and disable form elements
            _$timeSelector.attr('disabled', true).val(''); 
            _$timeType.button('option', 'disabled', true);
            _$range.slider('option', 'disabled', true);
            $('.pdp-nychanis-disabled-gap', _$range).remove();
            _$minYear.val('');
            _$maxYear.val('');            
        });

        // Listen for an event giving us the current indicator, which has values restricting our data
        var _indicatorChanged = Azavea.tryCatch('indicator changed', function(event, ind) {
            
            // Everything is disabled if the indicator changed
            _resetInputs();
            
            // Check that we have an actual indicator.
            if (ind.Name){
                _curIndicator = ind;
            }else{
                _curIndicator = {}; 
            }
        });  

        // Listen for an event that the resolution has been selected, in which case this widget is activated
        var _resolutionChanged = Azavea.tryCatch('resolution changed', function(event, res) {
            var firstTimeType;
            var min, 
                max;
            // The time types are attached to the indicator object, and it contains a list of years available
            // Set up the
            if(res.resolution || res.resolution === 0){
                var sel ='',
                    type,
                    curResTimeType;
                // Initialize our firstTimeType
                firstTimeType = -1;
                                    
                // Parse our ID the way we'd like it
                _resId = parseInt(res.resolution, 10);
                
                // When we have a resolution, we become activated
                _$timeSelector.removeAttr('disabled'); 
                               
                // Activate valid time types
                _$timeType.button('option', 'disabled', true);
                
                // For each time type we have, enable that button 
                for (type in _curIndicator.AvailableYearsByResolution[_resId]){
                
                    if (type && _curIndicator.AvailableYearsByResolution[_resId].hasOwnProperty(type) ){
                        if (firstTimeType === -1){
                            firstTimeType = parseInt(type, 10);
                        }
                        sel = _timeTypeInputsById[parseInt(type, 10)];
                        
                        // Enable this time type button
                        $(sel).button( 'option', 'disabled', false);
                    }
                }
                
                // Check the first available button
                if (firstTimeType > -1){
                    $(_timeTypeInputsById[firstTimeType]).attr('checked', 'checked');
                    $(_timeTypeInputsById[firstTimeType]).button('refresh');
                }
                
                // Set up the slider and min/max search fields which will be the first and last items in the
                //  list of the available years for the selected resolution time frame
                curResTimeType = _curIndicator.AvailableYearsByResolution[_resId][firstTimeType];
                min = curResTimeType[0];
                max = curResTimeType[curResTimeType.length -1];

                _updateYearControls(curResTimeType);
                                
                // Enable the slider
                _$range.slider('option', 'disabled', false);
            } else {
                _$timeSelector.attr('disabled', true); 
                _$timeType.button('option', 'disabled', true);
                _$range.slider('option', 'disabled', true);
                $('.pdp-nychanis-disabled-gap', _$range).remove();
            }
            
            // Update our state
            _updateState(firstTimeType, min, max);
        });
             
        // The min value has been changed, update the slider and the state                                
        var _minChanged = Azavea.tryCatch('min time value changed', function() {
            // Our valid value, or an empty string
            var minYear = _availableYears[0],
                maxYear = _availableYears[_availableYears.length - 1],
                val = minYear, 
                input = parseInt(this.value, 10);
            
            if (P.Form.validate(_fields, {}, _options.target) && 
               (val >= minYear && val <= maxYear)){
                // In the range, but is it under the current max?
                if (val <= _$maxYear.val() && !_isGapYear(input)){
                    // The value is valid
                    val = input;
                }    
                else {
                    // Show we're changing their typed value, clear any previous animations
                    _changeYearInputVal(_$minYear, minYear);
                }
            } else {
                // Show we're changing their typed value, clear any previous animations
                _changeYearInputVal(_$minYear, val);
            }
            _updateState(_state.type, val, _state.maxYear);
            
            // Keep the slider up to date (0 = index, lower val)
            _$range.slider('values', 0, val);            
        });

        // The max value has been changed, update the slider and the state
        var _maxChanged = Azavea.tryCatch('max time value changed', function() {
            // Our valid value, or an empty stringa
            var minYear = _availableYears[0],
                maxYear = _availableYears[_availableYears.length - 1],
                val = maxYear,
                input = parseInt(this.value, 10);
                
            if (P.Form.validate(_fields, {}, _options.target) && 
                (this.value >= minYear && this.value <= maxYear)){
                // In the range, but is it over the current min?
                if (this.value >= _$minYear.val() && !_isGapYear(input)){
                    // The value is valid
                    val = input;
                }    
                else {
                    // Show we're changing their data, and reset to max
                    _changeYearInputVal(_$maxYear, maxYear);
                }
            } else {
                _changeYearInputVal(_$maxYear, val);
            }
              
            _updateState(_state.type, _state.minYear, val);  
            
            // Keep the slider up to date (1 = index, upper val)
            _$range.slider('values', 1, val);         
        });

        // Slider value has changed
        var _slideChanged = Azavea.tryCatch('slide changed', function(min, max) {
            
            if (min !== parseInt(_$minYear.val(), 10)){
                _changeYearInputVal(_$minYear, min);
            }
            if (max !== parseInt(_$maxYear.val(), 10)){
                _changeYearInputVal(_$maxYear, max);
            }
            _updateState(_state.type, min, max);
        });
        
        // Result time type has changed, update state
        var _detailsChanged = Azavea.tryCatch('detail time value changed', function() {
            var curResTimeType,
                type = $('input[name="pdp-nyc-search-result-details"]:checked').val();
                
                
            // A new time type means new min and max years
            curResTimeType = _curIndicator.AvailableYearsByResolution[_resId][type];

            // Update the controls and our state
            _updateYearControls(curResTimeType);
                        
            _updateState(type, _state.minYear, _state.maxYear);
        });
              
        // Bind to events this widget cares about                
        var _bindEvents = Azavea.tryCatch('bind nychanis time events', function() {
            // Listen for Indicator
            $(_options.bindTo).bind('pdp-nychanis-indicator-change', _indicatorChanged);

            // Listen for Resolution
            $(_options.bindTo).bind('pdp-nychanis-resolution-change', _resolutionChanged);
            
            // Listen for reset
            $(_options.bindTo).bind('pdp-criteria-reset', _resetInputs);
            
            // Setup the form fields
            _$minYear.change(_minChanged);
            _$maxYear.change(_maxChanged);
            _$details.change(_detailsChanged);
        });
            
        // Render the markup this widget uses and set it to a default state    
        var _render = Azavea.tryCatch('render nychanis time', function(data) {
           // Build the time units as radio buttons, and build a lookup for the inputs
            var timeInputs = '',
                date = new Date();
            
            // Cache so we can look up the names later    
            _curTimeResponse = data.Times;
                
            $.each(data.Times, function(i, time){
                timeInputs += '<input id="pdp-nyc-result-type-' + time.Name + '" value="' + time.UID + '" name="pdp-nyc-search-result-details" class="pdp-nyc-time-type" type="radio"/>'  + 
                                    '<label for="pdp-nyc-result-type-' + time.Name + '">' + time.Name + 's</label>';
                _timeTypeInputsById[time.UID] = '#pdp-nyc-result-type-' + time.Name;
            });
            
            $('<div id="pdp-nyc-search-result-details" class="pdp-nyc-control">' + 
                    timeInputs + 
                '</div>' + 
                '<div class="pdp-nyc-year-container pdp-nyc-control"><label>From</label> <input id="pdp-nyc-result-min" class="pdp-nyc-results-time-selector" type="text" size="10" value="'+_state.minYear+'"/><label> to </label>' + 
                '<input id="pdp-nyc-result-max" class="pdp-nyc-results-time-selector" type="text" size="10" value="'+_state.maxYear+'"/></div>' + 
                '<div id="pdp-nyc-result-year-slider" class="pdp-nyc-control"></div><span id="pdp-nyc-help-slider" title="This slider lets you limit which years, quarters or months will appear in the table.  You may select a different year to map on the selector above the map legend." class="ui-icon ui-icon-help pdp-nyc-control-label-help"></span>')
                .appendTo(_options.target);
            
            // Local cache of these common lookups
            _$range = $('#pdp-nyc-result-year-slider');  
            _$details = $('#pdp-nyc-search-result-details');
            _$minYear = $('#pdp-nyc-result-min');
            _$maxYear = $('#pdp-nyc-result-max');
            _$timeSelector = $('.pdp-nyc-results-time-selector');
            _$timeType = $('.pdp-nyc-time-type');
             
            // Enable the tooltips
            $('.pdp-nyc-control-label-help').tooltip({
                tipClass: 'pdp-pdb-control-tooltip',
                // place tooltip on the right edge
                position: 'center right',
                // a little tweaking of the position
                offset: [-2, 10],
                // use the built-in fadeIn/fadeOut effect
                effect: "fade"
            }); 
                         
            // Setup the form UI elements
            _$details.buttonset();
            _$range.slider({
		        range: true,
		        animate: true,
		        min: 1975,
		        max: date.getFullYear(),
		        values: [1975, date.getFullYear()],
		        slide: function(event, ui) {
			        if (_isGapYear(ui.values[0]) || _isGapYear(ui.values[1])) {
			            return false;
			        } else {
                        _slideChanged(ui.values[0], ui.values[1]);
                    }
                }
	        });
	        
	        // Disable by default
	        _$timeSelector.attr('disabled', true); 
	        _$details.button('option', 'disabled', true);
	        _$timeType.button('option', 'disabled', true);
	        _$range.slider('option', 'disabled', true);
        });
            
        // Initialize the widget    
        _self.init = Azavea.tryCatch('init nychanis time', function() {
            $(_options.bindTo).bind('pdp-nychanis-attributes', function(event, meta) {
                _render(meta);
                
                
                _bindEvents();
            });
            return _self;
        });
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-nychanis-time.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-table.js ********************/
(function(P) {
    P.Widget.Table = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P,                
                messageSel: 'pdp-table-message',
                pageSizes: [20, 100, 500],
                defaultPageSize: 20,
                pagerTarget: null,
                extraCols: [],
                altRowClass: 'pdp-table-row-alt-pdb'
            }, options),
            _curResponse = {},
            _curColVisibility,
            _curSortState = {
                colIndex: -1,
                sortAsc: true
            },
            _curPageState = {
                page: 1,
                pageSize: _options.defaultPageSize,
                totalPages: -1
            }, 
            _timer;

        // Triggers a request to get a new set of table data
        var _triggerDataRequest = Azavea.tryCatch('trigger table data request', function() {
            $(_options.bindTo).trigger('pdp-data-request', [_curPageState.page, _curPageState.pageSize, _curSortState.colIndex, _curSortState.sortAsc]);
        });
        
        // Get the current state of the table
        _self.getState = Azavea.tryCatch('get table state', function() {
            return {
                page: _curPageState.page,
                pageSize: _curPageState.pageSize,
                sortColIndex: _curSortState.colIndex,
                sortAsc: _curSortState.sortAsc
            };
        });
        
        // Update the table date for the given page number and page size
        _self.setPage = Azavea.tryCatch('set table page', function(page, pageSize, preventDataRequest) {
            if (page > 0 && page <= _curPageState.totalPages) {
                _curPageState.page = parseInt(page, 10);
                _curPageState.pageSize = pageSize;
                
                if (!preventDataRequest) {
                    _triggerDataRequest();
                }
            }
        });
        
        // Refreshes the pager UI per the current state
        var _refreshPager = Azavea.tryCatch('refresh table pager', function() {
            $(_options.pagerTarget).show();
            $('.pdp-table-pager-totalpages', _options.pagerTarget || _options.target).html(_curPageState.totalPages);
            $('.pdp-table-pager-ctrl-curpage input', _options.pagerTarget || _options.target).val(_curPageState.page);
        });
            
        var _setPagerAutoRefresh= Azavea.tryCatch('refresh table pager', function(event) {
            // Cancel current timeout
            if (_timer) {
                clearTimeout(_timer);
                _timer = 0;
            }
            
            // Start our attempt at going to page
            _timer = setTimeout(function() {
                // Get the current page value and go there
                var val = $('.pdp-table-pager-ctrl-curpage input', _options.pagerTarget || _options.target).val();
                _self.setPage(val, _curPageState.pageSize);
            }, 1200);

        });
        
        
        var _pageEvent = Azavea.tryCatch('pager click events', function(event){
            var id = event.target.id;
            
            switch (id){
            
                case 'pdp-table-pager-first':
                    _self.setPage(1, _curPageState.pageSize);
                    break;
                    
                case 'pdp-table-pager-prev':
                    _self.setPage((_curPageState.page - 1), _curPageState.pageSize);
                    break;    
                    
                case 'pdp-table-pager-next':
                    _self.setPage((_curPageState.page + 1), _curPageState.pageSize);
                    break;
                    
                case 'pdp-table-pager-last':
                    _self.setPage(_curPageState.totalPages, _curPageState.pageSize);
                    break;                      
            }
        });
        
        var _initPager = Azavea.tryCatch('init table pager', function() {
            
            // Don't init the pager if there is one already
            if ($('.pdp-table-pager', _options.pagerTarget || _options.target).length){
                return;
            }
            // Render pager toolbar
            $('<div class="pdp-table-pager">' + 
                '<div class="pdp-table-pager-ctrl pdp-table-pager-ctrl-pagesize"><span class="pdp-table-pager-ctrl">Show:</span><select id="pdp-table-pager-ctrl-pagesize-selector"></select></div>' + 
                '<div class="pdp-table-pager-ctrl pdp-table-pager-ctrl-first ui-corner-all pdp-border"><span id="pdp-table-pager-first" class="ui-icon ui-icon-arrowstop-1-w"></span></div>' + 
                '<div class="pdp-table-pager-ctrl pdp-table-pager-ctrl-prev ui-corner-all pdp-border"><span id="pdp-table-pager-prev" class="ui-icon ui-icon-arrow-1-w"></span></div>' + 
                '<div class="pdp-table-pager-ctrl pdp-table-pager-ctrl-curpage"><input id="pdp-table-pager-ctrl-curpage-input" type="text" value="0"/> of <span class="pdp-table-pager-totalpages">0</span></div>' + 
                '<div class="pdp-table-pager-ctrl pdp-table-pager-ctrl-next ui-corner-all pdp-border"><span id="pdp-table-pager-next" class="ui-icon ui-icon-arrow-1-e"></span></div>' + 
                '<div class="pdp-table-pager-ctrl pdp-table-pager-ctrl-last ui-corner-all pdp-border"><span id="pdp-table-pager-last" class="ui-icon ui-icon-arrowstop-1-e"></span></div>' + 
            '</div>').appendTo(_options.pagerTarget || _options.target);
            
            // Load up our select options and bind change event
            var options = '', i;
            for(i=0; i < _options.pageSizes.length; i++) {     
                var selected ='';          
                if (_options.pageSizes[i] === _options.defaultPageSize) {
                    selected  = ' selected = "selected"';
                }
                options += '<option value="' + _options.pageSizes[i] + '"' + selected + '>' + _options.pageSizes[i] + '</option>';
            }
            
            // Page size select
            $('#pdp-table-pager-ctrl-pagesize-selector', _options.pagerTarget || _options.target)
                .append(options)
                .change(function(event) {
                    _self.setPage(1, this.value);
                });
                
            // Current page in input and bind change event
            $('#pdp-table-pager-ctrl-curpage-input', _options.pagerTarget || _options.target)
                .val(_curPageState.page)
                .keyup(_setPagerAutoRefresh);
            
            // For performance reasons, bind a single click event to the pager control container
            //  which will figure out which button was clicked within it
            $('.pdp-table-pager', _options.pagerTarget || _options.target).click(_pageEvent);                
        });
        
        // Toggle the sorting of the column for the column index
        var _toggleColSort = Azavea.tryCatch('toggle col sorting', function(colIndex, invert) {
            // Account for extra columns at the begining that the data does not know about
            var extraCols = _curResponse.ExtraAttrs ? _curResponse.ExtraAttrs.length : 0,
                ascSpan = '<span class="pdp-table-col-sorting right ui-icon ui-icon-triangle-1-n"></span>',
                descSpan = '<span class="pdp-table-col-sorting right ui-icon ui-icon-triangle-1-s"></span>';
                
            if (_curSortState.colIndex === colIndex) {
                // I clicked on the same column, go to the next sort order 
                _curSortState.sortAsc = !_curSortState.sortAsc;
                var $header = $('tr th:nth-child(' + (_curSortState.colIndex+1+extraCols) + ')', _options.target);
                
                if (_curSortState.sortAsc) {
                    $header
                        .removeClass('pdp-table-col-sortdesc')
                        .addClass('pdp-table-col-sortasc')
                        .find('span.pdp-table-col-sorting').remove();
                    
                    // Add the arrow icon
                    $('div.ktable-th-text', $header).before(ascSpan);
                } else {
                    $header
                        .removeClass('pdp-table-col-sortasc')
                        .addClass('pdp-table-col-sortdesc')
                        .find('span.pdp-table-col-sorting').remove();
                    
                    // Add the arrow icon
                    $('div.ktable-th-text', $header).before(descSpan);
                }
            } else {
                // I clicked on a new column, reset other columns to default state and sort by me ASC (true)
                // update the sort cache
                _curSortState.colIndex = colIndex;
                _curSortState.sortAsc = invert ? true : false;
                
                // Remove sort classes from all other headers
                $('.pdp-table-col-sortasc,.pdp-table-col-sortdesc')
                    .removeClass('pdp-table-col-sortasc pdp-table-col-sortdesc')
                    .find('span.pdp-table-col-sorting').remove();
                
                // Add a new sort class to this header
                // nth-child is 1 based, not zero based
                $('tr th:nth-child(' + (_curSortState.colIndex+1+extraCols) + ')', _options.target)
                    .addClass(invert ? 'pdp-table-col-sortasc' : 'pdp-table-col-sortdesc')
                    .find('div.ktable-th-text').before(invert ? ascSpan : descSpan);                    
            }

            // trigger a new data request
            _triggerDataRequest();
        });

        // Enable the table widget to have resizable columns
        var _enableColResize = Azavea.tryCatch('enable col resize', function($table) {
            
            // Prepend the colgroup elements to the table.  This is needed for the ktable plugin
            var extraCols = _curResponse.ExtraAttrs ? _curResponse.ExtraAttrs.length : 0;
            var c, 
                classAttr,
                colGroup ='<colgroup>';
            
            for(c=0; c< extraCols; c++){
                colGroup += '<col class="pdp-table-col-extra"/>';
            }
        
            // IE7 does not display the table correctly when "display: none" is applied to a col tag
            for(c=0; c < (_curResponse.Attrs.length); c++) {
                classAttr = '';
                // If this should be hidden by default, hide it
                if (!_curColVisibility[c]){
                    classAttr = ' pdp-table-col-hide';
                }
                    
                colGroup += '<col class="pdp-table-col-index-' + c + classAttr +'"/>';
            }
            colGroup += '</colgroup>';
                        
            $table.prepend(colGroup);
            
            // Apply column resize plugin to table
            $table.ktable_colsizable({
			    dragMove: true, 
			    dragProxy: 'area',
			    dragOpacity: 0.1
		    });
        });
        
        // Update the visibility of the columns based on the current cached state
        var _refreshColVisibility = Azavea.tryCatch('refresh col visibility', function(target) {
            // Performance note: nth-child selectors are slooow, and multiple selectors are slower
            // than single selectors - but that could actually be because of the extra string
            // concatonation involved.  In any case, this was this best way to show/hide indiviual
            // table columns - every cell (incl. headers) gets a class.
            
            // IE note: pdp-table-col-hide will give a display: none for all table elements in other browsers
            //  but IE7 and lower fail when applied to col elements AND th & td elements.  There is a specific IE7- sytlesheet 
            //  added for col.pdp-table-col-hide which will set display:none for col elements, and display:inline for
            //  th & td elements, which works for IE7 but would break FF/Chrome & IE8 (if you can believe that!).
            // In other words, IE7 and lower, the css class for pdp-table-col-hide needs to be manipulated to work.
            $.each(_curColVisibility, function(i, isVisible) {
                
                if (isVisible){
                    $('.pdp-table-col-index-' + i, target).removeClass('pdp-table-col-hide');
                } else {
                    $('.pdp-table-col-index-' + i, target).addClass('pdp-table-col-hide');
                }
            });
        });
        
        // Show a single column for a column index - zero based
        _self.showCol = Azavea.tryCatch('show col', function(colIndex) {
            _curColVisibility[colIndex] = true;
            $('.pdp-table-col-index-' + colIndex, _options.target).removeClass('pdp-table-col-hide');
        });
        
        // Hide a single column for a column index - zero based
        _self.hideCol = Azavea.tryCatch('hide col', function(colIndex) {
            _curColVisibility[colIndex] = false;
            $('.pdp-table-col-index-' + colIndex, _options.target).addClass('pdp-table-col-hide');
        });

        var _getBodyRow = Azavea.tryCatch('get body row', function(id, record, extraClass){
                var row = new P.StringBuffer(),
                    i, obj, val;
                row.append('<tr class="' + extraClass + '">');
                
                if (_curResponse.ExtraAttrs) {
                    // Create markup for extra attribute cells (not what's returned from the server)
                    for(i=0; i <_curResponse.ExtraAttrs.length;i++){
                        obj = _curResponse.ExtraAttrs[i];
                        row.append('<td class="');
                        row.append(extraClass);
                        row.append('">');
                        row.append(P.Util.renderers[obj.ValType](obj.Name, id, record, _curResponse.Attrs)); 
                        row.append('</td>'); 
                    }
                }
                
                // Create markup for each value cell
                for(i=0;i<_curResponse.Attrs.length;i++) {
                    val = record[i];
                    obj = _curResponse.Attrs[i];
                    
                    // Render the cell, if there is a renderer for it
                    if (P.Util.renderers[obj.ValType]){
                        val = P.Util.renderers[obj.ValType](record[i], id, record, _curResponse.Attrs);
                    }
                    row.append('<td class="pdp-column-render-');
                    row.append(obj.ValType);
                    row.append(' pdp-table-col-index-');
                    row.append(i);
                    // If this will start out hidden, add the class now
                    if (!_curColVisibility[i]){
                        row.append(' pdp-table-col-hide');
                    }
                    row.append('">');
                    row.append(val);
                    row.append('</td>');
                } 
                
                row.append('</tr>');
                
                return row.toString();                
        });
        
        // Get the body rows of the table and return them as a string
        var _getTableBody = Azavea.tryCatch('get table widget rows', function(idIndex){
            var $tbody = $('<tbody></tbody>'),
                rows = new P.StringBuffer(),
                i, id, record, lastContextRow = '';
           
            //Construct all of the context rows
            if (_curResponse.ContextRows){
                for(i=0;i<_curResponse.ContextRows.length; i++) {
                    record = _curResponse.ContextRows[i];
                    if (i === _curResponse.ContextRows.length -1){
                        lastContextRow = ' pdp-widget-table-context-row-last';
                    }
                    rows.append(_getBodyRow(record[idIndex], record, 'pdp-widget-table-context-row' + lastContextRow));
                }
            }
            //Construct all of the content rows
            for(i=0;i<_curResponse.Values.length; i++){
                // To support table view for users, which have no UID returned, 
                // use the loop index if there is no UID index
                record = _curResponse.Values[i];
                id = record[idIndex];
                if (!idIndex){
                    id = i;
                }
                rows.append(_getBodyRow(id, record, ''));
            }
            
            // Append the rows to the body
            $tbody.append(rows.toString());
            
            // Styling for alternating rows 
            // Could do performance increase by building this into markup, if it becomes a problem
            $('tr:odd', $tbody).addClass(_options.altRowClass);
                       
            return $tbody;
        });

        // Render the whole table, including sorting, paging, and resizing
        var _renderTable = Azavea.tryCatch('render table widget table', function(){
            var $target = $(_options.target).empty(),
                $table,
                content = '<table class="pdp-table"><thead><tr>';
             
            //Headers
            if (_curResponse.ExtraAttrs) {
                //Support extra attributes other than what the server returned
                $.each(_curResponse.ExtraAttrs, function(i, obj) {
                    content += '<th class="pdp-table-col-nosort">' + obj.Name + '</th>';
                });
            }
            
            $.each(_curResponse.Attrs, function(i, obj) {
                var classAttr = '',
                    sortAttr = '';
                    
                if (obj.NotSortable) {
                    classAttr = ' pdp-table-col-nosort';
                }
                else{
                    // We'll add an icon?
                    classAttr = ' ui-state-default';
                }
                
                // Add our hiding class as we build, if this header should be hidden
                if (!_curColVisibility[i]){
                    classAttr += ' pdp-table-col-hide';
                }
                
                // Add a class for the column index so we can hide/show
                // Default sort direction is Descending, unless your val type is text, in which case it's Asc.  This is
                //  determined by the following class: pdp-table-col-sort-invert
                if (obj.ValType === 'text'){
                    sortAttr = ' pdp-table-col-sort-invert';
                }
                
                content += '<th class="' + sortAttr + classAttr + ' pdp-table-col-index-' + i + '" rel="' + i + '">' + obj.Name + '</th>';
            });
            content += '</tr></thead></table>';

            $table = $(content).append(_getTableBody());
            
            // Enable column resizing. This needs to happen before refreshing col visibility
            _enableColResize($table);
           
            // Put the table in the page's container
            $table.appendTo($target);           
        });
        
        // Init the column visibility state
        var _initColState = Azavea.tryCatch('init col state', function() {
            //Reset the column sort state since we go new 
            _curSortState = {
                colIndex: -1,
                sortAsc: true
            };
        
            _curColVisibility = [];
            $.each(_curResponse.Attrs, function(i, obj) {
                _curColVisibility.push(obj.OnByDefault);
            });
        });
        
        // Handles the event of a new column visibility event
        var _handleNewColumnVis = Azavea.tryCatch('handle col vis response', function(event, newResponse, colIndex) {
            
            // Save the cache of all columns and their state
            _curColVisibility = newResponse;
            if (colIndex || colIndex === 0){
                // If we are chaning a single one, check the state from the cache and just change it
                if (_curColVisibility[colIndex]){
                    _self.showCol(colIndex);
                }else{
                    _self.hideCol(colIndex);
                }
            }else{
                // Many have changed, just refresh completely
                _refreshColVisibility();
            }
        });
        
        // Update the table to reflect the new data response that just arrived.
        var _handleNewDataResponse = Azavea.tryCatch('table handle new data response', function(event, newResponse) {
            try {
                //Decide if we should just render new data or render a new table
                var gotSameCols = Azavea.superEquals(_curResponse.Attrs, newResponse.Attrs);
                
                _curResponse = newResponse;
                
                _curPageState.totalPages = Math.ceil(_curResponse.TotalResults / _curPageState.pageSize);
                
                // Remove message
                $('.' + _options.messageSel).remove();
                $(_options.target).show();
                
                if (_curResponse.TotalResults > 0) {
                    //Check the column meta data to see if we need to render a new table
                    //  There may have been no results the first time, but the same columns, which means
                    //  we actually might have to build the table for the first time.
                    if (gotSameCols && $('tbody', _options.target).length !== 0) {
                        
                        // Remove tbody
                        $('tbody', _options.target).remove();
                                                                                                
                        //meta data is the same, just replace the body
                        var idIndex = P.Util.getAttrIndex(_curResponse.Attrs, 'UID');
                        var $tbody = _getTableBody(idIndex);
                        
                        // Check table visibility, show if needed
                        $('table', _options.target)
                            .append($tbody)
                            .show();
                        
                    } else {
                        _initColState();

                        //meta data is different. time for a new table!
                        _renderTable();
     
                         // Init the pager
                        _initPager();
                    }
                   
                    _refreshPager();
                  
                } else {
                    
                    if (gotSameCols){
                        
                        // Remove tbody
                        $('tbody', _options.target).remove();
                        
                        // Hide the table
                        $('table', _options.target).hide();
                    }else{
                                            
                        // Remove table, show no results message
                        $(_options.target).empty();
                    }
                    
                    _refreshPager();
                    
                    //No results.  Now what?
                    $(_options.target).append('<div class="' + _options.messageSel + '">No results.</div>');
                }
            } finally {
                // Loading is finished, stop the loading indicator
                $(_options.bindTo).trigger('pdp-loading-finished');
            }
        });

        // Initialize and render a new table widget
        _self.init = Azavea.tryCatch('init table widget', function() {
            //probably need to render something to the target so we don't have a big hole in the page.  ask johnny for ideas.
            
            //listen for a new data response.  
            $(_options.bindTo).bind('pdp-data-response', _handleNewDataResponse);
            
            //ask for data if someone says that I have to
            $(_options.bindTo).bind('pdp-data-force-update', function() {
                // When a new search is forced, lose the page and sort params
                _curSortState.colIndex = -1;
                _curPageState.page = 1;
                
                _triggerDataRequest();
            });
            
            $(_options.bindTo).bind('pdp-criteria-reset', function() {
                $(_options.target).hide();
                $(_options.pagerTarget).hide();
            });
            
            //Bind click event to the header cells to support sorting.
            //  Note: The options.target context is very important, because this is a "live" call 
            //  and there will be other th's added when other table widgets get added
            $('th:not(.pdp-table-col-nosort)', _options.target).live('click', function(event) {
                var $this = $(this),
                    thisIndex = parseInt($this.attr('rel'), 10),
                    invert = $this.hasClass('pdp-table-col-sort-invert');
                _toggleColSort(thisIndex, invert);
            });
            
            // Listen for new table visibility
            $(_options.bindTo).bind('pdb-column-visibility', _handleNewColumnVis);
            
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-table.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-pdb-search.js ********************/
(function(P) {
    P.Pdb.Search = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P.Pdb
            }, options),
            _criteria,
            _aggregations;

        //Render placeholders to the target
        var _render = Azavea.tryCatch('render pdb search', function() {
            $('<div id="pdp-pdb-search-criteria" class="pdp-pdb-search-container"><h4>Filter by</h4></div>' + 
            '<div id="pdp-pdb-search-aggregations" class="pdp-pdb-search-container"><h4>Show my results as</h4></div>' + 
            '<div class="pdp-search-actions"><button id="pdp-pdb-button-search" class="pdp-button">Submit</button>' + 
            '<a id="pdp-pdb-button-reset" href="javascript:void(0);">Clear</a></div>').appendTo(_options.target);
            
            $('#pdp-pdb-button-search').button();
        });
               
        var _bindEvents = Azavea.tryCatch('bind pdb search events', function(){
            //Force everyone update!
            $('#pdp-pdb-button-search').click(function(){
                $(_options.bindTo).trigger('pdp-data-force-update');
            });
            
            //Clear the criteria and results
            $('#pdp-pdb-button-reset').click(function(){
                $(_options.bindTo).trigger('pdp-criteria-reset');
            });
        });

        _self.init = Azavea.tryCatch('init pdb search', function() {
            _render();
            _bindEvents();
            
            //Init the criteria widget.
            _criteria = P.Widget.PdbCriteria({
                target: '#pdp-pdb-search-criteria'
            }).init(_self);
            
            //Init the aggregations widget.
            _aggregations = P.Widget.PdbAggregations({
                target: '#pdp-pdb-search-aggregations'
            }).init(_self);
   
            //Get the PDB metadata and push it out
            P.Data.getAttributes(function (attrResp) {
                $(_options.bindTo).trigger('pdp-pdb-attributes', [ attrResp ]);
            });

            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-pdb-search.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-pdb-results.js ********************/
(function(P) {
    P.Pdb.Results = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P.Pdb
            }, options),
            _table,
            _criteria,
            _groupBys,
            _longview,
            _cachedMapData,
            _cachedMapExtent,
            _countMode,
            _userRole = 'Public', // Used only for analytics, no actual security
            _activeCriteria,
            _activeGroupBys,
            _activeCountMode,
            _$mapTitle,
            _$tableTitle,
            _$mapCountTitle,
            _$mapDisplayTitle;

        // Parse the current search criteria into trackable analytics
        var _submitAnalytics = Azavea.tryCatch('submit pdb analytics', function(criteria, groupBys, totalResults){
            var i,
                label = '',
                oper = '',
                value = '',
                list = '',
                action = 'Properties | Search';
                
            if (groupBys && groupBys.length){
                action = 'Properties | Aggregate';
            }
            
            // Loop through the criteria and submit the metric
            for(i=0;i<criteria.length;i++){
                // Parse the criteria into a label and value
                label = criteria[i].attr;
                value = criteria[i].val;
                switch (criteria[i].oper){
                    case 'eq':
                        oper = '=';
                        break;
                    case 'ge':
                        oper = '>=';
                        break;
                    case 'le':
                        oper = '<=' ;
                        break;
                }
                
                list += label + oper + value + ' | ';
                
            }
            
            // Remove last | 
            list = list.substring(0, list.length - 2);
                        
            // Loop through the groupbys and track them also
            if (groupBys && groupBys.length){
                list += ' Aggregate By('; 
                for(i=0;i<groupBys.length;i++){
                    list += groupBys[i] + ', '; 
                }
                list = list.substring(0, list.length-2 ) + ')';
            }
            
            P.Util.trackMetric(_userRole, action, list ? list : '[No Criteria]', totalResults);
            
        });
        
        // Updates the map title to say how many properties are actually displayed at the moment
        var _updateMapDisplayTitle = Azavea.tryCatch('update pdb map title', function(resultCount, countMode) {
            
            if (countMode){ 
                var propLabel = resultCount === 1 ? ' SHIP property' : ' SHIP properties';
                _$mapCountTitle.hide();
                _$mapDisplayTitle.html('Displaying ' + P.Util.renderers.integer(resultCount) + propLabel);
            }else{
                // Show the title for map display properties
                _$mapCountTitle.show();
                _$mapDisplayTitle.html(', displaying ' + P.Util.renderers.integer(resultCount) + ' on the map');
            }
        });
        
        // The map and table will have different titles
        var _updateTitle = Azavea.tryCatch('update pdb title', function(data, countMode) {
            var mapTitle, title, 
                totalIndex = -1, propSum = 0, mapCount;
            var recLabel;
            var propLabel;
            
            // When logging in/out this gets fired with no value
            if (!data){
                return;
            }
                
            if (countMode){   
               // Work out our plural
                recLabel = ' records';
                propLabel = ' SHIP properties';
                if (data.TotalResults === 1 ){
                    recLabel = ' record';
                }

                // The title includes how many records were returned, property counts are returned in total
                title = P.Util.renderers.integer(data.TotalResults) + recLabel + ' returned'; 
                
                // We don't need extra spacing for this type of query, there is no column selector button
                $('#pdp-pdb-table-title').removeClass('pdp-pdb-table-title-details');
                                
                // We have no property counts, so hide that title
                _$mapCountTitle.hide();
            } else {
            
                // We do need extra spacing for this type of query, there is no column selector button
                $('#pdp-pdb-table-title').addClass('pdp-pdb-table-title-details');
                            
                // This is a details search, both numbers are total values
                mapCount = P.Util.renderers.integer(data.TotalResults);
                
                recLabel = ' records';
                propLabel = ' SHIP properties';
                
                if (data.TotalResults === 1 ){
                    propLabel = ' SHIP property';
                }
                // Work out the titles for count and description
                title = mapCount + propLabel + ' meet your criteria';
                
                // Place the titles
                _$mapCountTitle.show().html(title);
            }
            
            // Remove the "no search yet" message
            $('#pdp-pdb-table-uninitialized').remove();
            
            // The map may not have updated on this search, so manually call the update map title routine
            if (_cachedMapData && ( _cachedMapData.totalResults || _cachedMapData.totalResults === 0)){
                _updateMapDisplayTitle(_cachedMapData.totalResults, countMode);
            }

            _$mapTitle.show();
            _$tableTitle.html(title).show();
            
        });
                
        //Fetch the map data (points and clusters) for the criteria
        var _getMapData = Azavea.tryCatch('get pdb map data', function(criteria, minx, miny, maxx, maxy) {
            
            // If we are in counts mode, and there are no groupbys - let the user know they must select
            //  counts first.
            if (_activeCountMode && _activeGroupBys.length < 1){
                $(_options.bindTo).trigger('pdp-loading-finished');
                $(_options.bindTo).trigger('pdp-show-counts-panel');
                return;    
            }
            
            if (criteria) {
                // Use a string version of the criteria because it makes checking for changes
                // a lot easier.
                var critStr = JSON.stringify(criteria);
                var width = maxx - minx;
                var height = maxy - miny;
                if (_cachedMapData) {
                    if ((critStr === _cachedMapData.critStr) && 
                            // For some reason, height/width varied by small amounts after panning.
                            (Math.abs(width - _cachedMapData.origWidth) < 2) &&
                            (Math.abs(height - _cachedMapData.origHeight) < 2) &&
                            (maxx <= _cachedMapData.maxx) &&
                            (maxy <= _cachedMapData.maxy) &&
                            (minx >= _cachedMapData.minx) &&
                            (miny >= _cachedMapData.miny)) {
                        // This request isn't outside the bounds we asked for last time, and it is
                        // at the same zoom level and screen size as last time, so no need to change
                        // anything.
                        return;
                    }
                }
                // Request a larger area so we don't re-request on every pan (which causes the
                // groupings to jump around a lot).
                var oversizeMinX = minx - width;
                var oversizeMinY = miny - height;
                var oversizeMaxX = maxx + width;
                var oversizeMaxY = maxy + height;
                
                // Pass in the full map bbox so we can get a count of available properties on the map
                var minBoundsX = _cachedMapExtent[0], maxBoundsX = _cachedMapExtent[2], minBoundsY = _cachedMapExtent[1], maxBoundsY = _cachedMapExtent[3];
                
                P.Data.getPropertyLocations(criteria, oversizeMinX, oversizeMinY, oversizeMaxX, oversizeMaxY, minBoundsX, minBoundsY, maxBoundsX, maxBoundsY,
                    function(data) {
                        _cachedMapData = {
                            critStr: critStr,
                            minx: oversizeMinX,
                            maxx: oversizeMaxX,
                            miny: oversizeMinY,
                            maxy: oversizeMaxY,
                            origHeight: height,
                            origWidth: width,
                            totalResults: data.TotalMapResults
                        };
                        
                        // Update map title
                        _updateMapDisplayTitle(data.TotalMapResults, _activeCountMode);
                        
                        $(_options.bindTo).trigger('pdp-map-data-response', [ data ]);
                    }, function(){
                        // Error, tell loading indicator to go away
                        $(_options.bindTo).trigger('pdp-loading-finished');
                    }
                );
            }
        });

        //Get the raw data for the given criteria
        var _getData = Azavea.tryCatch('get pdb data', function(criteria, groupBys, page, pageSize, colIndex, sortAsc) {
            
            // If we are in counts mode, and there are no groupbys - let the user know they must select
            //  counts first.
            if (_activeCountMode && groupBys.length < 1){
                $(_options.bindTo).trigger('pdp-loading-finished');
                $(_options.bindTo).trigger('pdp-show-counts-panel');
                return;    
            }
            
            P.Data.getProperties(criteria, pageSize, page, colIndex, sortAsc, groupBys,
                function(data) {
                    
                    _updateTitle(data, _activeCountMode);
                    
                    // Submit analytics for this search, if it is a 1st page
                    // so we don't subumit for every page next or col sort
                    if (page === 1 && colIndex < 0){
                        _submitAnalytics(criteria, groupBys, data.TotalResults);
                    }
                    
                    // GroupBy queries do not get a details column
                    if (!groupBys || groupBys.length === 0){
                        data.ExtraAttrs = [
                            { Name: 'Details', ValType: 'propertyDetails' }
                        ];                      
                    }else {
                        data.GroupByQuery = true;
                    }                    
                    $(_options.bindTo).trigger('pdp-data-response', [ data ]);
                }, function(){
                    // Error, tell loading indicator to go away
                    $(_options.bindTo).trigger('pdp-loading-finished');
                }
            );
        });

        // Caches the highest role of the current user, for analytics only
        var _setUserRole = Azavea.tryCatch('set user role nychanis', function(user){
                if (user){
                    if (user.Admin || user.Limited){
                        _userRole = 'Agency';
                        return;
                    }
                }        
                _userRole = 'Public';
        });
                
        var _bindEvents = Azavea.tryCatch('bind pdb result events', function(){
            
            // Login status            
            $(P).bind('pdp-login-status-refresh', function(event, user){
                _setUserRole(user);
            });
             $(P).bind('pdp-login-success', function(event, user){
                _setUserRole(user);
            });

            // Bind to get a call with max bbox so we can get a count of properties available on the map
            $(P).bind('pdp-map-max-bbox', function(event, maxBounds){
                _cachedMapExtent = maxBounds;

            }); 
                        
            $(_options.bindTo).bind('pdp-data-force-update', function(){
                //Indicate that the search button has been pressed, even if no criteria selected
                _activeCriteria = $.extend(true, [], _criteria || []);
                _activeGroupBys = $.extend(true, [], _groupBys || []);
                _activeCountMode = _countMode;
            });
            
            //Someone asked for data - go get it
            $(_options.bindTo).bind('pdp-data-request', function(event, page, pageSize, colIndex, sortAsc) {
                _getData(_activeCriteria, _activeGroupBys, page, pageSize, colIndex, sortAsc);
            });
            
            //Someone asked for map data 
            $(_options.bindTo).bind('pdp-map-data-request', function(event, minx, miny, maxx, maxy) {
                _getMapData(_activeCriteria, minx, miny, maxx, maxy);
            });
            
            //The criteria changed - save it.
            $(_options.bindTo).bind('pdp-pdb-criteria-change', function(event, criteria) {
                // Deep copy the criteria, an array of objects - we want the values not the ref
                _criteria = $.extend(true, [], criteria || []);
            });
            
            //The aggregations columns changed
            $(_options.bindTo).bind('pdp-pdb-aggregations-change', function(event, groupBys, countMode) {
                // Deep copy the groupBys, an array of objects - we want the values not the ref
                _groupBys = $.extend(true, [], groupBys || []);
                _countMode = countMode;
            });
            
            // Reset request.
            $(_options.bindTo).bind('pdp-criteria-reset', function() {
                // Blow away the map criteria cache so that subsequent queries, if it was the same criteria
                //  will actually be searched on.
                _cachedMapData = {};
                _activeCriteria  = null;
                _$mapTitle
                    .hide()
                    .children()
                    .empty();
                    
                _$tableTitle.empty().hide();
                _displayNoQueryMsg();
            });
            
            //Export the CSV
            $(_options.bindTo).bind('pdp-export-request', function(event) {
                // Track export request
                P.Util.trackMetric(_userRole, 'Properties | Export');
                P.Data.getPropertiesCsv(_activeCriteria, _activeGroupBys);
            });
            
        });
        
        // Displays a message in the empty space where a table will be
        var _displayNoQueryMsg = Azavea.tryCatch('display pdb no query message', function(){
            if ($('#pdp-pdb-table-uninitialized').length === 0){
                $(options.tableTitleTarget).append('<div id="pdp-pdb-table-uninitialized" class="pdp-table-uninitialized">' + 
                            '<img src="client/css/images/table-icon.png"/>' +
                            '<div>There is no data selected to generate a table.  Please use the criteria on the left to select data for your search.</div>' +
                        '</div>');
            }
        });
                
       //Render placeholders to the target
        var _render = Azavea.tryCatch('render nychanis search', function() {
            _$mapTitle = $('<div id="pdp-pdb-map-title" class="pdp-map-title"><div id="pdp-pdb-title-count"></div><div id="pdp-pdb-title-display"></div></div>').hide().appendTo(_options.mapTitleTarget);
            _$tableTitle = $('<div id="pdp-pdb-table-title" class="pdp-table-title pdp-pdb-table-title"></div>').hide().appendTo(_options.tableTitleTarget);
        });
        
        _self.init = Azavea.tryCatch('init pdb results', function() {
            _bindEvents();
            _render();
            _displayNoQueryMsg();
            
            // Cache some selectors
            _$mapCountTitle = $('#pdp-pdb-title-count');
            _$mapDisplayTitle = $('#pdp-pdb-title-display');
            
            //Init the table widget. This should automagically support
            //list and aggregation queries, plus sorting and paging.
            _table = P.Widget.Table({
                target: _options.tableTarget,
                pagerTarget: _options.tablePagerTarget,
                bindTo: P.Pdb,
                altRowClass: 'pdp-table-row-alt-pdb'
            }).init();
            
            //"Longview" is the modal dialog with streetview and the "long"
            //list of property details
            _longview = P.Widget.Longview({
                hideNoValues: true,
                modal: true,
                resizable: true,
                height: 600,
                width: 800,
                title: 'Property Description'
            }).init();
            
            //Init the column selector widget. This guy will trigger
            //events to tell the table to toggle column visiblity.
            P.Widget.ColumnSelector({
                target: _options.columnSelectTarget,
                bindTo: P.Pdb
            }).init();   

            //In the table export widget. Gets a CSV version of the table data.
            //Doesn't actually interact with the table widget.
            P.Widget.Export({
                target: _options.exportTarget,
                bindTo: P.Pdb
            }).init();
            
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-pdb-results.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-nychanis-search.js ********************/
(function(P) {
    P.Nychanis.Search = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P.Nychanis
            }, options),
            _criteria,
            _aggregations,
            _$button;

        //Render placeholders to the target
        var _render = Azavea.tryCatch('render nychanis search', function() {
            $('<div id="pdp-nychanis-search-criteria" class="pdp-nychanis-search-container">' + 
                '<h4>Indicator<span id="pdp-nyc-help-indicator" title="An indicator provides comparable information about a specific attribute of regions of New York City.  It does not affect which properties are displayed." class="ui-icon ui-icon-help pdp-nyc-filter-tooltip"></span></h4><div id="pdp-nychanis-indicator"></div>' + 
                '<h4>Geographic Boundary<span id="pdp-nyc-help-geo" title="You must choose geographic areas to calculate your indicator." class="ui-icon ui-icon-help pdp-nyc-filter-tooltip"></span></h4><div id="pdp-nychanis-resolution"></div>' + 
            '</div>' + 
            '<div id="pdp-nychanis-result-type" class="pdp-nychanis-search-container">' + 
                '<h4>Show my results in<span id="pdp-nyc-help-results" title="You must choose a time scale for your indicator. All indicators are available by year.  Depending on the indicator, there may be quarterly or monthly data. If you change nothing, the most recently selected time period will be mapped." class="ui-icon ui-icon-help pdp-nyc-filter-tooltip"></span></h4><div id="pdp-nychanis-time"></div>' + 
            '</div>' + 
            '<div class="pdp-search-actions"><button id="pdp-nychanis-button-search" class="pdp-button">Submit</button>' + 
            '<a id="pdp-nychanis-button-reset" href="javascript:void(0);">Clear</a></div>').appendTo(_options.target);
            
            _$button = $('#pdp-nychanis-button-search').button();
            
            // Enable the tooltops
            $('.pdp-nyc-filter-tooltip').tooltip({
                    tipClass: 'pdp-pdb-control-tooltip',
                    // place tooltip on the right edge
                    position: 'center right',
                    // a little tweaking of the position
                    offset: [-2, 10],
                    // use the built-in fadeIn/fadeOut effect
                    effect: "fade"
                });            
        });

        //Helper to enable/disable the nychanis search button
        var _enableSearch = Azavea.tryCatch('enable nychanis search button', function(event, data){
            if (data.resolutionName){
                _$button.button('option', 'disabled', false);
            } else {
                _$button.button('option', 'disabled', true);
            }
        });
        
        var _bindEvents = Azavea.tryCatch('bind nychanis search events', function(){
            //Someone clicked the search button
            $('#pdp-nychanis-button-search').click(function(){
                $(_options.bindTo).trigger('pdp-data-force-update');
            });
            
            //Someone clicked the reset button
            $('#pdp-nychanis-button-reset').click(function(){
                $(_options.bindTo).trigger('pdp-criteria-reset');
            });
            
            //Enable/disable the search button based on the resolution since
            //a search is only possible once a resolution is selected.
            $(_options.bindTo).bind('pdp-nychanis-resolution-change' , _enableSearch);
        });

        _self.init = Azavea.tryCatch('init nychanis search', function() {
            _render();
            _bindEvents();
        
            // Cannot search on init
            _$button.button('option', 'disabled', true);
        
            //Widget to select an indicator via category and subcategory
            P.Widget.NychanisIndicator({
                target: '#pdp-nychanis-indicator'
            }).init();
            
            //Widget to select a resolution with scope and subscope (basically
            //geographic filters of the resolution). Dependent on the indicator selected.
            P.Widget.NychanisResolution({
                target: '#pdp-nychanis-resolution'
            }).init();
            
            //Widget to select the "time" (years, quarters, months). Can 
            //be filtered by year (all quarters between 2006 and 2010).
            P.Widget.NychanisTime({
                target: '#pdp-nychanis-time'
            }).init();
            
            //Get the Nychanis metadata to populate the values of the
            //above widgets.
            P.Data.getNychanisMeta(function (attrResp) {
                $(_options.bindTo).trigger('pdp-nychanis-attributes', [ attrResp ]);
            });
            
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-nychanis-search.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-nychanis-results.js ********************/
(function(P) {
    P.Nychanis.Results = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P.Nychanis
            }, options),
            $mapTitle,
            $tableTitle,
            _table,
            _indicatorState,
            _resolutionState,
            _timeState, 
            _userRole = 'Public';

        // Parse the current search criteria into trackable analytics
        var _submitAnalytics = Azavea.tryCatch('submit pdb analytics', function(totalResults){
            var action = 'Nychanis | Search',
                label = '';
            
            // Track the features of this nychanis search
            label = 'Indicator = ' +  _indicatorState.Name;
            label += '| Resolution = ' +  _resolutionState.resolutionName; 
            if (_resolutionState.scopeName){
                label += '| Scope = ' + _resolutionState.scopeName;   
            }
            if (_resolutionState.subScopeName){
                label += '| Subscope = ' + _resolutionState.subScopeName;   
            }            
            
            label += '| TimeType = ' + _timeState.typeName;
            label += '| MinYear = ' + _timeState.minYear;
            label += '| MaxYear = ' + _timeState.maxYear;   
            
            P.Util.trackMetric(_userRole, action, label, totalResults);
            
        });

        var _updateLayout = Azavea.tryCatch('update nychanis table layout', function(){
            // Get the height of the table toolbar
            var h = parseFloat($(options.tableTitleTarget).height());
            if (h === 0){
                h = 50;
            }
            
            $(options.tableTarget).css('margin-top', h + 'px');
            $(options.tableTarget).css('top', '0px');
        });
        
        // The map and table will have different titles because the user sees only 1 year at a time
        //  on the map, and several years at once in the table.  They need to account for this difference
        var _updateTitle = Azavea.tryCatch('update nychanis title', function(mapYear) {
            var timePart, mapTimePart, mapTitle, title, h;
            
            if (_timeState.minYear === _timeState.maxYear) {
                timePart = ' for ' + _timeState.minYear;
            } else {
                timePart = ' from '  + _timeState.minYear + ' to ' + _timeState.maxYear;
            }
            
            title = _indicatorState.Name + ' by ' + _resolutionState.resolutionName + timePart;
            
            // Assemble the map title based on the information we have
            mapTimePart = mapYear ? ' for ' + mapYear : '';
            mapTitle = _indicatorState.Name + ' by ' + _resolutionState.resolutionName + mapTimePart;
            
            // Remove the "no search yet" message
            $('#pdp-nyc-table-uninitialized').remove();
            
            $mapTitle.html(mapTitle).show();
            $tableTitle.html(title).show();
            
        });

        var _getData = Azavea.tryCatch('get nychanis data', function(page, pageSize, colIndex, sortAsc) {
           
            P.Data.getNychanis(pageSize, page, colIndex, sortAsc,
                _indicatorState.UID, _resolutionState.resolution, _timeState.type,
                _timeState.minYear, _timeState.maxYear, _resolutionState.scope, _resolutionState.subScope,
                function(data) {
                    // Submit analytics for this search
                    _submitAnalytics(data.TotalResults);
                    
                    _updateTitle();
                    
                    // Update the layout
                    _updateLayout();
                               
                    $(_options.bindTo).trigger('pdp-data-response', [data]);
                }, function(){
                    // Error, tell loading indicator to go away
                    $(_options.bindTo).trigger('pdp-loading-finished');
                });
        });

        // Caches the highest role of the current user, for analytics only
        var _setUserRole = Azavea.tryCatch('set user role nychanis', function(user){
                if (user){
                    if (user.Admin || user.Limited){
                        _userRole = 'Agency';
                        return;
                    }
                }        
                _userRole = 'Public';
        });
                
        var _bindEvents = Azavea.tryCatch('bind nychanis result events', function(){
            
            // Login status            
            $(_options.bindTo).bind('pdp-login-status-refresh', function(event, user){
                _setUserRole(user);
            });
             $(P).bind('pdp-login-success', function(event, user){
                _setUserRole(user);
            });
                        
            $(_options.bindTo).bind('pdp-data-request', function(event, page, pageSize, colIndex, sortAsc) {
                _getData(page, pageSize, colIndex, sortAsc);
            });
            
            $(_options.bindTo).bind('pdp-nychanis-indicator-change', function(event, state) {
                _indicatorState = state;
            });
            
            $(_options.bindTo).bind('pdp-nychanis-resolution-change', function(event, state) {
                _resolutionState = state;
            });

            $(_options.bindTo).bind('pdp-nychanis-time-change', function(event, state) {
                _timeState = state;
            });
            
            $(_options.bindTo).bind('pdp-export-request', function(event) {
                // Track export request
                P.Util.trackMetric(_userRole, 'Nychanis | Export' );
                P.Data.getNychanisCsv(_indicatorState.UID, _resolutionState.resolution, _timeState.type,
                        _timeState.minYear, _timeState.maxYear, _resolutionState.scope, _resolutionState.subScope);
            }); 
            
            $(_options.bindTo).bind('pdp-nychanis-layer-change'  , function(event, data, index, value) {
                _updateTitle(value);
            });
            
            $(_options.bindTo).bind('pdp-criteria-reset', function() {
                $mapTitle.hide();
                $tableTitle.hide();
                _displayNoQueryMsg();
            });
            
            $(window).resize(function() {
                _updateLayout();
            });        
        });

        // Displays a message in the empty space where a table will be
        var _displayNoQueryMsg = Azavea.tryCatch('display pdb no query message', function(){
            if ($('#pdp-nyc-table-uninitialized').length === 0){
                $(options.tableTitleTarget).append('<div id="pdp-nyc-table-uninitialized" class="pdp-table-uninitialized">' + 
                            '<img src="client/css/images/table-icon.png"/>' +
                            '<div>There is no data selected to generate a table.  Please select an indicator to the left to view neighborhood information.</div>' + 
                        '</div>');
            }
        });

        //Render placeholders to the target
        var _render = Azavea.tryCatch('render nychanis search', function() {
            $mapTitle = $('<div id="pdp-nychanis-map-title" class="pdp-map-title"></div>').hide().appendTo(_options.mapTitleTarget);
            $tableTitle = $('<div id="pdp-nychanis-table-title" class="pdp-table-title"></div>').hide().appendTo(_options.tableTitleTarget);
        });

        _self.init = Azavea.tryCatch('init nychanis results', function() {
            _render();
            _bindEvents();
            _displayNoQueryMsg();
            
            //Init the table widget. This should automagically support
            //list and aggregation queries, plus sorting and paging.
            _table = P.Widget.Table({
                target: _options.tableTarget,
                pagerTarget: _options.tablePagerTarget,
                bindTo: P.Nychanis,
                altRowClass: 'pdp-table-row-alt-nyc'
            }).init();

            P.Widget.Export({
                target: _options.exportTarget,
                bindTo: P.Nychanis
            }).init();
            
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-nychanis-results.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-loading-indicator.js ********************/
(function(P) {
    P.Widget.LoadingIndicator = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: [P, P.Nychanis,P.Pdb],
                delay: 500
            }, options),
            _$indicator,
            _$overlay,
            _timer;

        var _showIndicator = Azavea.tryCatch('show loader indicator', function(){
            var w, h;
            w = $(window).width() /2;
            h = $(window).height() /2;

            // Place it roughly center
            _$indicator.css('top', h - _$indicator.height() / 2);
            _$indicator.css('left', w - _$indicator.width() / 2);
            
            // Wait a bit before displaying, in case the call is actually really fast
            _timer = setTimeout(function(){
                // Using jquery for opacity so we don't need transparent png, and IE inconsistancies.
                _$overlay.fadeTo('fast', 0.5);
                _$indicator.show();
            }, _options.delay);
        });
        
        // Hide the overlay and indicator        
        var _hideIndicator = Azavea.tryCatch('hide loader indicator', function(){
            // Clear the timeout, in case the call was fast enough to not warrant a display
            clearTimeout(_timer);
            _$overlay.fadeTo('fast', 0.0, function(){
                _$overlay.hide();
            });
            
            _$indicator.hide();
        });
        
        // Bind to events that this widget cares about
        var _bindEvents = Azavea.tryCatch('bind indicator events', function(){
            // We will bind to many things
            $.each(_options.bindTo, function(i, obj){
                $(obj).bind('pdp-data-request', _showIndicator);
                $(obj).bind('pdp-loading-indicator-request', _showIndicator);
                //$(obj).bind('pdp-data-response', _hideIndicator);
                $(obj).bind('pdp-loading-finished', _hideIndicator);
             });
        });
        
        // Render the indicator and overlay to the screen, hidden
        var _render = Azavea.tryCatch('render loader indicator', function(){
            _$overlay = $('<div id="pdp-loading-overlay"></div>');
            _$indicator = $('<div id="pdp-loading-indicator" class="ui-corner-all"></div>');
            _$overlay
                .hide()
                .appendTo(_options.target);
            _$indicator
                .hide()
                .appendTo(_options.target);
        });
                
        // Initialize the loader widget            
        _self.init = Azavea.tryCatch('init app', function() {  
            _render();
            _bindEvents();

            _$indicator = $('#pdp-loading-indicator');                     
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-loading-indicator.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-splash.js ********************/
(function(P) {
    P.Widget.Splash = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P,
                cookieName: 'pdp-ignore-splash',
                expireYear: 2020,
                backgroundOpacity: 0.3
            }, options),
            _$splash,
            _$screen;
        
        var _updateLayoutHeight = Azavea.tryCatch('update layout height', function() {
            
            var w, h;
            var $window = $(window);
            
            w = $window.width() /2;
            h = $window.height() /2;
            
            _$screen.css('height', $window.height() - 50);
            
            var top = h - _$screen.height() / 2;
            
            // Place it roughly center
            _$screen.css('top', top < 5 ? 5 : top);
            _$screen.css('left', w - _$screen.width() / 2);
            
        });
                
        //<summary>
        // Sets a cookie to never expire and not to show the splash
        //</summary>
        var _setCookie = Azavea.tryCatch('set splash cookie', function(){
            var expires = new Date();
            // Calculate a day to expire
            expires.setFullYear(_options.expireYear, 1, 1);
                
            // Create the cookie    
            document.cookie = _options.cookieName + '=true;expires=' + expires.toUTCString(); 
        });

        //<summary>
        // Deletes the cookie to suppress splash screen
        //</summary>
        var _deleteCookie = Azavea.tryCatch('set splash cookie', function(){
            var expires = new Date();
            
            // Calculate a day to expire on year in the past
            expires.setFullYear(expires.getFullYear - 1, 1,1);                       
            
            // Set the cookie
            document.cookie = _options.cookieName + '=false;expires=' + expires.toUTCString(); 
        });
        
        //<summary>
        // Render the markup to the screen.  This is an overlay div for the screen with a second
        //  div for displaying our message.  Includes a do not show again checkbox.
        //</summary>
        var _render = Azavea.tryCatch('render splash', function(){
            $('<div id="pdp-splash-overlay"></div>' + 
            '<div id="pdp-splash-screen" class="ui-corner-all pdp-shadow-dark-all">' + 
                '<h2>Welcome to the Furman Center\'s Data Search Tool</h2>' + 
                '<div id="pdp-splash-screen-content">' +
                    '<div id="pdp-splash-search-descriptions">' +   
                        '<div><span><strong>Neighborhood Info:</strong> View or download tables and maps of historic and contemporary housing, demographic, and community information at a variety of neighborhood sizes in New York City.</span></div>' +
                        '<div><span><strong>Affordable Housing (SHIP):</strong> View or download tables and  maps of thousands of New York City properties in the Furman Center\'s SHIP (Subsidized Housing Information Project) database.</span></div>' +
                    '</div>' +
                    '<table id="pdp-splash-table">' + 
                        '<tr class="pdp-splash-image-row">' + 
                            '<td><img width="190px" height="240px" src="client/css/images/splash/splash-nychanis.png"></td>' + 
                            '<td><img width="190px" height="240px" src="client/css/images/splash/splash-property.png"></td>' +
                        '<tr class="pdp-splash-link-row">' + 
                            '<td><a id="pdp-splash-nychanis" class="pdp-splash-link" href="javascript:void(0);">Neighborhood Search</a></td>' + 
                            '<td><a id="pdp-splash-property" class="pdp-splash-link" href="javascript:void(0);">Housing (SHIP) Search</a></td>' + 
                    '</table>' +
                    '<div id="pdp-splash-search-instructions">' +   
                        '<div>You may switch between Neighborhood Info and Housing (SHIP) using their tabs, and display both on the same map.  Choices made beneath one tab do not modify the other\'s results.</div>' +
                    '</div>' +                    
                '</div>' + 
                '<div id="pdp-splash-buttonbar">' + 
                    '<div id="pdp-splash-linkbar">' +
                        '<a href="http://www.furmancenter.org/data/">Furman Center Data</a>' +
                        '<a href="http://www.furmancenter.org/data/search/guide/">How-to Guide</a>' + 
                        '<a href="http://www.furmancenter.org/data/disclaimer/">Disclaimer</a>' + 
                    '</div>' + 
                    '<a id="pdp-splash-skip" href="javascript:void(0);">Skip</a>' +
                    '<input id="pdp-splash-no-show" type="checkbox" class="pdp-input pdp-input-checkbox left"/>' + 
                    '<label for="pdp-splash-no-show" class="left">Do not show again</label>' +                
                '</div>' + 
                '<div id="pdp-splash-support">This site supports Firefox 3+, Internet Explorer 7+ and Chrome 4+.</div>' + 
            '</div>').appendTo(_options.target);
        });

        //<summary>
        // Display the splash screen and overlay, make it pretty
        //</summary>
        var _display = Azavea.tryCatch('display splash screen', function(){           
            
            _updateLayoutHeight();
            $(window).resize(function() {
                _updateLayoutHeight();
            });
            _$splash.fadeTo('fast', _options.backgroundOpacity);
        });
        
        //<summary>
        // Hide the splash screen and overlay
        //</summary>
        var _hide = Azavea.tryCatch('hide splash screen', function(){
            _$splash.fadeOut();
            _$screen.fadeOut();            
        });        
        
        //<summary>
        // Bind to events that this widget cares about.
        //</summary>
        var _bindEvents = Azavea.tryCatch('bind to events splash', function(){
            var $doNotShow = $('#pdp-splash-no-show'),
                $skip = $('#pdp-splash-skip');
            
            _$splash = $('#pdp-splash-overlay');                
            _$screen = $('#pdp-splash-screen');    
            
            // Handle nychanis link click
            $('#pdp-splash-nychanis', _$screen).click(function(){
                // Activate the nychanis tab
                $('a[href="#pdp-nychanis-view"]').click();
                _hide();
            });
            
            // Handle property link click
            $('#pdp-splash-property', _$screen).click(function(){
                // Activate the property tab
                $('a[href="#pdp-pdb-view"]').click();
                _hide();
            });       
            
            // Handle property counts link click
            $('#pdp-splash-counts', _$screen).click(function(){
                // Activate the propery counts tab
                $('#pdp-pdb-search-result-counts').change();
                
                // Show the popup
                $(P.Pdb).trigger('pdp-show-counts-panel');
                
                _hide();
            });    
                             
            // Handle the "Do not show" checkbox
            $($doNotShow, _$splash).change(function(event){
                if ($doNotShow.is(':checked')){
                    // Set a cookie to not show again
                    _setCookie();
                }else{
                    // Delete the cookie so splash is shown again
                    _deleteCookie();   
                }
            });
            
            // Handle the ok button
            $($skip, _$splash).click(function(event){
                _hide();
            });            
            
            // Hide on escape (keycode: 27)
            _$splash.keydown(function(event){
                if (event.keyCode === 27){
                    _hide();
                }
            });            
        });
        
        //<summary>
        // Check the value of the no-show cookie to determine if we show the screen
        //</summary>
        var _doShow = Azavea.tryCatch('bind to events splash', function(){
            var index = -1,
                start = 0, 
                end = 0,
                val = '';
            
            if (document.cookie.length > 0){
                // Check if the splash cookie exists
                index = document.cookie.indexOf(_options.cookieName + "=");
                
                if (index !== -1){
                    // Read the cookie string to the end of the first semicolon
                    start = index + _options.cookieName.length + 1;
                    end = document.cookie.indexOf(";", start);
                    
                    if (end === -1){
                        end = document.cookie.length;
                    }
                    
                    // If we have suppressed splash, return false - it is not shown
                    val = unescape(document.cookie.substring(start, end));
                    if (val === 'true'){
                        return false;
                    } else{
                        return true;
                    }
                }
            }
            return true;            
        });
                                
        //<summary>
        // Initializes the splash screen
        //</summary>
        _self.init = Azavea.tryCatch('init splash', function() {
            if (_doShow()){
                // Create and display our splash form
                _render();
                _bindEvents();
                _display();
            }
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-widget-splash.js ********************/


/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-app.js ********************/
(function(P) {
    P.App = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P,
                tabTarget: ''
            }, options),
            _uiState = {
                dataType: 'pdp-pdb-view',
                uiType: 'pdp-map-view'
            },
            _$main,
            _$tabContainer;

        //Toggles what functionality is currently visible, based on the state.
        //This works by using multiple classes on elements in the DOM. You can
        //find them on default.aspx.
        //PDB/Table, Nychanis/Table, PDB/Map, or Nychanis/Map
        var _updateContent = Azavea.tryCatch('update main content', function() {
            $('.pdp-main-content').hide();
            $('.' + _uiState.dataType + '.' + _uiState.uiType).show();
            
        });

        //Helper to update the data (PDB/Nychanis) type state and update the UI
        var _setDataTypeState = Azavea.tryCatch('set data type state', function(dataId) {
            
            // To get the border around the main content, add a dataType class
            _$main.removeClass(_uiState.dataType)
                .addClass(dataId);
                
            _$tabContainer.removeClass(_uiState.dataType)
                .addClass(dataId);
            
            _uiState.dataType = dataId;
            _updateContent();
        });
        
       //Helper to update the UI (Table/Map) type state and update the UI 
        var _setUiTypeState = Azavea.tryCatch('set ui type state', function(uiId) {
            _uiState.uiType = uiId;
            _updateContent();
            
            // Track switching between map and table
            P.Util.trackMetric('Application', 'UI State', uiId);
        });
            
        //Sets all of the important heights so that we always use all of the
        //vertical height but never have scrollbars (ie. a border layout of sorts).
        var _updateLayoutHeight = Azavea.tryCatch('update layout height', function($content, $header, $window, $toolbar) {
            var h = $header.outerHeight();
            var w = $window.height();
            
            $content.outerHeight(w - h);
            _$main.outerHeight(w - h - $toolbar.outerHeight());
            _$tabContent.outerHeight(w - h - $toolbar.outerHeight());
        });
        
        //Caches the main layout elements and initializes the heights to
        //always use all of the vertical height but never have scrollbars
        var _initLayoutHeight = Azavea.tryCatch('init layout height', function() {
            var $header = $('#header');
            var $content = $('#content');
            var $toolbar = $('#pdp-main-toolbar');
            var $window = $(window);
            
            _updateLayoutHeight($content, $header, $window, $toolbar);
            $window.resize(function() {
                _updateLayoutHeight($content, $header, $window, $toolbar);
            });
        });
        
        //Init the Nychanis and PDB tabs
        var _initTabs = Azavea.tryCatch('init layout tabs', function(){
            //Hide all of the tab content
            $(_options.tabTarget + ' .pdp-tab-content').hide();
            
            //Show the content for the first tab
            $(_options.tabTarget + ' .pdp-tab-content:first').show();
            
            //Activate the first tab
            $(_options.tabTarget + ' .pdp-tab:first').addClass('active');

            // Save tab state to be able to switch between tabs on click
            $(_options.tabTarget + ' .pdp-tab a').click(function() {
                var previousId = $(_options.tabTarget + ' .pdp-tab.active').attr('id');
                
                $(_options.tabTarget + ' .pdp-tab').removeClass('active');
                $(this).parent().addClass('active');
                
                var $currentTab = $($(this).attr('href'));
                var currentId = $currentTab.attr('id');
                if (previousId !== currentId) {
                    $(_options.tabTarget + ' .pdp-tab-content').hide();
                    $currentTab.show();
                    
                    _setDataTypeState(currentId);
                }
                return false;
            });
        });
        
        //Init the Table/Map radio button
        var _initViewToolbar = Azavea.tryCatch('init data view picker', function(){
            $(_options.dataViewPickerTarget).buttonset();

            $('label', _options.dataViewPickerTarget)
                .click(function(event) {
                    _setUiTypeState($(this).attr('for'));
                });
        });
        
        var _initNoDataAlert = Azavea.tryCatch('init no data alerts', function(){
            $(P.Nychanis).bind('pdp-data-response', function(event, data) {
                if (!data.Values || !data.Values.length) {
                    P.Util.quickAlert('No results matched your search');
                }
            });
            
            $(P.Pdb).bind('pdp-data-response', function(event, data) {
                if (!data.TotalResults) {
                    P.Util.quickAlert('No results matched your search');
                }
            });
        });
        
        _self.getAppUrl = Azavea.tryCatch('get app url', function(){
            return _options.appUrl;
        });
        
        _self.init = Azavea.tryCatch('init app', function() {
            _$main = $('#pdp-main');
            _$tabContainer = $('#pdp-tab-container');
            _$tabContent = $('.pdp-tab-content-container');
            
            //A widget to show that something is happening.
            P.Widget.LoadingIndicator({
                delay: 100
            }).init();
            
            $(_options.bindTo).trigger('pdp-loading-indicator-request');
            
            // Sign-up widget setup
            PDP.Widget.Signup({
                target: '#signup'
            }).init();
            
            // Login widget setup
            PDP.Widget.Login({ 
                target: '#login',
                profileUrl: 'user/profile.aspx',
                logoutUrl: 'default.aspx',
                adminUrl: 'admin/manage-users.aspx',
                appUrl: _options.appUrl
            }).init();

                                
            _initLayoutHeight();
            _initTabs();
            _initViewToolbar();
            _updateContent();
            _setDataTypeState(_uiState.dataType);
            _initNoDataAlert();

            //Dark lord of all PDB results
            PDP.Pdb.Results({ 
                tableTarget: '#pdp-pdb-table-data',
                tablePagerTarget: '#pdp-pdb-table-pager',
                columnSelectTarget: '#pdp-pdb-table-col-selector',
                exportTarget: '#pdp-pdb-table-export',
                mapTitleTarget: '#pdp-map-title-content',
                tableTitleTarget: '#pdp-pdb-table-toolbar'                
            }).init();
     
            //Dark lord of all PDB searches
            PDP.Pdb.Search({ 
                target: '#pdp-pdb-view'
            }).init();
            
            //Dark lord of all Nychanis searches
            PDP.Nychanis.Search({ 
                target: '#pdp-nychanis-view'
            }).init();

            //Dark lord of all Nychanis results
            PDP.Nychanis.Results({ 
                tableTarget: '#pdp-nychanis-table-data',
                tablePagerTarget: '#pdp-nychanis-table-pager',
                exportTarget: '#pdp-nychanis-table-export',
                mapTitleTarget: '#pdp-map-title-content',
                tableTitleTarget: '#pdp-nychanis-table-toolbar'
            }).init();

            // If google is gone, tell the user the map isn't working.  Tables are ok though.
            try{
                //Lord of the Map - both Nychanis and PDB
                P.Widget.Map({
                    target: '#pdp-map-content'
                }).init();
            }
            catch(err){
                Azavea.log(err);
                P.Util.alert('Google Maps is currently unavailable.  You will not be able to view any map data, however, your search results will still be displayed in the table view.  \nPlease try refreshing your browser to reload Google Maps.', 'Google Maps Unavailable');
            }
            
            // Broadcast login status to any widgets listening
            P.Util.initLoginStatus();   
            
            //A nifty little widget to make sure that panels are
            //mutually exclusive.
            P.Widget.PanelCloser().init();
                        
            // Setup Feedbacker of doom
            var f = Feedbacker.init({
                    orientation: 'left',
                    css: {
                        'z-index': 9999, 
                        bottom: '40px'
                         },
                    onSuccess: function(){
                        P.Util.quickAlert('Thank you for sending your feedback!', 'Feedback Submitted');
                    } 
                });
            
            // A bit of magic here, to ensure that everything is lined up correctly
            $(window).resize();
            
            // Everything is set up, display the splash screen if needed
            P.Widget.Splash({
                backgroundOpacity: 0.5
            }).init();
            
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-app.js ********************/

