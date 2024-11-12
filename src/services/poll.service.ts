import axios, { AxiosError } from "axios";

async function create_new_poll(title : string , options : string[]){
    const reqBody = {
        username : "sainathr19",
        title,
        options
    }
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/polls/new`,reqBody);
        return response.data;
    }catch(err){
        console.log("Error Creating Poll : ",err);
        throw new Error("Error Creating New Poll");
    }
} 

async function reset_poll(pollId : string ){
    const reqBody = {
        username : "tklmro",
        pollId
    }
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/polls/${pollId}/reset`,reqBody);
        return response.data;
    }catch(err){
        console.log("Error Creating Poll : ",err);
        throw new Error("Error Creating New Poll");
    }
} 

async function fetchWithPollId(pollId : string ){
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/polls/${pollId}/search`);
        return response.data;
    }catch(err){
        console.log("Error Fetching Poll Data : ",err);
        throw new Error("Error Fetching Poll Data");
    }
} 


async function fetch_all_polls(){
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/polls/all`);
        return response.data;
    }catch(err){
        console.log("Error Fetching Polls : ",err);
        throw new Error("Error Fetching Polls");
    }
} 


async function deletPollById(pollId : string){
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/polls/${pollId}/delete`);
        return response.data;
    }catch(err){
        console.log(`Error Deleting Poll with Id : ${pollId}`,err);
        throw new Error("Error Deleting Poll");
    }
} 

async function resetPollByID(pollId : string){
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/polls/${pollId}/reset`);
        return response.data;
    }catch(err){
        console.log(`Error Resettign Poll with Id : ${pollId}`,err);
        throw new Error("Error Resetting Poll");
    }
} 


async function closePollByID(pollId : string){
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/polls/${pollId}/close`);
        return response.data;
    }catch(err){
        console.log(`Error Closing Poll with Id : ${pollId}`,err);
        throw new Error("Error Closing Poll");
    }
} 


async function castVote(pollId : string , optionId : string){
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/polls/${pollId}/vote?option_id=${optionId}`);
        return response.data;
    }catch(err){
        let error : AxiosError = err as AxiosError;
        console.log(`Error Voting for Poll with Id : ${pollId}`,err);
        throw new Error("Error casting Vote");
    }
} 
export { create_new_poll, fetchWithPollId, fetch_all_polls, reset_poll,deletPollById , resetPollByID , closePollByID,castVote };

