@description('The name of the API Management service instance')
// param apiManagementServiceName string = 'apiservice${uniqueString(resourceGroup().id)}'
param apiManagementServiceName string

@description('The email address of the owner of the service')
@minLength(1)
param publisherEmail string

@description('The name of the owner of the service')
@minLength(1)
param publisherName string

@description('The pricing tier of this API Management service')
@allowed([
  'Consumption'
  'Developer'
  'Standard'
  'Premium'
])
param sku string = 'Consumption'

// only set if not Consumption
@description('The instance size of this API Management service.')
@allowed([
  0
  1
  2
])
param skuCount int = 0 // 0 if consumption

@description('Location for all resources.')
param location string = resourceGroup().location

resource apiManagementService 'Microsoft.ApiManagement/service@2021-08-01' = {
  name: apiManagementServiceName
  location: location
  sku: {
    name: sku
    capacity: skuCount
  }
  properties: {
    publisherEmail: publisherEmail
    publisherName: publisherName
  }
}
