param(
    [Parameter()]
    [String]$paramDbSec  # from secret var on cli
)

# provide resource names here
# Note: bicep is idempotent
# run from parent folder (one up from devops folder)
$origPath = Get-Location
$origPath = $origPath.Path
Set-Location $PSScriptRoot

$config = Get-Content "../../config/variables.json" | ConvertFrom-Json
$envConfig = $config.$($config.env)

# global vars
$rgName = $envConfig.resourceGroup
$location = $envConfig.location

$appServicePlan = $envConfig.appServicePlan
$webAppServiceName = $envConfig.webAppServiceName

Write-Host "Set config"
Write-Host "Creating RG..."

# RG deploy
az group create --name $rgName --location $location

Write-Host "Created RG"

# App service

# az webapp list-runtimes
az appservice plan create --resource-group $rgName --name $appServicePlan --sku "B1" --location $location --is-linux

az webapp create --resource-group $rgName --plan $appServicePlan --name $webAppServiceName --runtime "NODE:16-lts"

# reset wd
Set-Location $origPath
