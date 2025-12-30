import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { PetDetail } from "../models/petDetails.model";
import { Pet } from "../models/pet.model";

export const addPetDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { petId, type, date, description, notes } = req.body;

    if (!petId || !type || !date || !description || !notes) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newDetail = new PetDetail({
      petId,
      type,
      date,
      description,
      notes,
    });

    await newDetail.save();

    res.status(201).json({ message: "Pet detail added", newDetail });
  } catch (error) {
    res.status(500).json({ message: "Internal server error !" });
  }
};

// Delete pet detail
export const deletePetDetail = async (req: AuthRequest, res: Response) => {
  try {
    const detailId = req.query.detailId;

    const detail = await PetDetail.findById(detailId);
    if (!detail) {
      return res.status(404).json({ message: "Pet detail not found" });
    }

    // check ownership
    const pet = await Pet.findById(detail.petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (pet.owner.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Unauthorized to delete this detail" });
    }

    await PetDetail.findByIdAndDelete(detailId);

    return res.status(200).json({ message: "Pet detail deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all details for a specific pet
export const getPetDetails = async (req: AuthRequest, res: Response) => {
  try {
    const petId = req.params.petId;
    console.log(petId)
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (pet.owner.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Unauthorized to view details for this pet" });
    }

    const details = await PetDetail.find({ petId }).sort({ date: -1 });

    return res.status(200).json({ details });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all details for logged-in user (optional)
export const getMyPetDetails = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user.sub;

    const pets = await Pet.find({ owner: ownerId }).select("_id");

    const petIds = pets.map((p) => p._id);

    const details = await PetDetail.find({ petId: { $in: petIds } }).sort({ date: -1 });

    return res.status(200).json({ details });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
