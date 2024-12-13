import axiosInstance from "./api.service";

async function startRegistrationWithUsername(username: string) {
    try {
        const response = await axiosInstance.post(`/auth/register/start/${username}`);
        return response.data.publicKey;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to retrieve registration options from backend");
    }
}

async function finishRegistrationwithUsername(username: string, credentials: any) {
    try {
        const response = await axiosInstance.post(`/auth/register/finish/${username}`, credentials);
        return response.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to complete registration");
    }
}

async function startAuthenticationWithUsername(username: string) {
    try {
        const response = await axiosInstance.post(`/auth/authenticate/start/${username}`);
        console.log(response.data.publicKey)
        return response.data.publicKey;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to retrieve authentication options from backend");
    }
}

async function finishAuthenticationwithUsername(username: string, credentials: any) {
    try {
        const response = await axiosInstance.post(`/auth/authenticate/finish/${username}`, credentials);
        return response.data;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to complete authentication");
    }
}

export {
    startRegistrationWithUsername,
    finishRegistrationwithUsername,
    startAuthenticationWithUsername,
    finishAuthenticationwithUsername
};