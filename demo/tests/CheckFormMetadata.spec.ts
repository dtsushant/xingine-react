import { test, expect } from '@playwright/test';

test.describe('Check Form Metadata Structure', () => {
  test('Examine what metadata is actually passed to FormRenderer', async ({ page }) => {
    // Add console capture to see what metadata is being processed
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    // Navigate to the user add form page
    await page.goto('http://localhost:3004/user/add');
    
    // Wait for the page to fully load
    await page.waitForTimeout(3000);
    
    console.log('=== ALL CONSOLE LOGS ===');
    consoleLogs.forEach(log => console.log(log));
    
    // Check what fields actually exist in the form
    const formAnalysis = await page.evaluate(() => {
      const formItems = document.querySelectorAll('.ant-form-item');
      const analysis = {
        totalFormItems: formItems.length,
        fields: [] as any[]
      };
      
      formItems.forEach((item, index) => {
        const label = item.querySelector('.ant-form-item-label label')?.textContent || '';
        const input = item.querySelector('input, select, textarea');
        
        if (input && label) {
          analysis.fields.push({
            index,
            label,
            inputType: input.tagName.toLowerCase(),
            inputId: input.getAttribute('id') || 'no-id',
            placeholder: input.getAttribute('placeholder') || '',
            isRequired: label.includes('*')
          });
        }
      });
      
      return analysis;
    });
    
    console.log('\n=== FORM STRUCTURE ANALYSIS ===');
    console.log(`Total form items: ${formAnalysis.totalFormItems}`);
    console.log('\nField Details:');
    formAnalysis.fields.forEach(field => {
      console.log(`${field.index}: "${field.label}" (${field.inputType}) - ID: ${field.inputId} - Required: ${field.isRequired}`);
      if (field.placeholder) {
        console.log(`    Placeholder: ${field.placeholder}`);
      }
    });
  });
});
