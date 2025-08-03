# Xingine-React UI Demo & Testing Guide

This directory contains comprehensive UI demos and tests for the xingine-react framework, showcasing the hierarchical state management system and component rendering capabilities.

## 🎯 Quick Start

### Option 1: Standalone HTML Demo (Recommended for immediate testing)

```bash
# Open the standalone demo in your browser
open demo/ui-test.html
# OR serve it via HTTP server for better experience
npm run demo:serve
```

### Option 2: Backend Layout Testing (New!)

```bash
# Test real backend responses from xingine-nest
npm run demo:serve
# Then visit: http://localhost:8080/backend-layout-test.html
```

The standalone demo provides:
- ✅ **Immediate interaction** - No build process required
- ✅ **State management demonstration** - Global, Content, and Component states
- ✅ **Interactive examples** - Click buttons, type in inputs, see real-time state changes
- ✅ **State viewer** - Monitor state changes in real-time
- ✅ **Multiple component types** - Buttons, inputs, cards, and more

The backend layout tester provides:
- 🔥 **Real backend data** - Test actual xingine-nest responses
- 🔥 **Layout validation** - Verify complex nested layouts
- 🔥 **Component mapping** - Test component registry with real data
- 🔥 **Action simulation** - Mock action execution and state updates
- 🔥 **Error handling** - See how missing components are handled

### Option 3: React Integration Tests

```bash
# Run comprehensive UI integration tests
cd xingine-react
npm test src/__tests__/integration/ui-integration.test.tsx

# Run with watch mode for development
npm test -- --watch src/__tests__/integration/ui-integration.test.tsx

# Run with coverage
npm test -- --coverage src/__tests__/integration/ui-integration.test.tsx
```

## 📁 Demo Structure

```
demo/
├── ui-test.html              # ⭐ Standalone interactive demo
├── backend-layout-test.html  # 🔥 Backend response tester (NEW!)
├── index.html                # React demo entry point
├── demo-runner.tsx           # React demo bootstrap
└── README.md                 # This file

src/
├── demo/
│   ├── SimpleUIDemo.tsx      # React-based UI demo component
│   └── action-context-demo.tsx # Legacy context demo
└── __tests__/
    └── integration/
        └── ui-integration.test.tsx # Comprehensive UI tests
```

## 🎮 Interactive Demo Features

### 1. **State Management Hierarchy**
- **Global State**: App-wide state (theme, user, authentication)
- **Content State**: Page/section-level state (page title, current section)
- **Component State**: Individual component state (button clicks, input values)

### 2. **Component Rendering**
- Dynamic component loading from layout definitions
- Event binding with action execution
- Props and style handling
- Error handling for missing components

### 3. **Real-time State Monitoring**
- Live state viewer showing all state levels
- State change tracking and history
- Component isolation demonstration

## 🧪 Test Coverage

The integration tests cover:

### Component Rendering Tests
- ✅ Button component rendering and interaction
- ✅ Input component with change events
- ✅ Card component display
- ✅ Multiple component isolation
- ✅ Error handling for invalid components

### State Management Tests
- ✅ Global state updates via GLOBAL prefix
- ✅ Content state updates via CONTENT prefix
- ✅ Component state isolation
- ✅ State change tracking and monitoring
- ✅ Hierarchical state management validation

### Integration Scenarios
- ✅ Multiple components with independent state
- ✅ Cross-component state isolation
- ✅ Provider chain validation
- ✅ Action execution context testing

## 🎯 Testing Scenarios

### Scenario 1: Basic Component Interaction
```typescript
// Layout definition
const buttonLayout: LayoutComponentDetail = {
    meta: {
        component: 'button',
        properties: {
            label: 'Test Button',
            event: {
                onClick: {
                    action: 'setState',
                    args: { key: 'buttonClicked', value: true }
                }
            }
        }
    }
};

// Component renders and handles clicks
<RenderComponent {...buttonLayout} />
```

### Scenario 2: Hierarchical State Management
```typescript
// Global state update
{ action: 'setState', args: { key: 'GLOBAL.theme', value: 'dark' } }

// Content state update
{ action: 'setState', args: { key: 'CONTENT.pageTitle', value: 'New Title' } }

// Component state update (default)
{ action: 'setState', args: { key: 'localValue', value: 'component-specific' } }
```

### Scenario 3: Component State Isolation
```typescript
// Multiple components with same action but isolated state
<ComponentStateProvider componentId="button-1">
    <RenderComponent {...buttonLayout} />
</ComponentStateProvider>

<ComponentStateProvider componentId="button-2">
    <RenderComponent {...buttonLayout} />
</ComponentStateProvider>
```

