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
$apiAppServiceName = $envConfig.apiAppServiceName

# APIM vars
$apiManagementServiceName = $envConfig.apiManagementServiceName
$apiManagementOrg = $envConfig.apiManagementOrg
$apiManagementAdminEmail = $envConfig.apiManagementAdminEmail

Write-Host "Set config"
Write-Host "Creating RG..."

# RG deploy
az group create --name $rgName --location $location

Write-Host "Created RG"

### App service

# az webapp list-runtimes
az appservice plan create --resource-group $rgName --name $appServicePlan --sku "B1" --location $location --is-linux

az webapp create --resource-group $rgName --plan $appServicePlan --name $apiAppServiceName --runtime "DOTNETCORE:6.0"

### APIM

# create service - by default, it is created in the Developer tier. This may take 30-40 minutes to activate, but the below command returns immediately while it is created.
az apim create --name $apiManagementServiceName --resource-group $rgName --publisher-name $apiManagementOrg --publisher-email $apiManagementAdminEmail --no-wait

# view status of deployment:
# az apim show --name $apiManagementServiceName --resource-group $rgName --output table

# reset wd
Set-Location $origPath