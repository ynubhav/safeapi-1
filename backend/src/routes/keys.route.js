import express from "express";

const apikeyRouter=express.Router();

apikeyRouter.post('/generate/:projectId',(req,res)=>{})
apikeyRouter.get('/project/:projectId',(req,res)=>{})
apikeyRouter.delete('/:keyId',(req,res)=>{})
apikeyRouter.patch('/:keyId/toggle',(req,res)=>{})
apikeyRouter.get('/usage/:keyId',(req,res)=>{})

export { apikeyRouter }