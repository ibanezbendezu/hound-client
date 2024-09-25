import axios from "../lib/axios"

export const ownerDataRequest = async (owner: string) => {
    try {
        const res = await axios.get(`/github/profile/${owner}`);
        let {ownerProfile, repos} = res.data;

        repos.sort((a: { created_at: string | number | Date; }, b: {
            created_at: string | number | Date;
        }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return {ownerProfile, repos};
    } catch (error) {
        console.error("Error fetching owner data:", error);
        throw error;
    }
}

export const groupDataRequestBySha = async (sha: string) => {
    try {
        const res = await axios.get(`/groups/sha/${sha}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching group data:", error);
        throw error;
    }
}

export const groupCreateRequest = async (repos: any[], username: any) => {
    try {
        const requestBody = {repos, username};
        const res = await axios.post(`/groups`, requestBody);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching group create data:", error);
        throw error;
    }
}

export const groupSummaryRequest = async (sha: string) => {
    try {
        const res = await axios.get(`/groups/summary/${sha}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching group summary data:", error);
        throw error;
    }
}

export const groupUpdateRequest = async (id: number, repos: any[], username: any) => {
    try {
        const requestBody = {repos, username};
        const res = await axios.put(`/groups/${id}`, requestBody);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching group update data:", error);
        throw error;
    }
}

export const groupUpdateRequestBySha = async (sha: string, repos: any[], username: any) => {
    try {
        const requestBody = {repos, username};
        const res = await axios.put(`/groups/sha/${sha}`, requestBody);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching group update data:", error);
        throw error;
    }
}

export const groupDeleteRequestBySha = async (sha: string) => {
    try {
        const res = await axios.delete(`/groups/sha/${sha}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching group delete data:", error);
        throw error;
    }
}


//FILES
export const fileContentRequest = async (id: number) => {
    try {
        const res = await axios.get(`/github/file/${id}/content`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching file content data:", error);
        throw error;
    }
}

export const fileContentRequestBySha = async (sha: string) => {
    try {
        const res = await axios.get(`/github/file/sha/${sha}/content`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching file content data:", error);
        throw error;
    }
}


//PAIRS
export const pairSimilaritiesByGroupShaRequest = async (sha: string) => {
    try {
        const res = await axios.get(`/groups/sha/${sha}/similarities`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching pair similarities data:", error);
        throw error;
    }
}

export const pairByIdDataRequest = async (id: number) => {
    try {
        const res = await axios.get(`/pairs/${id}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching pair data:", error);
        throw error;
    }
}


export const pairsByGroupShaDataRequest = async (sha: string, fileSha: string) => {
    try {
        const res = await axios.get(`/pairs/sha/${sha}/${fileSha}`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching pair data:", error);
        throw error;
    }
}

//USER INFO
export const userInfoRequest = async () => {
    try {
        const res = await axios.get(`/profile`);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching user info data:", error);
        throw error;
    }
}

export const repositoriesDataRequest = async (repos: string, username: string) => {
    try {
        const requestBody = {repos, username};
        const res = await axios.post(`/github/repositories/search`, requestBody);
        return {data: res.data};
    } catch (error) {
        console.error("Error fetching repositories data:", error);
        throw error;
    }
}
