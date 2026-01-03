import { Response, Request } from "express";
import { AuthRequest } from "../middleware/auth";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Disease } from "../models/diseases";

dotenv.config();

export const postDiseases = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, symptoms, species } = req.body;

    const ownerId = req.user.sub || req.user._id;
    const image = req.file?.buffer;

    if (!title || !description || !symptoms || !species || !ownerId) {
      return res.status(400).json({ message: "Missing required fields..!" });
    }

    let imageUrl = "";

    if (image) {
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
      const upload: any = await uploadImage();
      imageUrl = upload.secure_url;
    }

    const disease = await Disease.create({
      title,
      description,
      symptoms,
      species,
      createdBy: ownerId,
      imageUrl,
    });

    return res.status(201).json({ message: "Posted succesfully...!", disease });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateDisease = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, symptoms, species } = req.body;
    const ownerId = req.user.sub || req.user._id;
    const image = req.file?.buffer;

    console.log(ownerId);
    console.log("update diseas is working");
    console.log(title, description, symptoms, species);

    if (!title || !description || !symptoms || !species || !ownerId) {
      return res.status(400).json({ message: "Missing required fields..!" });
    }

    const diseaseId = req.body.diseaseId;

    if (!diseaseId) {
      return res.status(400).json({ message: "Disease ID is required" });
    }

    const existingDisease = await Disease.findById(diseaseId);

    if (!existingDisease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    if (existingDisease.createdBy.toString() !== ownerId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this disease post" });
    }

    let imageUrl = existingDisease.imageUrl;

    if (image) {
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
      const upload: any = await uploadImage();
      imageUrl = upload.secure_url;
    }

    console.log(imageUrl);

    const updateDisease = await Disease.findByIdAndUpdate(
      diseaseId,
      {
        title,
        description,
        symptoms,
        species,
        imageUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Disease Updated successfully",
      disease: updateDisease,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const deleteDisease = async (req: AuthRequest, res: Response) => {
  try {
    const { diseaseId } = req.params;

    const disease = await Disease.findById(diseaseId);

    if (!disease) {
      return res.status(404).json({ message: "Disease Not Found" });
    }

    if (disease.createdBy.toString() !== req.user.sub) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this disease" });
    }
    if (disease.imageUrl) {
      const publicId = disease.imageUrl.split("/").pop()?.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await Disease.findByIdAndDelete(diseaseId);

    return res.status(200).json({ message: "Disease Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const getAllDiseases = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.toString() || "";
    const species = req.query.species?.toString() || "";

    const skip = (page - 1) * limit;

    let filters: any = {};
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { symptoms: { $regex: search, $options: "i" } },
      ];
    }


    if (species) {
      filters.species = species;
    }
    const totalUserPosts = await Disease.countDocuments({ createdBy: req.user.sub });

    const total = await Disease.countDocuments(filters);

    const diseases = await Disease.find(filters)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Diseases fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      diseases,
      totalUserPosts
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const getAllDiseasesByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.sub || req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.toString() || "";
    const species = req.query.species?.toString() || "";

    const skip = (page - 1) * limit;

    let filters: any = {
      createdBy: userId,
    };

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { symptoms: { $regex: search, $options: "i" } },
      ];
    }

    if (species) {
      filters.species = species;
    }

    const total = await Disease.countDocuments(filters);


    const diseases = await Disease.find(filters)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "User diseases fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      diseases
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};
