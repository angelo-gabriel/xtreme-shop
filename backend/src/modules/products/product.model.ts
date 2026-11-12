import mongoose, { Schema } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: mongoose.Types.ObjectId;
  images: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ categoryId: 1 });
productSchema.index({ active: 1, createdAt: -1 });

export const Product = mongoose.model<IProduct>("Product", productSchema);
