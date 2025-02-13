import useLocalStorage from "../hooks/UseLocalStorage";


function useUserService() {
    const [users, setUsers] = useLocalStorage("users_db", []);
    const [currentUser, setCurrentUser] = useLocalStorage("current_user", null);

    
    const getAll = () => users;

   
    const getById = (id) => users.find(user => user.id == id) || null;

 
    const signup = (user) => {
        if (users.some(u => u.email === user.email)) {
            throw new Error("Email already exists.");
        }
        const newUser = { ...user, id: Date.now() };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        return newUser;
    };

    
    const login = (email, password) => {
        const user = users.find(u => u.email === email);
        if (!user) throw new Error("Invalid email.");
        if (user.password !== password) throw new Error("Invalid password.");
        setCurrentUser(user);
        return user;
    };

   
    const logout = () => setCurrentUser(null);

 
    const update = (id, updatedUser) => {
        const updatedUsers = users.map(user =>
            user.id === id ? { ...user, ...updatedUser } : user
        );
        setUsers(updatedUsers);
        if (currentUser?.id === id) setCurrentUser(updatedUsers.find(user => user.id === id));
        return updatedUsers.find(user => user.id === id);
    };

   
    const remove = (id) => {
        setUsers(users.filter(user => user.id !== id));
        if (currentUser?.id === id) setCurrentUser(null);
    };

  
    const clearAll = () => {
        setUsers([]);
        setCurrentUser(null);
    };

    return { 
        users, currentUser, getAll, getById, signup, login, logout, update, remove, clearAll 
    };
}

export default useUserService;
