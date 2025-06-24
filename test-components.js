import { getDefaultInternalComponents } from './dist/component/group/index.js';

try {
  const components = getDefaultInternalComponents();
  
  console.log('Available components:');
  Object.keys(components).forEach(key => {
    console.log(`  ${key}: ${components[key] ? '✅ Found' : '❌ Missing'}`);
  });
  
  // Test the specific components that were causing errors
  const missingComponents = [
    'UserAnalytics', 'AddRole', 'UserDetail', 'UserList', 'UserCreate',
    'NewCategory', 'CreateInventory', 'UpdateInventory', 'StockAdjustment',
    'CreatePurchaseOrder', 'UpdatePurchaseOrder', 'UserModule', 'InventoryModule',
    'HeaderRenderer', 'SidebarRenderer', 'FooterRenderer'
  ];
  
  console.log('\nTesting previously missing components:');
  missingComponents.forEach(componentName => {
    const found = components[componentName];
    console.log(`  ${componentName}: ${found ? '✅ Found' : '❌ Still Missing'}`);
  });
  
} catch (error) {
  console.error('Error testing components:', error.message);
}