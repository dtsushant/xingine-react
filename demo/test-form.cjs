// Playwright test for the xingine-react form
const { chromium } = require('playwright');

async function testXingineForm() {
  console.log('🚀 Starting Xingine React Form Test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the app
    console.log('📱 Navigating to http://localhost:3003');
    await page.goto('http://localhost:3003');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the initial state
    await page.screenshot({ path: 'initial-page.png' });
    console.log('📸 Initial screenshot saved as initial-page.png');
    
    // Check if the form is rendered
    const formTitle = await page.locator('h2:has-text("Contact Form")');
    if (await formTitle.count() > 0) {
      console.log('✅ Form title found');
    } else {
      console.log('❌ Form title not found - checking page content...');
      const pageContent = await page.content();
      console.log('Page content preview:', pageContent.substring(0, 500));
    }
    
    // Try to find form fields by different selectors
    const nameField = await page.locator('input[name="name"], input[placeholder*="name" i], input[id="name"]').first();
    const emailField = await page.locator('input[name="email"], input[placeholder*="email" i], input[id="email"]').first();
    const messageField = await page.locator('textarea[name="message"], textarea[placeholder*="message" i], textarea[id="message"]').first();
    const submitButton = await page.locator('button[type="submit"], button:has-text("Submit")').first();
    
    const nameCount = await nameField.count();
    const emailCount = await emailField.count();
    const messageCount = await messageField.count();
    const submitCount = await submitButton.count();
    
    console.log(`Form fields found: Name(${nameCount}), Email(${emailCount}), Message(${messageCount}), Submit(${submitCount})`);
    
    if (nameCount > 0 && emailCount > 0 && messageCount > 0 && submitCount > 0) {
      console.log('✅ All form fields found, proceeding with form filling...');
      
      // Fill the form
      await nameField.fill('John Doe');
      console.log('✅ Name field filled');
      
      await emailField.fill('john.doe@example.com');
      console.log('✅ Email field filled');
      
      await messageField.fill('This is a test message from Playwright testing the xingine-react form integration.');
      console.log('✅ Message field filled');
      
      // Take a screenshot after filling
      await page.screenshot({ path: 'form-filled.png' });
      console.log('📸 Form filled screenshot saved as form-filled.png');
      
      // Click submit
      await submitButton.click();
      console.log('✅ Submit button clicked');
      
      // Wait a moment for any response
      await page.waitForTimeout(2000);
      
      // Take a final screenshot
      await page.screenshot({ path: 'form-submitted.png' });
      console.log('📸 Form submitted screenshot saved as form-submitted.png');
      
      console.log('🎉 Form test completed successfully!');
    } else {
      console.log('❌ Some form fields are missing');
      
      // Let's inspect what's actually on the page
      const allInputs = await page.locator('input').count();
      const allTextareas = await page.locator('textarea').count();
      const allButtons = await page.locator('button').count();
      
      console.log(`Page elements: ${allInputs} inputs, ${allTextareas} textareas, ${allButtons} buttons`);
      
      // Get all form-related elements
      const formElements = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input')).map(el => ({
          type: el.type,
          name: el.name,
          id: el.id,
          placeholder: el.placeholder,
          tagName: el.tagName
        }));
        
        const textareas = Array.from(document.querySelectorAll('textarea')).map(el => ({
          name: el.name,
          id: el.id,
          placeholder: el.placeholder,
          tagName: el.tagName
        }));
        
        const buttons = Array.from(document.querySelectorAll('button')).map(el => ({
          type: el.type,
          textContent: el.textContent,
          id: el.id,
          tagName: el.tagName
        }));
        
        return { inputs, textareas, buttons };
      });
      
      console.log('Form elements found:', JSON.stringify(formElements, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('📸 Error screenshot saved as error-screenshot.png');
  } finally {
    await browser.close();
    console.log('🔚 Browser closed');
  }
}

// Run the test
testXingineForm().catch(console.error);
