@description('Server Name for Azure database for MySQL')
param serverName string // pass in

@description('Database administrator login name')
@minLength(1)
param administratorLogin string // pass in

@description('Database administrator password')
@minLength(8)
@secure()
param administratorLoginPassword string // pass in

@description('Azure database for MySQL sku name ')
param skuName string = 'Standard_B1s'

@description('Azure database for MySQL Sku Size ')
param SkuSizeGB int = 20 // 5120

@description('Azure database for MySQL pricing tier')
//@allowed([
//  'Basic'
//  'GeneralPurpose'
//  'MemoryOptimized'
//])
param SkuTier string = 'Burstable'

@description('MySQL version')
//@allowed([
//  '5.6'
//  '5.7'
//  '8.0'
//])
param mysqlVersion string = '5.7'

@description('Location for all resources.')
param location string = resourceGroup().location

@description('MySQL Server backup retention days')
param backupRetentionDays int = 7

@description('Geo-Redundant Backup setting')
param geoRedundantBackup string = 'Disabled'

//@description('Virtual Network Name')
//param virtualNetworkName string = 'azure_mysql_vnet'

//@description('Subnet Name')
//param subnetName string = 'azure_mysql_subnet'

//@description('Virtual Network RuleName')
//param virtualNetworkRuleName string = 'AllowSubnet'

//@description('Virtual Network Address Prefix')
//param vnetAddressPrefix string = '10.0.0.0/16'

//@description('Subnet Address Prefix')
//param subnetPrefix string = '10.0.0.0/16'

//var firewallrules = [
//  {
//    Name: 'rule1'
//    StartIpAddress: '0.0.0.0'
//    EndIpAddress: '255.255.255.255'
//  }
//  {
//    Name: 'rule2'
//    StartIpAddress: '0.0.0.0'
//    EndIpAddress: '255.255.255.255'
//  }
//]

//resource vnet 'Microsoft.Network/virtualNetworks@2021-05-01' = {
//  name: virtualNetworkName
//  location: location
//  properties: {
//    addressSpace: {
//      addressPrefixes: [
//        vnetAddressPrefix
//      ]
//    }
//  }
//}

//resource subnet 'Microsoft.Network/virtualNetworks/subnets@2021-05-01' = {
//  parent: vnet
//  name: subnetName
//  properties: {
//    addressPrefix: subnetPrefix
//  }
//}

//resource mysqlDbServer 'Microsoft.DBforMySQL/servers@2017-12-01' = {
resource mysqlDbServer 'Microsoft.DBforMySQL/flexibleServers@2021-12-01-preview' = {
  name: serverName
  location: location
  sku: {
    name: skuName
    tier: SkuTier
  }
  properties: {
    createMode: 'Default'
    version: mysqlVersion
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    backup: {
      backupRetentionDays: backupRetentionDays
      geoRedundantBackup: geoRedundantBackup
    }
    storage: {
      storageSizeGB: SkuSizeGB
      iops: 360
      autoGrow: 'Enabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }

  //  resource virtualNetworkRule 'virtualNetworkRules@2017-12-01' = {
  //    name: virtualNetworkRuleName
  //    properties: {
  //      virtualNetworkSubnetId: subnet.id
  //      ignoreMissingVnetServiceEndpoint: true
  //    }
  //  }
}

//@batchSize(1)
//resource firewallRules 'Microsoft.DBforMySQL/servers/firewallRules@2017-12-01' = [for rule in firewallrules: {
//  name: '${mysqlDbServer.name}/${rule.Name}'
//  properties: {
//    startIpAddress: rule.StartIpAddress
//    endIpAddress: rule.EndIpAddress
//  }
//}]