## 🚀 Running the Demos

### 1. Standalone HTML Demo
```bash
# Method 1: Direct file open
open demo/ui-test.html

# Method 2: HTTP server (recommended)
npm run demo:serve
# Opens http://localhost:8080/ui-test.html

# Method 3: Manual server
npx http-server demo -p 8080 -o
```

### 2. Integration Tests
```bash
# Run all UI integration tests
npm run test:integration

# Run specific test file
npm test src/__tests__/integration/ui-integration.test.tsx

# Watch mode for development
npm test -- --watch --testPathPattern=ui-integration

# Coverage report
npm test -- --coverage --testPathPattern=ui-integration
```

### 3. Component-specific Tests
```bash
# Test UI components only
npm run test:ui

# Test context providers
npm run test:context

# Verbose output
npm run test:verbose
```

## 🎛️ Demo Controls

### State Management Controls
- **Global State**: Toggle theme, update user data, set app-wide values
- **Content State**: Update page titles, section data, content-specific state
- **Component State**: Individual component values, button states, input values

### Component Interaction Controls
- **Button Clicks**: Test action execution and state updates
- **Input Changes**: Real-time value tracking and state binding
- **Card Interactions**: Complex component rendering and nesting

### Monitoring Controls
- **State Viewer**: Toggle real-time state monitoring display
- **Demo Selector**: Switch between different demo scenarios
- **Reset Controls**: Clear state and restart demos

## 🔧 Development Usage

### Adding New Demo Components
1. **Create Component Layout**:
```typescript
const newComponentLayout: LayoutComponentDetail = {
    meta: {
        component: 'your-component',
        properties: {
            // Component props
            label: 'Demo Label',
            event: {
                onClick: {
                    action: 'setState',
                    args: { key: 'componentClicked', value: true }
                }
            }
        }
    }
};
```

2. **Register Component**:
```typescript
const DEMO_COMPONENT_MAP = {
    'your-component': YourComponentRenderer,
    // ... existing components
};
```

3. **Add to Demo**:
```typescript
// In standalone demo
demos.yourDemo = {
    title: 'Your Demo',
    content: `<your-demo-html-here />`
};

// In React demo
<RenderComponent {...newComponentLayout} />
```

### Testing New Components
```typescript
test('should render your new component', async () => {
    render(
        <TestWrapper>
            <ComponentStateProvider componentId="test-component">
                <RenderComponent {...newComponentLayout} />
            </ComponentStateProvider>
        </TestWrapper>
    );
    
    expect(screen.getByText('Demo Label')).toBeInTheDocument();
});
```

## 📊 Expected Test Results

### Integration Test Results
- ✅ **8+ Component Tests**: Basic rendering and interaction
- ✅ **5+ State Management Tests**: Hierarchical state handling
- ✅ **3+ Error Handling Tests**: Graceful failure scenarios
- ✅ **2+ Isolation Tests**: Component state independence

### Performance Expectations
- ⚡ **State Updates**: < 50ms for simple state changes
- ⚡ **Component Rendering**: < 100ms for basic components
- ⚡ **Provider Setup**: < 200ms for complete context chain

### Browser Compatibility
- ✅ **Chrome/Edge**: Full support
- ✅ **Firefox**: Full support  
- ✅ **Safari**: Full support
- ✅ **Mobile**: Basic support

## 🐛 Troubleshooting

### Common Issues

1. **State not updating**: Check provider chain and component IDs
2. **Components not rendering**: Verify component registration in map
3. **Events not firing**: Check action syntax and binding format
4. **Tests failing**: Ensure proper test wrapper setup

### Debug Mode
```typescript
// Enable detailed logging
localStorage.setItem('xingine-debug', 'true');

// Monitor state changes
const actionContext = useActionExecutionContext();
console.log('Current state:', actionContext.global.getAllState());
```

### Performance Monitoring
```typescript
// Track state update performance
performance.mark('state-update-start');
actionContext.global.setState('key', 'value');
performance.mark('state-update-end');
performance.measure('state-update', 'state-update-start', 'state-update-end');
```

## 🎉 Success Criteria

The UI demo is successful when:
- ✅ All components render without errors
- ✅ State management works hierarchically (Global → Content → Component)
- ✅ Component isolation prevents cross-interference
- ✅ Action execution updates state correctly
- ✅ Real-time state monitoring reflects changes
- ✅ Error handling works gracefully
- ✅ Performance remains optimal for 100+ components

Start with `demo/ui-test.html` for immediate interactive testing!
