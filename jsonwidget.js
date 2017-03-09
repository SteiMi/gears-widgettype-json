//This is an example widget type for EveryAware Gears. It takes the data of a
//component and displays it as a simple json string.

//Widget types are implemented as RequireJS modules. Therefore, we first define
//our dependencies:
//  1. We need jQuery. jQuery is already available on the EveryAware servers, so
//     we can just require 'jquery'.
//  2. Every widget type should inherit attributes and methods from the base
//     widget class, so we require this base widget with 'app/widgets/widget'
//  3. Since we use the 'inheritPrototype' helper function to inherit the
//     attributes and methods from the base widget class, we have to require
//     'app/utils'.
//  4. This widget type needs some css. You can either write your css in a
//     separate css file and require its url with the 'css!' loader, like
//     shown here, or you add your styles in JavaScript.
define(['jquery', 'app/widgets/widget', 'app/utils',
        'css!http://rawgit.com/SteiMi/gears-widgettype-json/master/jsonwidget.css'
    ],
    function($, Widget, utils) {


        JsonWidget = function JsonWidget(feedId, sourceId, componentBindings, config, uuid) {
            //Call the constructor of the base class.
            Widget.call(this, feedId, sourceId, componentBindings, config, uuid);
        }

        //Inherit the methods and properties from base widget class.
        utils.inheritPrototype(JsonWidget, Widget);
        //The base widget class provides it's subclasses with the following
        //properties through inheritance:
        //  1. feedId: The ID of the feed that this widget is bound to.
        //  2. sourceId: The ID of the source that this widget is bound to.
        //  3. componentBindings: Stores which widget component is bound to
        //     which data component (see 'getBindableComponents' for more info)
        //  4. config: Stores widget configuration for example the timeframe
        //     this widget should display data from.
        //  5. uuid: Unique identifier for each instance of a widget.


        //Every instantiable widgettype needs a description object. 'name' and
        //'details' will be shown to the user during widget creation.
        JsonWidget.description = {
            id: 'JsonWidget',
            name: 'Json',
            details: 'Shows the data as a json string.'
        };


        //getBindableComponents defines so called 'widget components'.
        //A widget component can be bound to a component in EveryAware.

        //If you're unfamiliar with the way EveryAware structures its data, read
        //the comments for the method 'generateBody' first.

        //During creation of a widget the widget components that are defined
        //here will be bound to data components in EveryAware by the user
        //through the widget creation dialog. These bindings tells the widget
        //which data it should display (from which channel and/or component).
        JsonWidget.getBindableComponents = function() {
            return {
                //JsonWidget only has one single widget component called 'content'.
                //It simply displays the data of the component thats bound to
                //content as a json string.
                'content': {
                    //'content' will be bound to a component and not to a whole
                    //channel.
                    //Sometimes it's useful for a widget to see all components
                    //in a channel. In that case you could set this flag 'true'.
                    //Usually you will want it to be 'false' though.
                    'channelOnly': false,
                    //'info' contains semantic information for the binding.
                    //'info' is currently not displayed in the UI.
                    'info': 'This component will be displayed as a json string.',
                    //widget component 'content' is required to be bound for the
                    //widget to work.
                    'required': true
                }
            };
        };

        //generateBody returns an element that will represent the body of the
        //widget.
        JsonWidget.prototype.generateBody = function() {
            //Data is accessed via the widget's method 'getFilteredData'. This
            //returns a javascript object with the bound data from the timeframe
            //that is specified in the 'config' object.
            //The Data is always structured in the following way:
            //  1. array of feeds, each feed can be accessed by its feedId
            //  2. array of sources that have posted data to the selected feed,
            //     each source can be accessed by its sourceId
            //  3. array of channels from selected feed and source, each channel
            //     can be accessed by its name
            //  4. each channel consists of an array of components, each
            //     component can be accessed by its name
            //  5. each component consists of an array of data points, each
            //     data point can be accessed by its timestamp

            //We don't need to access individual data points since we just
            //stringify the whole data object here so we don't need to access
            //layer 5 for this widget type.
            return $('<div class="jsonwidget-content">' +
                JSON.stringify(this.getFilteredData()
                    .feeds[this.feedId]
                    .sources[this.sourceId]
                    .channels[this.componentBindings.content.channel]
                    [this.componentBindings.content.component]) +
                '</div>');
        };

        //redrawElement gets called whenever the widget is resized, settings are
        //changed or new data for this widget is downloaded (via websockets).
        //Therefore this method should be reasonably fast.
        JsonWidget.prototype.redrawElement = function() {
            //Execute the redrawElement method of the base class
            //abort if this call fails (via return false)
            if (!Widget.prototype.redrawElement.call(this)) {
                return false;
            }

            //Since this widgettype offers a pretty simple visualization of the
            //bound data, we can get away with simply deleting the old body and
            //generating a new body at each redraw call without creating
            //performance problems. For more involved widgettypes it could be
            //beneficial to keep the old body and only adjust the visualization
            //according to the new data.
            var body = this.element.find('.widget-body').empty();
            body.append(this.generateBody());
            return true;
        };

        return JsonWidget;

    });
