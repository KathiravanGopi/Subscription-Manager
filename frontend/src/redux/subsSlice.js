import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'
import { api_url } from '../config/apiConfig';


export const fetchSubs=createAsyncThunk('subscriptions/fetchSubs',async()=>{
    try{
        const response=await axios.get(`${api_url}/subscriptions`);
        // Normalize _id to id for frontend consistency
        return (response.data || []).map(x => ({ id: x._id || x.id, ...x }));
    }catch(error){
        return Promise.reject(error.response?.data || 'Error fetching subscriptions');
    }
})

export const postSubs=createAsyncThunk('subscriptions/postSubs',async(subData)=>{
    try{
        const response=await axios.post(`${api_url}/subscriptions`,subData);
        const x = response.data;
        return { id: x._id || x.id, ...x };
    }catch(error){
        return Promise.reject(error.response?.data || 'Error creating subscription');
    }
})

export const updateSubs=createAsyncThunk('subscriptions/updateSubs',async({id,subData})=>{
    try{
        const response=await axios.put(`${api_url}/subscriptions/${id}`,subData);
        const x = response.data;
        return { id: x._id || x.id, ...x };
    }catch(error){
        return Promise.reject(error.response?.data || 'Error updating subscription');
    }
})

export const deleteSubs=createAsyncThunk('subscriptions/deleteSubs',async(id)=>{
    try{
        await axios.delete(`${api_url}/subscriptions/${id}`);
        return { id };
    }catch(error){
        return Promise.reject(error.response?.data || 'Error deleting subscription');
    }
})


const subsSlice=createSlice({
    name:'subscriptions',
    initialState:{
        subs:[],
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchSubs.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchSubs.fulfilled,(state,action)=>{
            state.loading=false;
            state.subs=action.payload;
        })
        .addCase(fetchSubs.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to fetch subscriptions';
        })
        .addCase(postSubs.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(postSubs.fulfilled,(state,action)=>{
            state.loading=false;
            state.subs.push(action.payload);
        })
        .addCase(postSubs.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to create subscription';
        })
        .addCase(updateSubs.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateSubs.fulfilled,(state,action)=>{
            state.loading=false;
            const index=state.subs.findIndex(sub=>sub.id===action.payload.id);
            if(index!==-1){
                state.subs[index]=action.payload;
            }
        })
        .addCase(updateSubs.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to update subscription';
        })
        .addCase(deleteSubs.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteSubs.fulfilled,(state,action)=>{
            state.loading=false;
            state.subs=state.subs.filter(sub=>sub.id!==action.payload.id);
        })
        .addCase(deleteSubs.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to delete subscription';
        })

    }
})

export const selectSubs=(state)=>state.subscriptions.subs;
export const selectLoading =(state)=>state.subscriptions.loading;
export const selectError =(state)=>state.subscriptions.error;

export default subsSlice.reducer;