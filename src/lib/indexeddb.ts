/**
 * IndexedDB utility for storing generation history and flowcharts
 */

const DB_NAME = 'PlanningGeneratorDB';
const DB_VERSION = 2; // Upgraded version for flowchart store
const STORE_NAME = 'generations';
const FLOWCHART_STORE_NAME = 'flowcharts';

// ===========================================
// Types
// ===========================================

export interface GenerationHistory {
  id: string;
  timestamp: number;
  projectDetails: any;
  generatedPlan: any;
  rawResponse?: string;
  customPrompt?: string;
}

export interface FlowchartHistory {
  id: string;
  timestamp: number;
  updatedAt: number;
  title: string;
  websiteType: string;
  websiteTypeName: string;
  flowchartType: string;
  selectedFeatures: string[];
  mermaidCode: string;
  svgData?: string;
  summary: {
    totalFeatures: number;
    totalComponents: number;
    totalDataModels: number;
    totalPages: number;
    integrations: string[];
    estimatedWeeks: number;
  };
  rawResponse?: string;
}

// ===========================================
// Database Initialization
// ===========================================

/**
 * Initialize and open the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create generations store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Create flowcharts store if it doesn't exist
      if (!db.objectStoreNames.contains(FLOWCHART_STORE_NAME)) {
        const flowchartStore = db.createObjectStore(FLOWCHART_STORE_NAME, { keyPath: 'id' });
        flowchartStore.createIndex('timestamp', 'timestamp', { unique: false });
        flowchartStore.createIndex('websiteType', 'websiteType', { unique: false });
        flowchartStore.createIndex('flowchartType', 'flowchartType', { unique: false });
      }
    };
  });
}

// ===========================================
// Generation History Functions
// ===========================================

/**
 * Save a generation to IndexedDB
 */
export async function saveGeneration(data: Omit<GenerationHistory, 'id' | 'timestamp'>): Promise<string> {
  const db = await openDB();
  const id = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const generation: GenerationHistory = {
      id,
      timestamp,
      ...data,
    };

    const request = store.add(generation);

    request.onsuccess = () => {
      db.close();
      resolve(id);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Get all generations sorted by timestamp (newest first)
 */
export async function getAllGenerations(): Promise<GenerationHistory[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      db.close();
      const results = request.result as GenerationHistory[];
      // Sort by timestamp descending (newest first)
      results.sort((a, b) => b.timestamp - a.timestamp);
      resolve(results);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Get a single generation by ID
 */
export async function getGeneration(id: string): Promise<GenerationHistory | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Delete a generation by ID
 */
export async function deleteGeneration(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      db.close();
      resolve();
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Delete all generations
 */
export async function clearAllGenerations(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      db.close();
      resolve();
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Get count of all generations
 */
export async function getGenerationCount(): Promise<number> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.count();

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

// ===========================================
// Flowchart History Functions
// ===========================================

/**
 * Save a flowchart to IndexedDB
 */
export async function saveFlowchart(data: Omit<FlowchartHistory, 'id' | 'timestamp' | 'updatedAt'>): Promise<string> {
  const db = await openDB();
  const id = `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FLOWCHART_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(FLOWCHART_STORE_NAME);
    
    const flowchart: FlowchartHistory = {
      id,
      timestamp,
      updatedAt: timestamp,
      ...data,
    };

    const request = store.add(flowchart);

    request.onsuccess = () => {
      db.close();
      resolve(id);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Get all flowcharts sorted by timestamp (newest first)
 */
export async function getAllFlowcharts(): Promise<FlowchartHistory[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FLOWCHART_STORE_NAME], 'readonly');
    const store = transaction.objectStore(FLOWCHART_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      db.close();
      const results = request.result as FlowchartHistory[];
      // Sort by timestamp descending (newest first)
      results.sort((a, b) => b.timestamp - a.timestamp);
      resolve(results);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Get a single flowchart by ID
 */
export async function getFlowchart(id: string): Promise<FlowchartHistory | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FLOWCHART_STORE_NAME], 'readonly');
    const store = transaction.objectStore(FLOWCHART_STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Update a flowchart by ID
 */
export async function updateFlowchart(id: string, data: Partial<Omit<FlowchartHistory, 'id' | 'timestamp'>>): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FLOWCHART_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(FLOWCHART_STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const existing = getRequest.result as FlowchartHistory | undefined;
      if (!existing) {
        db.close();
        reject(new Error('Flowchart not found'));
        return;
      }

      const updated: FlowchartHistory = {
        ...existing,
        ...data,
        updatedAt: Date.now(),
      };

      const putRequest = store.put(updated);

      putRequest.onsuccess = () => {
        db.close();
        resolve();
      };

      putRequest.onerror = () => {
        db.close();
        reject(putRequest.error);
      };
    };

    getRequest.onerror = () => {
      db.close();
      reject(getRequest.error);
    };
  });
}

/**
 * Delete a flowchart by ID
 */
export async function deleteFlowchart(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FLOWCHART_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(FLOWCHART_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      db.close();
      resolve();
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Delete all flowcharts
 */
export async function clearAllFlowcharts(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FLOWCHART_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(FLOWCHART_STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      db.close();
      resolve();
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Get count of all flowcharts
 */
export async function getFlowchartCount(): Promise<number> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FLOWCHART_STORE_NAME], 'readonly');
    const store = transaction.objectStore(FLOWCHART_STORE_NAME);
    const request = store.count();

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Get flowcharts by website type
 */
export async function getFlowchartsByWebsiteType(websiteType: string): Promise<FlowchartHistory[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FLOWCHART_STORE_NAME], 'readonly');
    const store = transaction.objectStore(FLOWCHART_STORE_NAME);
    const index = store.index('websiteType');
    const request = index.getAll(websiteType);

    request.onsuccess = () => {
      db.close();
      const results = request.result as FlowchartHistory[];
      results.sort((a, b) => b.timestamp - a.timestamp);
      resolve(results);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}
