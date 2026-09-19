const express = require("express");
const Visitor = require("../model/visitorModel");
const mongoose = require("mongoose");

const register = async(req,res) => {
    try{

    const { name , email, phone} = req.body;

    const existingvisitor = await Visitor.findOne({email});

    if(existingvisitor){
        return res.status(400).json({
            message: "Visitor already exists"
        });
    }

//create visitor
const visitor = await Visitor.create({
    name,
    email,
    phone,
});

res.status(201).json({
    message:"Thank you for visiting",
    visitor:{
         id: visitor._id,
         name: visitor.name,
         email: visitor.email
    }
});
    }
    catch(error){
        res.status(500).json({
            message: "error occur",
            error: error.message

        });
    }

};

module.exports = {register};