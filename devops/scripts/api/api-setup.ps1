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
$apiManagementApiPath = $envConfig.apiManagementApiPath
$apiManagementApiName = $envConfig.apiManagementApiName
$apiManagementApiDisplayName = $envConfig.apiManagementApiDisplayName
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
# az deployment group create --resource-group $rgName --template-file '../../bicep/api/apim.bicep' --parameters apiManagementServiceName=$apiManagementServiceName publisherEmail=$apiManagementAdminEmail publisherName=$apiManagementOrg

# create service - by default, it is created in the Developer tier. This may take 30-40 minutes to activate, but the below command returns immediately while it is created.
az apim create --name $apiManagementServiceName --resource-group $rgName --publisher-name $apiManagementOrg --publisher-email $apiManagementAdminEmail --no-wait

# view status of deployment:
# az apim show --name $apiManagementServiceName --resource-group $rgName --output table

# create API - need to wait for service to activate
az apim api create --api-id $apiManagementApiName --display-name $apiManagementApiDisplayName --path $apiManagementApiPath --resource-group $rgName --service-name $apiManagementServiceName

# reset wd
Set-Location $origPath