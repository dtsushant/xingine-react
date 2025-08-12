import axios from 'axios';
import { mockCommissarsData } from './mockData';

// Mock login data
const mockLoginData = {
  validCredentials: [
    { username: 'admin', password: 'password', role: 'admin', token: 'admin-token-123' },
    { username: 'user', password: 'user123', role: 'user', token: 'user-token-456' }
  ]
};

// Store original fetch function
const originalFetch = window.fetch;

// Mock API using fetch interception (for HierarchicalActionContext compatibility)
export function setupMockAPI() {
  // Override window fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    
    console.log('🔍 Intercepting fetch request to:', url);
    
    // Handle commissars endpoint
    if (url.includes('commissars') || url.endsWith('/api/commissars')) {
      console.log('✅ Mock API response returned for commissars');
      return new Response(JSON.stringify(mockCommissarsData), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle login endpoint
    if (url.includes('auth/login') || url.endsWith('/api/auth/login')) {
      console.log('🔐 Mock API processing login request');
      
      let requestBody = {};
      if (init?.body) {
        try {
          requestBody = typeof init.body === 'string' 
            ? JSON.parse(init.body) 
            : init.body as any;
        } catch (e) {
          console.error('❌ Failed to parse request body:', e);
        }
      }
      
      const { username, password } = requestBody as any;
      console.log('🔐 Login attempt for username:', username);
      
      // Find matching credentials
      const validUser = mockLoginData.validCredentials.find(
        cred => cred.username === username && cred.password === password
      );
      
      if (validUser) {
        console.log('✅ Login successful for:', username);
        const successResponse = {
          success: true,
          message: 'Login successful',
          token: validUser.token,
          user: {
            id: validUser.username === 'admin' ? '1' : '2',
            username: validUser.username,
            role: validUser.role,
            email: `${validUser.username}@example.com`
          }
        };
        
        return new Response(JSON.stringify(successResponse), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        console.log('❌ Login failed for:', username);
        const errorResponse = {
          success: false,
          message: 'Invalid username or password',
          errors: ['Invalid credentials']
        };
        
        return new Response(JSON.stringify(errorResponse), {
          status: 401,
          statusText: 'Unauthorized',
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

      if (url.includes('fetch-user/1') || url.endsWith('/api/fetch-user/1')) {
          const mockUserData = { firstName: 'Value from setter',accountType:'business',hasCompanyInfo:true,company:{name:'ABC COMPANY'} };
          return new Response(JSON.stringify(mockUserData), {
              status: 200,
              statusText: 'OK',
              headers: { 'Content-Type': 'application/json' }
          });
      }


    
    // For all other requests, use the original fetch
    console.log('🌐 Passing through to real fetch:', url);
    return originalFetch(input, init);
  };

  // Keep axios interceptors for backward compatibility
  axios.interceptors.request.use((config) => {
    // Check if this is a request to the commissars endpoint
    if (config.url === 'commissars' || config.url === '/api/commissars') {
      return Promise.reject({
        response: {
          status: 200,
          data: mockCommissarsData,
          config: config
        },
        config: config,
        isAxiosError: false,
        _isMockResponse: true
      });
    }
    
    return config;
  });

  // Intercept responses to handle our mock data
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // If this is our mock response, return it as a successful response
      if (error._isMockResponse && !error.isAxiosError) {
        console.log('✅ Mock API response returned for', error.config.url);
        return Promise.resolve({
          data: error.response.data,
          status: error.response.status,
          statusText: 'OK',
          headers: {},
          config: error.config
        });
      }
      
      // For other errors, pass them through
      return Promise.reject(error);
    }
  );
}

// Alternative simpler approach - override axios.get for specific URL
export function setupSimpleMockAPI() {
  const originalGet = axios.get;
  
  // @ts-ignore - Override axios.get temporarily for demo purposes
  axios.get = function(url: string, config?: any) {
    if (url === 'commissars' || url === '/api/commissars') {
      return Promise.resolve({
        data: mockCommissarsData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {}
      });
    }
    
    return originalGet.call(this, url, config);
  };
}
