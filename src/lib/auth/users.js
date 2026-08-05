export const DEMO_USERS = [
    {
        id: "user-1",
        email: "adarsh@agaraassociates.com",
        password: "agara2026",
        name: "Adarsh P",
        role: "Principal Architect",
    },
];
export function findUserByCredentials(email, password) {
    return DEMO_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
}
