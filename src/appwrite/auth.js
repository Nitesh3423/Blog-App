import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            if (!name || typeof name !== 'string' || name.length === 0 || name.length > 128) {
                throw new Error("Invalid name format or length");
            }
            const userAccount = await this.account.create(ID.unique(), email, password, {name});
            if (userAccount) {
                // Optionally log in the user after account creation
                return this.login({email, password});
            } else {
                throw new Error("Failed to create account"); // Handle failure to create account
            }
        } catch (error) {
            console.log("AuthService :: createAccount :: error", error);
            throw error; // Rethrow the error to handle it where this method is called
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.log("AuthService :: login :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("AuthService :: getCurrentUser :: error", error);
            throw error;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("AuthService :: logout :: error", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
