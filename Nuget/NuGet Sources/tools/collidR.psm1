# ----------------------------------------
# portions of this code based on the Glimpse NuGet package install licenced under 
# the following terms: https://github.com/Glimpse/Glimpse/blob/master/license.txt
# ----------------------------------------

$dataDir = Join-Path $env:AppData "CollidR"
$dataFile = Join-Path $dataDir "extensions.cli"

# INSTALL
function Register-CollidRExtension($package, $dte) {

    # primitive for now...we'll enhance this 
    $queryString = "versionname=1.0.7"
    $dte.ItemOperations.Navigate("http://collidr.azurewebsites.net/home/install/?" + $queryString)

}

Export-ModuleMember Register-CollidRExtension