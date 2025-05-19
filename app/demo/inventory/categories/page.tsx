"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  AlertCircle,
  FileDown,
  FolderTree,
  ChevronRight,
  FolderOpen,
  Folder
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  productCount: number;
  hasChildren: boolean;
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Dummy data for categories
  const [categories, setCategories] = useState<Category[]>([
    { 
      id: "1", 
      name: "Raw Materials", 
      description: "Basic materials used in manufacturing",
      parentId: null,
      productCount: 12,
      hasChildren: true
    },
    { 
      id: "2", 
      name: "Finished Products", 
      description: "Items ready for sale",
      parentId: null,
      productCount: 8,
      hasChildren: false
    },
    { 
      id: "3", 
      name: "Packaging", 
      description: "Materials used for packaging products",
      parentId: null,
      productCount: 5,
      hasChildren: true
    },
    { 
      id: "4", 
      name: "Steel Bolts", 
      description: "Various types of steel bolts",
      parentId: "1",
      productCount: 4,
      hasChildren: false
    },
    { 
      id: "5", 
      name: "Aluminum Sheets", 
      description: "Aluminum sheets of different sizes",
      parentId: "1",
      productCount: 3,
      hasChildren: false
    },
    { 
      id: "6", 
      name: "Copper Wires", 
      description: "Copper wires of various gauges",
      parentId: "1",
      productCount: 5,
      hasChildren: false
    },
    { 
      id: "7", 
      name: "Boxes", 
      description: "Cardboard boxes for shipping",
      parentId: "3",
      productCount: 3,
      hasChildren: false
    },
    { 
      id: "8", 
      name: "Bubble Wrap", 
      description: "Protective bubble wrap",
      parentId: "3",
      productCount: 1,
      hasChildren: false
    },
    { 
      id: "9", 
      name: "Tape", 
      description: "Various types of tapes",
      parentId: "3",
      productCount: 1,
      hasChildren: false
    },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  // Get top-level categories
  const topLevelCategories = categories.filter(category => !category.parentId);
  
  // Filter categories based on search term
  const filterCategories = (categories: Category[]) => {
    if (!searchTerm) return categories;
    
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get child categories for a parent
  const getChildCategories = (parentId: string) => {
    return categories.filter(category => category.parentId === parentId);
  };

  // Total product count for display
  const totalProducts = categories.reduce((sum, category) => {
    // Only count products in leaf categories to avoid double counting
    if (!categories.some(c => c.parentId === category.id)) {
      return sum + category.productCount;
    }
    return sum;
  }, 0);

  // Recursive component to render category tree
  const renderCategoryTree = (parentCategories: Category[], depth = 0) => {
    const filteredCategories = filterCategories(parentCategories);
    
    if (filteredCategories.length === 0) {
      return depth === 0 ? (
        <div className="text-muted-foreground text-center py-4">
          No categories match your search
        </div>
      ) : null;
    }
    
    return (
      <div className="space-y-1">
        {filteredCategories.map(category => {
          const childCategories = getChildCategories(category.id);
          const hasChildren = childCategories.length > 0;
          const isExpanded = expandedCategories.includes(category.id);
          
          return (
            <div key={category.id} className="space-y-1">
              <div className={`
                flex items-center justify-between p-3 rounded-md
                ${isExpanded ? 'bg-muted/60' : 'hover:bg-muted/40'}
                ${depth > 0 ? 'ml-6' : ''}
              `}>
                <div className="flex items-center gap-3 flex-1">
                  <button 
                    onClick={() => toggleCategory(category.id)} 
                    className={`p-1 rounded-md hover:bg-muted ${!hasChildren ? 'invisible' : ''}`}
                    disabled={!hasChildren}
                  >
                    <ChevronRight size={18} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                  
                  <div className="flex items-center">
                    {isExpanded ? <FolderOpen size={18} className="text-amber-500" /> : <Folder size={18} className="text-amber-500" />}
                  </div>
                  
                  <div className="flex-1">
                    <Link 
                      href={`/inventory/categories/${category.id}`}
                      className="font-medium hover:underline"
                    >
                      {category.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {category.productCount} products
                  </span>
                  
                  <div className="flex items-center">
                    <Link
                      href={`/inventory/categories/${category.id}/edit`}
                      className="text-sm text-muted-foreground hover:text-foreground mr-2"
                    >
                      Edit
                    </Link>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {isExpanded && hasChildren && renderCategoryTree(childCategories, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <div className="flex items-center gap-2">
          <Link 
            href="/inventory/categories/new" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Add Category
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search categories..."
            className="w-full rounded-md border border-input bg-background pl-8 p-2 text-sm shadow-sm outline-none focus:border-primary"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm">
            <FileDown size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <p className="text-sm font-medium text-muted-foreground">Top-Level Categories</p>
          <p className="text-2xl font-bold">{topLevelCategories.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <p className="text-sm font-medium text-muted-foreground">Total Products</p>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border flex flex-col items-center justify-center text-center h-64">
          <AlertCircle size={40} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No categories found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">Start by adding categories to organize your products.</p>
          <Link 
            href="/inventory/categories/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Category
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center mb-4">
            <FolderTree size={20} className="mr-2" />
            <h3 className="text-lg font-medium">Category Tree</h3>
          </div>
          
          {renderCategoryTree(topLevelCategories)}
        </div>
      )}
    </div>
  );
}