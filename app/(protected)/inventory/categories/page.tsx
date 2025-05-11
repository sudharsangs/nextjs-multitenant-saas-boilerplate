"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  FileDown,
  FolderTree,
  ChevronRight,
  FolderOpen,
  Folder
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  productCount: number;
  hasChildren: boolean;
  companyId: string;
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const companyId = localStorage.getItem('companyId'); // We'll need to handle this properly
        const response = await api.get<Category[]>(`/categories?companyId=${companyId}`);
        
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          setError(response.error || 'Failed to load categories');
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading categories</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

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

      <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
        <div className="flex items-center mb-4">
          <FolderTree size={20} className="mr-2" />
          <h3 className="text-lg font-medium">Category Tree</h3>
        </div>
        
        {renderCategoryTree(topLevelCategories)}
      </div>
    </div>
  );
}