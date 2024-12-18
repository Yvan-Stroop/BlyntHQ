declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL: string;
        DATAFORSEO_USERNAME: string;
        DATAFORSEO_PASSWORD: string;
        NODE_ENV: 'development' | 'production' | 'test';
      }
    }
  }
  
  export {} 