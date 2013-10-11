/* CollidR.Core.js /
/*
 * CollidR JavaScript Library v0.1.0
 * http://github.com/MisterJames/CollidR
 *
 * Copyright James Chambers. All rights reserved.
 * Licensed under Apache 2.0 https://github.com/MisterJames/CollidR/wiki/CollidR-License
 */

/// <reference path="jquery-1.9.1.js" />
/// <reference path="jquery.signalr-1.1.3.js" />

(function ($, window) {
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("CollidR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before referencing CollidR.");
    }

    // ==================================================
    // events 
    // ==================================================
    var events = {
        onEnterField: "onEnterField",
        onExitField: "onExitField",
        onEditorsUpdated: "onEditorsUpdated",
        onEditorDisconnected: "onEditorDisconnected",
        onEditorConnected: "onEditorConnected",
        onFieldModified: "onFieldModified",
        onModelSave: "onModelSave"
    };

    var log = function (msg, logging) {
        if (logging === false) {
            return;
        }
        if (typeof (window.console) === "undefined") {
            return;
        }
        var m;
        m = "[" + new Date().toTimeString() + "] CollidR: " + msg;
        //settings.editLog.append($("<li>" + m + "</li>"));
        if (window.console.debug) {
            window.console.debug(m);
        } else if (window.console.log) {
            window.console.log(m);
        }
    };

    $.collidR = function (options) {

        // ==================================================
        // settings and logging
        // ==================================================
        var settings = $.extend({
            entityType: "",
            entityId: 0,
            editLog: $(''),
            decorationFormat: "twitter.bootstrap.3.0",
            decorate: true,
        }, options);

        // ==================================================
        var connection = $.hubConnection();
        var hubName = 'CollidRHub';
        var hubProxy = connection.createHubProxy(hubName);

        // ==================================================
        // client side methods (called from server)
        // ==================================================
        hubProxy.on('showMessage', function (name, message) {
            log(name + ': ' + message);
        });

        hubProxy.on('enterField', function (name, field) {
            $(window).triggerHandler(events.onEnterField, { field: field, name: name });
            log(name + " has entered " + field);
        });

        hubProxy.on('exitField', function (name, field) {
            $(window).triggerHandler(events.onExitField, { field: field, name: name });
            log(name + " has left " + field);
        });

        hubProxy.on('updateEditorList', function (names) {
            $("#editors").html(names);
            $(window).triggerHandler(events.onEditorsUpdated, [{ names: names }]);
            log('New editor list: ' + names);
        });

        hubProxy.on('editorConnected', function (username) {
            $(window).triggerHandler(events.onEditorConnected, { username: username });
            log(username + " has joined this page.");
        });

        hubProxy.on('editorDisconnected', function (username) {
            $(window).triggerHandler(events.onEditorDisconnected, { username: username });
            log(username + " has left this page.");
        });

        hubProxy.on('saveModel', function (username) {
            $(window).triggerHandler(events.onModelSave, { username: username });
            log(username + " has saved this entity.");
        });

        hubProxy.on('modifyField', function (name, field, value) {
            $(window).triggerHandler(events.onFieldModified, { field: field, name: name, value: value });
            log(name + " has changed the value of " + field + " to " + value);
        });

        // ==================================================
        // client side methods (to call server)
        // ==================================================
        var lastField = "";

        function enterField(element) {

            var fieldId = element.id;

            // no point in sending notifications on unknown fields
            if (fieldId) {

                // don't resend if we've already notified...usually has to do with a window focus (especially Chrome)
                if (!(lastField === fieldId)) {
                    hubProxy.invoke("enterField", fieldId, settings.entityId, settings.entityType);
                    lastField = fieldId;
                    log("Entered " + fieldId + ", sending notification.");
                }

            }
        }

        function exitField(element) {

            var fieldId = element.id;

            // no point in sending notifications on unknown fields
            if (fieldId) {
                hubProxy.invoke("exitField", fieldId, settings.entityId, settings.entityType);
                lastField = "";
                log("Exiting " + fieldId + ", sending notification.");
            }
        }

        function modifyField(element) {

            var fieldId = element.id;

            // no point in sending notifications on unknown fields
            if (fieldId) {
                hubProxy.invoke("modifyField", fieldId, settings.entityId, settings.entityType, element.value);
                lastField = "";
                log("Changed value in " + fieldId + ", sending notification.");
            }
        }

        // ==================================================
        // public methods
        // ==================================================
        this.registerClient = function () {
            connection.start().done(function () {
                hubProxy.invoke("joinModel", settings.entityId, settings.entityType);

                var message = "registered: " + settings.entityType + ' of ' + settings.entityId;
                log(message, true);

                // wire up form events
                $(":input").focus(function () { enterField(this); });
                $(":input").blur(function () { exitField(this); });
                $(":input").change(function () { modifyField(this); });
            });

        };

        // ==================================================
        // data-api-ish stuff
        // ==================================================
        $('[data-collidR="log"]').each(function () {
            settings.editLog = $(this);
        })

    };

    // ==================================================
    // more data-api-ish stuff
    // ==================================================
    var autoFormatters = {
        editorsPane: $('[data-collidR="editorsPane"]'),
        editorsList: $('[data-collidR="editorsList"]'),
        reloadEditor: $('[data-collidR="reloadEditor"]'),
        reloadWarning: $('[data-collidR="reloadWarning"]')
    };

    $.collidR.prototype.events = events;
    $.collidR.prototype.log = log;
    $.collidR.prototype.autoFormatters = autoFormatters;

}(window.jQuery, window));

