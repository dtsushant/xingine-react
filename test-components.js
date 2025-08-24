import { getDefaultInternalComponents } from './dist/component/group/index.js';

try {
  const components = getDefaultInternalComponents();
  
  console.log(`\nTotal components available: ${Object.keys(components).length}`);
  console.log('Available components:');
  Object.keys(components).sort().forEach(key => {
    console.log(`  ${key}: ${components[key] ? '✅ Found' : '❌ Missing'}`);
  });
  
  // Test the specific components that were causing errors
  const problematicComponents = [
    'UserAnalytics', 'AddRole', 'UserDetail', 'UserList', 'UserCreate',
    'NewCategory', 'CreateInventory', 'UpdateInventory', 'StockAdjustment',
    'CreatePurchaseOrder', 'UpdatePurchaseOrder', 'UserModule', 'InventoryModule',
    'HeaderRenderer', 'SidebarRenderer', 'FooterRenderer'
  ];
  
  console.log('\n🔍 Testing components that were reported as missing:');
  let allFound = true;
  problematicComponents.forEach(componentName => {
    const found = components[componentName];
    console.log(`  ${componentName}: ${found ? '✅ Found' : '❌ Still Missing'}`);
    if (!found) {
      allFound = false;
    }
  });
  
  if (allFound) {
    console.log('\n🎉 All previously missing components are now available!');
  } else {
    console.log('\n⚠️  Some components are still missing.');
  }
  
} catch (error) {
  console.error('Error testing components:', error.message);
  console.error('Stack trace:', error.stack);
}