CollidR
=======

An open source project leveraging SignalR to make real time forms easy.

Check out the introduction on YouTube:  
    http://www.youtube.com/watch?v=WRGIUJaChyI

Getting it Running in Your Project
=======
Run the CollidR.Mvc5.Sample project (go to /person) to get a sense of what's going on. It's even better with two browsers running!

To get it going in your MVC5 project
 * Install the CollidR.Mvc [Nuget package](https://www.nuget.org/packages/CollidR/)
 * In the Startup class for your project, call app.MapSignalR() in the Configuration method 
 * In your Edit view, add the CollidR editor pane and alert area using the following Html helper

```
    @Html.CollidREditorPane()
    @Html.CollidRAlertArea()
```

* Create an instance of the CollidR proxy and Register the client using the following html helper

```
    @Html.RegisterCollidRFor(p => p.PersonId)
```

Note: Users must be authenticated before accessing any pages that use CollidR

Contributing
=======
Fork away! You'll need to complete a [Contributors Agreement](http://sdrv.ms/195dLUH) before I can do a pull request. This will help to make sure that everyone who wants to use the project freely can do so under the license of this project.  Speaking of license...

License
=======
Licensed under the [Apache License, Version 2.0](https://github.com/MisterJames/CollidR/blob/master/LICENSE).

Acknowledgements
=======
 * Be sure to check out the [SignalR Project](https://github.com/signalr/signalr)
 * We're trying to be awesome at install. Thanks to the [Glimpse](https://github.com/Glimpse/Glimpse) folks for setting the bar good and high
  
 

