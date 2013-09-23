
/******************** Begin C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-profile.js ********************/
(function(P) {
    P.Profile = function(options) {
        var _self = {},
            _options = $.extend({
                target: 'body',
                bindTo: P,
                fields: [
                    { id:'name', required:true },
                    { id:'email', required:true, validator:'email' },
                    { id:'password', required:true, type:'password', validator:'password' },
                    { id:'password-2', required:true, type:'password' }
                ]
            }, options);
        
        // Display error message
        var _displayErrorMsg = function(msg) {
            $('<span class="pdp-form-messages ui-state-error">' + msg + '</span>').appendTo('.pdp-form');
            $('#pdp-signup-button').removeClass('pdp-input-button-disabled').val('Update');
        };
        
        // Show hide div container around password elements
        var _togglePasswordElements = function() {
            $('#pdp-password-container').toggle(this.checked);
        };
        
        // Populates form data elements with user data
        var _populateUserDataElements = function(user) {
            $('#pdp-name').val(user.Name);
            $('#pdp-email').val(user.Email);
        };
            
        _self.init = Azavea.tryCatch('init profile', function() {
            
            // Set the right ref path
            P.Data.path = '../';

            // Login widget setup
            PDP.Widget.Login({ 
                target: '#login',
                profileUrl: 'user/profile.aspx',
                logoutUrl: 'default.aspx',
                adminUrl: 'admin/manage-users.aspx',
                appUrl: _options.appUrl
            }).init();
            
            P.Util.initLoginStatus();  

            // Set focus to first element
            $('.pdp-input:first').focus();
            
            // Uncheck change password ckbox, hide password elements
            $('#pdp-change-password').attr('checked', false);
            _togglePasswordElements();

            // Get the user data and pre-populate the user fields                      
            P.Data.getUser( _options.userName, _populateUserDataElements);
            
            // Show password fields only if the checkbox is selected
            $('#pdp-change-password').change(_togglePasswordElements);
            
            // Enable form submission by hitting "enter" (keycode = 13) in form
            $('#pdp-password-2').keyup(function(event){
                if (event.which === 13){
                    $('#pdp-update-button').click();
                }
            });
            $('#pdp-email').keyup(function(event){
                if (event.which === 13){
                    $('#pdp-update-button').click();
                }
            });
            
            // Bind a click event
            $('#pdp-update-button').button().click(function() {
                if(!$(this).hasClass('pdp-input-button-disabled')) {
                    $('.pdp-form-messages').remove();
                    
                    // Disable from clicking twice
                    $(this).addClass('pdp-input-button-disabled').val('Saving...');
                    
                    // Validate our few fields
                    if(P.Form.validate(_options.fields, {}, _options.target, P.prefix)) {
                            var password = $('#pdp-password').val(),
                            name = $('#pdp-name').val(),
                            email = $('#pdp-email').val();
                            roles = '';
                        
                        // Send the data to be updated
                        P.Data.updateUser( _options.userName, name, email, password, roles, function(user) {
                                //Success
                                P.Util.quickAlert('Your profile has been updated.');
                                
                                // Let the login people know that the info has changed
                                $(_options.bindTo).trigger('pdp-login-status-refresh', [user]);
                                
                            }, function(respText) {
                                // Failure
                                _displayErrorMsg(respText);
                            });
                    } else {
                        _displayErrorMsg('All fields are required.');
                        $('.pdp-input-invalid:first').focus();
                    }
                    
                    // Re-enable the update button
                    $(this).removeClass('pdp-input-button-disabled').val('Update');
                }
            });
        
            return _self;
        });
        
        return _self;
    };
}(PDP));
/********************   End C:\projects\NYU_NYCHANIS\csharp\Furman.PDP.Web\clientsrc\pdp\pdp-profile.js ********************/


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

