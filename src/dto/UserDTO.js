// DTO para ocultar información sensible del usuario
export class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    this.cart = user.cart;
    this.lastConnection = user.lastConnection;
    // NO incluimos: password, timestamps internos, etc.
  }
}

// DTO para respuesta de autenticación
export class UserAuthDTO {
  constructor(user) {
    this.id = user._id;
    this.email = user.email;
    this.role = user.role;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
  }
}

// DTO para listado público de usuarios
export class UserPublicDTO {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;
  }
}