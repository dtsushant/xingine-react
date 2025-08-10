import { test, expect } from '@playwright/test';

test.describe('Debug Form Metadata', () => {
  test('Check what field metadata is actually being passed', async ({ page }) => {
    // Navigate to the user add form page
    await page.goto('http://localhost:3004/user/add');
    
    // Wait for the page to fully load
    await page.waitForTimeout(2000);
    
    // Inject a debug script to inspect the form state and metadata
    const debugInfo = await page.evaluate(() => {
      // Try to access React DevTools or form instance
      const forms = document.querySelectorAll('form');
      if (forms.length === 0) return 'No forms found';
      
      const form = forms[0];
      
      // Check what fields are actually registered with Ant Design
      const formItems = document.querySelectorAll('.ant-form-item');
      const fieldInfo = [];
      
      formItems.forEach((item, index) => {
        const label = item.querySelector('.ant-form-item-label label')?.textContent || '';
        const input = item.querySelector('input, select, textarea');
        const isStatic = ['Test field', 'Test field2', 'First Name'].includes(label);
        
        fieldInfo.push({
          index,
          label,
          isStatic,
          inputName: input?.getAttribute('name') || 'no-input',
          inputId: input?.getAttribute('id') || 'no-id',
          inputValue: input?.value || '',
          hasInput: !!input
        });
      });
      
      return fieldInfo;
    });
    
    console.log('=== FORM FIELD ANALYSIS ===');
    console.log(JSON.stringify(debugInfo, null, 2));
    
    // Let's also check if we can access form values through Ant Design's form instance
    const formValues = await page.evaluate(() => {
      // Try to find the form instance in the React component tree
      try {
        // Check if there's a way to access the form values
        const inputs = document.querySelectorAll('input');
        const values = {};
        inputs.forEach(input => {
          if (input.id && input.value) {
            values[input.id] = input.value;
          }
        });
        return values;
      } catch (e) {
        return { error: e.message };
      }
    });
    
    console.log('=== FORM VALUES BY ID ===');
    console.log(JSON.stringify(formValues, null, 2));
    
    // Check browser console for any React/form-related errors or logs
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('Processing field') || msg.text().includes('fullFieldName')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Wait a bit to capture console logs
    await page.waitForTimeout(1000);
    
    console.log('=== CONSOLE LOGS FROM FORM RENDERING ===');
    consoleLogs.forEach(log => console.log(log));
  });
});
