class User {

  

  // static counter to auto-increment IDs
 static #idCounter = 1;
 
  constructor(username = null, password= null, email = null, role = "guest") {
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    User.#idCounter++
  }

  getInfo() {
    return `Username: ${this.username}, Email: ${this.email}, Role: ${this.role}`;
  }

  updatePassword(newPassword) {
    this.password = newPassword;
    return "Password updated successfully.";
  }

  updateRole(newRole) {
    this.role = newRole;
    return `Role updated to ${this.role}`;
  }

  validateLogin(inputPassword) {
    return this.password === inputPassword;
  }
  numberOfUser()
  {
    return User.#idCounter
  }
}

export { User };

