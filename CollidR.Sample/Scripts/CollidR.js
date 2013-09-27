/* CollidR.js */
/*
 * CollidR JavaScript Library v0.1.0
 * http://github.com/MisterJames/CollidR
 *
 * Copyright James Chambers. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/MisterJames/CollidR/wiki/CollidR-License
 *
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
        onEditorsUpdated: "onEditorsUpdated"
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

        // ==================================================
        // public methods
        // ==================================================
        this.registerClient = function () {
            connection.start().done(function () {
                hubProxy.invoke("joinModel", settings.entityId, settings.entityType);

                var message = "registered: " + settings.entityType + ' of ' + settings.entityId;
                log(message, true);

                // wire up form events
                $(":input").focus(function () { enterField(this) });
                $(":input").blur(function () { exitField(this) });
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
        editorsList: $('[data-collidR="editorsList"]')
    };

    $.collidR.prototype.events = events;
    $.collidR.prototype.log = log;
    $.collidR.prototype.autoFormatters = autoFormatters;

}(window.jQuery, window));

/* CollidR.BootstrapFormatter.js */
/*
 * Twitter.Bootstrap Formatter for CollidR JavaScript Library v0.1.0
 * http://github.com/MisterJames/CollidR
 *
 * Copyright James Chambers. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/MisterJames/CollidR/wiki/CollidR-License
 * Applies changes to the page based on the Twitter Bootstrap library
 */
(function ($, window) {
    "use strict";
    
    if (typeof ($.fn.alert) === undefined) {
        collidR.log("CollidR: *** The Bootstrap Formatter could not be initialized because it appears that Bootstrap.js is not loaded.");
    }
    else {
        // we only wire up for Bootstrap if it's loaded
        var collidR = new $.collidR;
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
                collidR.autoFormatters.editorsList.html('<span class="glyphicon glyphicon-eye-open"></span> There are currently 2 editors: ' + data.names);
            }

        });

        $(window).on(collidR.events.onEnterField, function (e, data) {
            collidR.log("Field " + data.field + " entered by " + data.name);

            var message = data.name + " is editing this field.";
            var fieldName = "#" + data.field;

            // set up the tooltip
            $(fieldName)
                .attr('title', message)
                .attr('data-trigger', 'manual')
                .tooltip('show');

        });

        $(window).on(collidR.events.onExitField, function (e, data) {
            collidR.log("Field " + data.field + " left by " + data.name);

            var fieldName = "#" + data.field;

            // set up the tooltip
            $(fieldName)
                .tooltip('hide');

        });
    }

}(window.jQuery, window));
