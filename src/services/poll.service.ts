import axiosInstance from "./api.service";

async function CreateNewPoll(username: string, title: string, options: string[]){
    try {
        const reqBody = { username, title, options }
        const response = await axiosInstance.post(`/polls/new`, reqBody);
        return response.data;
    } catch(err) {
        console.log("Error Creating Poll : ", err);
        throw new Error("Error Creating New Poll");
    }
}

async function FetchWithPollId(pollId: string){
    try {
        const response = await axiosInstance.get(`/polls/${pollId}/search`);
        return response.data;
    } catch(err) {
        console.log("Error Fetching Poll Data : ", err);
        throw new Error("Error Fetching Poll Data");
    }
}

async function FetchAllPolls(){
    console.log("Backend Base URL:", process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
    try {
        const response = await axiosInstance.get(`/all`);
        console.log("URL:", response.config.url);
        return response.data;
    } catch(err) {
        console.log("Error Fetching Polls : ", err);
        throw new Error("Error Fetching Polls");
    }
}

async function FetchUserPolls(userName: string){
    try {
        const response = await axiosInstance.get(`/all?userId=${userName}`);
        return response.data;
    } catch(err) {
        console.log("Error Fetching Polls : ", err);
        throw new Error("Error Fetching Polls");
    }
}

async function DeletPollById(pollId: string){
    try {
        const response = await axiosInstance.get(`/polls/${pollId}/delete`);
        return response.data;
    } catch(err) {
        console.log(`Error Deleting Poll with Id : ${pollId}`, err);
        throw new Error("Error Deleting Poll");
    }
}

async function ResetPollByID(pollId: string){
    try {
        const response = await axiosInstance.get(`/polls/${pollId}/reset`);
        return response.data;
    } catch(err) {
        console.log(`Error Resetting Poll with Id : ${pollId}`, err);
        throw new Error("Error Resetting Poll");
    }
}

async function ClosePollByID(pollId: string){
    try {
        const response = await axiosInstance.post(`/polls/${pollId}/close`);
        return response.data;
    } catch(err) {
        console.log(`Error Closing Poll with Id : ${pollId}`, err);
        throw new Error("Error Closing Poll");
    }
}

async function CastVote(pollId: string, optionId: string){
    try {
        const response = await axiosInstance.post(`/polls/${pollId}/vote?option_id=${optionId}`);
        return response.data;
    } catch(err) {
        console.log(`Error Voting for Poll with Id : ${pollId}`, err);
        throw new Error("Error casting Vote");
    }
}

export { 
    CreateNewPoll, 
    FetchWithPollId, 
    FetchAllPolls, 
    ResetPollByID,
    DeletPollById, 
    ClosePollByID,
    CastVote,
    FetchUserPolls
};