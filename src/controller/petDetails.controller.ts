import { Response } from "express";
import { Pet } from "../models/pet.model";
import { AuthRequest } from "../middleware/auth";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
import { error } from "console";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

export const deletePet = async (req:AuthRequest, res:Response)=>{
  try{
    const petId = req.query.petId

    const pet = await Pet.findById(petId)
    
    if(!pet){
      return res.status(404).json({message:"Pet not Found"})
    } 

    if(pet.owner.toString() !== req.user.sub){
      return res.status(403).json({message:"Unauthorized to delete this pet"})
    }

    if(pet.imageUrl){
      const publicId = pet.imageUrl.split("/").pop()?.split(".")[0]

      if(publicId){
        await cloudinary.uploader.destroy(publicId).catch(()=>{})
      }
    }

    await Pet.findByIdAndDelete(petId)

    return res.status(200).json({message:"Pet Deleted Successfully"})
  }catch(err){
        return res.status(500).json({ message: "Internal server error" });
  }
}

export const updatePet = async (req:AuthRequest,res:Response) =>{
  try{
    const petId = req.body.petId
    const { name,type,age,breed } = req.body
    const image = req.file?.buffer

    console.log(petId)

    const pet = await Pet.findById(petId)

    if (!pet) {
      return res.status(404).json({ message: "Pet Not Found" })
    }

    if(pet.owner.toString() !== req.user.sub){
      return res.status(403).json({message:"Unauthorized to update this pet"})
    }

    const updateFields : any = {}

    if(name) updateFields.name = name
    if(type) updateFields.type = type
    if(age) updateFields.age = age
    if(breed) updateFields.breed = breed

    if (image) {
      const uploadImage = () => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          ).end(image);
        });
      };

      const uploaded: any = await uploadImage();
      updateFields.imageUrl = uploaded.secure_url;
    }

      const updatedPet = await Pet.findByIdAndUpdate(petId, updateFields, {
        new: true,
       });

    return res.status(200).json({
      message: "Pet updated successfully",
      pet: updatedPet,
    });
  }catch(err){
    res.status(500).json({ message: "Internal server error" })
  }
} 

export const addPet = async (request: AuthRequest, response: Response) => {
  try {

    const { name, type, age, breed } = request.body;

    const ownerId = request.user.sub || request.user._id; 
    const image = request.file?.buffer;

    console.log(name,type,age,breed,image)
    if (!name || !type || !age || !breed || !image) {
      return response.status(400).json({
        message: "Missing required fields",
      });
    }

    const uploadImage = () => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(image);
      });
    };

    const uploaded: any = await uploadImage();

    const pet = await Pet.create({
      owner: ownerId,
      name,
      type,
      age,
      breed,
      imageUrl: uploaded.secure_url,
    });

    return response.status(201).json({
      message: "Pet added successfully",
      pet,
    });
  } catch (error) {
    console.error("Add Pet Error:", error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
}

export const getMyPet = async (req:AuthRequest,res:Response)=>{
  try{
    const ownerId = req.user.sub || req.user._id

    const pets = await Pet.find({owner:ownerId})
      .sort({createAt:-1})

      return res.status(200).json({
        pets
      })
  }catch(err){
    return res.status(500).json({message:"Internal server Error"})
  }
}