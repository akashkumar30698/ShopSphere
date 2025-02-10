

export async function checkCookie() {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/check-cookie`, {
        method: "GET",
        credentials: "include", // Important for cookies!
      });
  
      const data = await response.json();
  
      if (data.exists) {
        console.log("✅ Cookie found!");
        return data.value
      } else {
        console.log("❌ Cookie not found!");
        return false
      }
    } catch (error) {
      console.error("Error checking cookie:", error);
      return false

    }

  }
  
 
  