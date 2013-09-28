/* CollidR.Formatters.Bootstrap.js */
/*
 * Twitter.Bootstrap Formatter for CollidR JavaScript Library
 * http://github.com/MisterJames/CollidR
 *
 * Copyright James Chambers. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/MisterJames/CollidR/wiki/CollidR-License
 * Applies changes to the page based on the Twitter Bootstrap library
 */

/// <reference path="jquery-1.9.1.js" />
/// <reference path="jquery.signalr-1.1.3.js" />

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
