class TokenManager {
  constructor() {
    this.token = "";
    this.key='';
  }


getKey(){
  return this.key;
}
setKey(Key){
  this.key=Key;
}
/**
 * 
 * @param {string} key 
 * @param {string} token 
 */
  setToken(token) {
    this.token = token;
    
    localStorage.setItem(this.key, token);
    console.log("Token saved!");
  }
/**
 * "authToken"
 * @param {string} key 
 * @returns 
 */
  getToken() {
    const savedToken = localStorage.getItem(this.key);
    console.log("Saved token:", savedToken);
    return savedToken;
  }

  clearToken() {
    localStorage.removeItem(this.key);
    this.token = "";
    this.key="";
    console.log("Token cleared!");
  }
}
export {TokenManager}