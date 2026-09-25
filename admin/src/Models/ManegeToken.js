class TokenManager {
  constructor() {
    this.token = "";
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("authToken", token);
    console.log("Token saved!");
  }

  getToken() {
    const savedToken = localStorage.getItem("authToken");
    console.log("Saved token:", savedToken);
    return savedToken;
  }

  clearToken() {
    localStorage.removeItem("authToken");
    this.token = "";
    console.log("Token cleared!");
  }
}
export {TokenManager}