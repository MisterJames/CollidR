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
        var shadowingUser = null;

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
                var warningText = '<span class="glyphicon glyphicon-eye-open"></span> There are currently ' + users.length + ' editors: ';
                users.forEach(function (user) {
                    var trimmedUser = user.replace(' ', '');
                    warningText += trimmedUser + '(<a href="#" class="shadowUser" data-collidr-username="' + trimmedUser + '">shadow</a>) ';
                });
                collidR.autoFormatters.editorsList.html(warningText);
            }

        });

        $(collidR.autoFormatters.editorsPane).on("click", "a.shadowUser", function () {
            var userName = $(this).attr('data-collidr-username');
            collidR.log("Shadowing " + userName);
            $(this).removeClass(".shadowUser")
                .addClass(".unshadowUser");
            shadowingUser = userName;
            $(":input[type!='hidden'][type!='submit']")
                .each(function (index, element) {
                    $(element).clone()
                        .attr("id", $(element).attr("id") + "_" + userName)
                        .attr("name", "")
                        .addClass("shadow")
                        .attr('readonly', true)
                        .css('opacity', 0.5) //Would be better to do this in a CollidR.css file so people can customize the styling
                        .insertAfter($(element));
                });
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
            if (shadowingUser == data.name) {
                $("#" + data.field + "_" + data.name).val(data.value);
            }

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