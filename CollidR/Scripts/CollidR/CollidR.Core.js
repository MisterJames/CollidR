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
        onModelSave: "onModelSave",
        onRegistrationComplete: "onRegistrationComplete"
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
        var currentUser = '';


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

        hubProxy.on('registrationComplete', function (username, hasChanges) {
            $(window).triggerHandler(events.onRegistrationComplete, { username: username, hasChanges: hasChanges });
            log(username + " has successfully registered for this entity.");

            // capture current user 
            $.collidR.currentUser = username;

            // hook for catching up when user joins after edits
            if (hasChanges) {
                log("There are outstanding changes for this entity...");

            }
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

        function saveModel() {
            hubProxy.invoke("SaveModel", settings.entityId, settings.entityType);
        }

        function reloadPage() {
            window.location = window.location;
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
                $('[data-collidR="reloadCommand"]').click(function () { reloadPage(); });
                $("form").submit(function () { saveModel(); });
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
        shadowUserPane: $('[data-collidR="shadowUserPane"]'),
        shadowUserName: $('[data-collidR="shadowUserName"]'),
        reloadEditor: $('[data-collidR="reloadEditor"]'),
        reloadWarning: $('[data-collidR="reloadWarning"]'),
        reloadCommand: $('[data-collidR="reloadCommand"]')
    };

    $.collidR.prototype.events = events;
    $.collidR.prototype.log = log;
    $.collidR.prototype.autoFormatters = autoFormatters;


}(window.jQuery, window));