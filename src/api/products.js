//const backendURL ='http://localhost:5000'

const backendURL = import.meta.env.VITE_BACKEND_URL;

export async function fetchProducts() {
  try {

   const res = await fetch(`${backendURL}/api/products`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    
    }

    const data = await res.json();
  
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    return [];
  }
}



