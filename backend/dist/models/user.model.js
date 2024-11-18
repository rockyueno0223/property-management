"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class UserModel {
    constructor() {
        this.users = [
            {
                id: "aaa",
                username: "John",
                email: "john@gmail.com",
                password: "aaaaaa",
                accountType: "owner"
            }
        ]; // test code, delete later
    }
    // Get all users
    findAll() {
        return this.users;
    }
    ;
    // Get user by id
    findById(id) {
        const user = this.users.find(user => user.id === id);
        if (!user)
            return undefined;
        return user;
    }
    ;
    // Get user by username
    findByUsername(username) {
        const user = this.users.find(user => user.username === username);
        if (user) {
            return user;
        }
        return undefined;
    }
    ;
    // Get user by email
    findByEmail(email) {
        const user = this.users.find(user => user.email === email);
        if (user) {
            return user;
        }
        return undefined;
    }
    ;
    // Create user
    createUser(newUser) {
        const user = Object.assign({ id: (0, uuid_1.v4)() }, newUser);
        this.users.push(user);
        return user;
    }
    ;
    // Edit user
    editUser(id, newData) {
        var _a, _b;
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1)
            return undefined;
        const updatedUser = {
            id: this.users[index].id,
            username: (_a = newData.username) !== null && _a !== void 0 ? _a : this.users[index].username,
            email: (_b = newData.email) !== null && _b !== void 0 ? _b : this.users[index].email,
            password: this.users[index].password,
            accountType: this.users[index].accountType
        };
        this.users[index] = updatedUser;
        return updatedUser;
    }
    ;
    // Delete user
    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1)
            return false;
        this.users.splice(index, 1);
        return true;
    }
    ;
}
;
exports.default = new UserModel;