/* CollidR.stringDictionary.js */
/*
 * stringDictionary for CollidR JavaScript Library v0.1.0
 * http://github.com/MisterJames/CollidR
 *
 * Copyright James Chambers. All rights reserved.
 * Licensed under Apache 2.0 https://github.com/MisterJames/CollidR/wiki/CollidR-License
 */
(function ($, window) {
    "use strict";

    $.stringDictionary = function () {
        this.data = {};

        // adds a unique value to the array stored in 'key'
        this.add = function (key, value) {

            var hasKey = this.data[key];
            if (hasKey) {
                if (!this.contains(key, value)) {
                    this.data[key].push(value);
                }
            } else {
                this.data[key] = new Array();
                this.data[key].push(value);
            }
        };

        // attempts to remove the value from the array in 'key'
        this.remove = function (key, value) {

            var values = this.data[key];
            var index = values.indexOf(value);

            if (index > -1) {
                values.splice(index, 1);
            }

        };

        // attempts to remove the value from all keys
        this.removeValue = function (value) {
            var result = new Array();
            for (var key in this.data) {
                var values = this.data[key];
                var index = values.indexOf(value);

                if (index > -1) {
                    values.splice(index, 1);
                    result.push(key);
                }
            }
            return result;
        }

        // dumps the entire map to the console
        this.dumpFields = function () {
            console.log(this.data);
            for (var key in this.data) {
                var values = this.data[key];
                for (var index in values) {
                    var msg = key + ':' + values[index];
                    console.log(msg);
                    $("#foo").append($('<p>').html(msg));
                }
            }
            console.log('-----');
        }

        // checks to see if a value is present in the map
        this.contains = function (key, value) {
            return (this.data[key].indexOf(value) > -1);
        }

        // helper method to get the list of keys
        this.keys = function () {
            var result = new Array();
            for (var key in this.data) {
                result.push(key);
            }
            return result;
        }

        // clears all the data
        this.clear = function () {
            this.data = {};
        }

    };
}(window.jQuery, window));


/* CollidR.BootstrapFormatter.js */
/*
 * Twitter.Bootstrap Formatter for CollidR JavaScript Library v0.1.0
 * http://github.com/MisterJames/CollidR
 *
 * Copyright James Chambers. All rights reserved.
 * Licensed under Apache 2.0 https://github.com/MisterJames/CollidR/wiki/CollidR-License
 * Applies changes to the page based on the Twitter Bootstrap library
 */
(function ($, window) {
    "use strict";

    if (typeof ($.fn.alert) === undefined) {
        collidR.log(" *** The Bootstrap Formatter could not be initialized because it appears that Bootstrap.js is not loaded.");
    }
    else {
        // we only wire up for Bootstrap if it's loaded
        var collidR = new $.collidR;
        var fieldMap = new $.stringDictionary();

        $(window).on(collidR.events.onEditorsUpdated, function (e, data) {
            collidR.log("Editors updated with: " + data.names);

            // get the count of users to format accordingly
            var users = data.names.split(',');
            if (users.length === 1) {
                // format
                collidR.autoFormatters.editorsPane
                    .removeClass('alert-warning')
                    .addClass('alert-success');
                // set the text
                collidR.autoFormatters.editorsList.html('<span class="glyphicon glyphicon-thumbs-up"></span> You are the only editor.');
            }
            else {
                // format
                collidR.autoFormatters.editorsPane
                    .removeClass('alert-success')
                    .addClass('alert-warning');
                // set the text
                collidR.autoFormatters.editorsList.html('<span class="glyphicon glyphicon-eye-open"></span> There are currently ' + users.length + ' editors: ' + data.names);
            }

        });

        $(window).on(collidR.events.onEnterField, function (e, data) {
            collidR.log("Field " + data.field + " entered by " + data.name);
            fieldMap.add(data.field, data.name);
            fieldMap.dumpFields();

            showToolTip(data.field);

        });

        $(window).on(collidR.events.onExitField, function (e, data) {
            collidR.log("Field " + data.field + " left by " + data.name);
            fieldMap.remove(data.field, data.name);

            showToolTip(data.field);

        });

        $(window).on(collidR.events.onEditorConnected, function (e, data) {
            collidR.log(data.name + " has joined this entity.");
        });

        $(window).on(collidR.events.onEditorDisconnected, function (e, data) {
            // get the list of fields the user was part of
            // by calling removeValue
            var fields = fieldMap.removeValue(data.username);

            // foreach the list of fields, and update the related tooltips
            $.each(fields, function (index, value) {
                showToolTip(value);
            });

            collidR.log(data.name + " has left this entity.");
        });

        $(window).on(collidR.events.onFieldModified, function (e, data) {
            collidR.autoFormatters.editorsPane.hide();
            collidR.autoFormatters.reloadEditor.html(data.name);
            collidR.autoFormatters.reloadWarning.removeClass('hide');

            // this is where we'll do something interesting with the data (shadow
            collidR.log(data.name + " has changed " + data.field + " to " + data.value);

        });

        $(window).on(collidR.events.onModelSave, function (e, data) {

            collidR.log(data.name + " has saved this entity.");
        });

        var showToolTip = function (field) {
            var fieldName = '#' + field;

            if (fieldMap.data[field].length > 0) {
                var message = 'This field is being edited by:' + fieldMap.data[field].join();
                console.log(message);

                // set up the tooltip
                $(fieldName)
                    .attr('title', message)
                    .attr('data-trigger', 'manual')
                    .tooltip('fixTitle')
                    .tooltip('show');
            }
            else {
                // hide the tooltip
                $(fieldName)
                    .attr('title', '')
                    .tooltip('hide');
            }
        }

    }

}(window.jQuery, window));
