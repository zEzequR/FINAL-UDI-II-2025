export default class user
{
    constructor(id, username, email, password)
    {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static async buscarUsuario(user)
    {
        try
        {
            const response = await fetch("../Constraints/users.json");
            const usersJSON = await response.json();
            return usersJSON.find(u => u.email === user.email && u.password === user.password) || null;
        }
        catch (error)
        {
            console.error("Error buscando usuario:", error);
            return null;
        }
    }
}