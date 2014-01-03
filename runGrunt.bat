cd "%1"
cd tools\node
node .\grunt-cli.js
xcopy /y  "..\..\CollidR\Scripts\CollidR*.js" "..\..\CollidR.Mvc5.Sample\Scripts\"