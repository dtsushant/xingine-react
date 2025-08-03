import axios from 'axios';
import { mockCommissarsData } from './mockData';

// Mock axios interceptor for the commissars endpoint
export function setupMockAPI() {
  // Intercept requests to /api/commissars
  axios.interceptors.request.use((config) => {
    // Check if this is a request to the commissars endpoint
    if (config.url === 'commissars' || config.url === '/api/commissars') {

      // Return a mock response immediately
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
      if (error._isMockResponse) {
        console.log('✅ Mock API response returned for commissars');
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
