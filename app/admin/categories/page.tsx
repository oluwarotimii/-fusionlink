"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Plus, ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RhythmicLoading from "@/components/RhythmicLoading";

interface Category {
  id: number;
  name: string;
  created_at: string;
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      setError("An error occurred while fetching categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        setNewCategoryName("");
        setShowCreateDialog(false);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create category");
      }
    } catch (err) {
      setError("An error occurred while creating category");
      console.error("Error creating category:", err);
    } finally {
      setCreating(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (response.ok) {
        setCategories(categories.filter(category => category.id !== id));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete category");
      }
    } catch (err) {
      setError("An error occurred while deleting category");
      console.error("Error deleting category:", err);
    }
  };

  if (loading) {
    return <RhythmicLoading />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 hover:bg-slate-100 rounded">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Manage Categories</h1>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <Card className="p-6">
          {categories.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600 mb-4">No categories found</p>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Create First Category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 sm:px-6 sm:py-4">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 sm:px-6 sm:py-4">Created</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900 sm:px-6 sm:py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-900 font-medium sm:px-6 sm:py-4">{category.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 sm:px-6 sm:py-4">
                        {new Date(category.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center sm:px-6 sm:py-4">
                        <div className="flex justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded sm:p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
    </div>
  );
}