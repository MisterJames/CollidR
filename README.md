CollidR
=======

An open source project leveraging SignalR to make real time forms easy.

Check out the introduction on YouTube:  
    http://www.youtube.com/watch?v=WRGIUJaChyI

Getting it Running in Your Project
=======
Run the CollidR.Sample project (go to /person) to get a sense of what's going on. It's even better with two browsers running!

To get it going in your own project you'll need to
 * reference the CollidR DLL
 * copy CollidR.js into your scripts folder
 * call RouteTable.Routes.MapHubs(); from Application_Start
 * reference the script from your edit page
 * create an instance of the CollidR proxy and register the client

You can see how this is done in the intro video above.

A NuGet package helps put most of the above in place. Just drop into the Package Manager Console and type

    install-package CollidR
    
...or check out the package on [Nuget](https://www.nuget.org/packages/CollidR/).

Contributing
=======
Fork away! You'll need to complete a [Contributors Agreement](http://sdrv.ms/195dLUH) before I can do a pull request. This will help to make sure that everyone who wants to use the project freely can do so under the license of this project.  Speaking of license...

License
=======
Licensed under the [Apache License, Version 2.0](https://github.com/MisterJames/CollidR/blob/master/LICENSE).

