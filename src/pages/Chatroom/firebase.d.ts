declare module 'firebase' {
    interface Database {
      ref(path?: string): firebase.database.Reference;
    }
  
    interface App {
      database?(): Database;
    }
  }
  