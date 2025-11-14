"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import ImageUpload from "@/components/ImageUpload"

export default function NewCoursePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor_name: "",
    instructor_image_url: "https://cdn-icons-png.flaticon.com/512/3675/3675805.png",
    price: "",
    original_price: "",
    discount_percentage: "",
    category: "Development",
    image_url: "/placeholder.svg?height=400&width=600",
    video_url: "",
    duration_hours: "",
    total_lectures: "",
    language: "English",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Don't update image_url from input field since we'll handle it separately
    if (name === 'image_url') return;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "price",
        "original_price",
        "discount_percentage",
        "duration_hours",
        "total_lectures",
      ].includes(name)
        ? value === "" ? "" : Number.parseFloat(value)
        : value,
    }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: data[0].name }));
        }
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError("");
    setAddingCategory(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (response.ok) {
        const newCategory = await response.json();
        setCategories((prev) => [...prev, newCategory]);
        setFormData((prev) => ({ ...prev, category: newCategory.name }));
        setNewCategoryName("");
        setIsModalOpen(false);
      } else {
        const data = await response.json();
        setCategoryError(data.error || "Failed to add category");
      }
    } catch (err) {
      setCategoryError("An error occurred. Please try again.");
      console.error("Error adding category:", err);
    } finally {
      setAddingCategory(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.url; // Return the URL of the uploaded image
      } else {
        console.error('Image upload failed');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      let imageUrl = formData.image_url; // default to current placeholder

      if (imageFile) {
        // Upload the image file and get the URL
        const uploadedImageUrl = await uploadImage(imageFile);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      // Create course with the image URL
      const courseData = { ...formData, image_url: imageUrl };
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        router.push('/admin/courses');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create course');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error creating course:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button for mobile */}
        <div className="mb-6 lg:hidden">
          <Link href="/admin/dashboard/courses">
            <button className="p-2 hover:bg-slate-100 rounded mb-4">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
        </div>
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Course Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Advanced React Development"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Course description"
                  rows={4}
                />
              </div>
            </div>

            {/* Instructor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instructor Name</label>
                <Input
                  name="instructor_name"
                  value={formData.instructor_name}
                  onChange={handleChange}
                  placeholder="Instructor name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instructor Image URL</label>
                <Input
                  name="instructor_image_url"
                  value={formData.instructor_image_url}
                  onChange={handleChange}
                  placeholder="Image URL"
                  disabled
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₦)</label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Original Price (₦)</label>
                <Input
                  name="original_price"
                  type="number"
                  value={formData.original_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Discount (%)</label>
                <Input
                  name="discount_percentage"
                  type="number"
                  value={formData.discount_percentage}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                          Enter the name of the new category you want to add.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="categoryName" className="text-right">
                            Name
                          </label>
                          <Input
                            id="categoryName"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        {categoryError && <p className="text-red-500 text-sm">{categoryError}</p>}
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddCategory} disabled={addingCategory}>
                          {addingCategory ? "Adding..." : "Add Category"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                <Input name="language" value={formData.language} onChange={handleChange} placeholder="English" />
              </div>
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ImageUpload
                  onImageChange={setImageFile}
                  currentImageUrl={formData.image_url}
                  label="Course Image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Video URL</label>
                <Input name="video_url" value={formData.video_url} onChange={handleChange} placeholder="Video URL" />
              </div>
            </div>

            {/* Course Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (hours)</label>
                <Input
                  name="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Lectures</label>
                <Input
                  name="total_lectures"
                  type="number"
                  value={formData.total_lectures}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Course"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 w-full py-3 bg-transparent"
                onClick={() => router.back()}
              >
                Back
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
