import { useAuthStore } from "./auth_store";
import { api } from "./api";


export async function logout() {
    const auth = useAuthStore();
    try {
        await api.post('token/ban/'); // Ce endpoint doit supprimer le cookie refresh côté serveur
    } catch (e) {
        console.warn("Logout request failed", e);
    } finally {
        auth.resetStore(); // ou auth.$reset() si tu veux reset complet
    }
}