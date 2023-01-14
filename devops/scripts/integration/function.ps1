$origPath = Get-Location
$origPath = $origPath.Path
Set-Location $PSScriptRoot

$config = Get-Content "../../config/variables.json" | ConvertFrom-Json
$envConfig = $config.$($config.env)

$rgName = $envConfig.resourceGroup
$location = $envConfig.location
$apiFunctionName = $envConfig.apiFunctionName
$storageAccount = $envConfig.storageAccountName
$appServicePlan = $envConfig.appServicePlan
$runtimeVersion = $envConfig.functionRuntimeVersion

Write-Host "Set config"
Write-Host "Creating RG..."

# RG deploy
az group create --name $rgName --location $location

Write-Host "Created RG"

Write-Host "Creating Storage Account and Function..."

# storage account
az storage account create --name $storageAccount --resource-group $rgName --sku "Standard_LRS"

# plan used by function
az appservice plan create --resource-group $rgName --name $appServicePlan --sku "B1" --location $location --is-linux

# note: automatically creates app insights resource
# az functionapp list-runtimes
az functionapp create --name $apiFunctionName --resource-group $rgName --storage-account $storageAccount --os-type "Linux"  --runtime "dotnet" --runtime-version $runtimeVersion --functions-version 4 --plan $appServicePlan # --consumption-plan-location "centralUS"

Write-Host "Created Storage Account and Function"

# reset wd
Set-Location $origPath