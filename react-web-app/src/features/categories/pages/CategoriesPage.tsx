import { useState, useMemo } from 'react';
import { useAuth } from '@/app/providers';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import type { Category } from '../api/category.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Tag, Search, CheckCircle2, XCircle, Sparkles, Filter, Palette, FileText, MoreVertical } from 'lucide-react';

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

const Categories = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#6366f1',
    isActive: true,
  });

  const canManage = role === 'admin' || role === 'educator';

  // Fetch categories from API
  const { data: categoriesResponse, isLoading, error } = useCategories({
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const categories = categoriesResponse?.data || [];

  // Filter categories by search term (status is already filtered by API)
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter((category) => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#6366f1', isActive: true });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ 
        id: editingCategory._id || editingCategory.id, 
        data: {
          name: formData.name,
          description: formData.description,
          color: formData.color,
          isActive: formData.isActive,
        }
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        description: formData.description,
        color: formData.color,
        isActive: formData.isActive,
      });
    }
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load categories</p>
          <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Categories</h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Organize courses and training programs with categories
          </p>
        </div>
        {canManage && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {editingCategory ? (
                      <Pencil className="h-5 w-5 text-primary" />
                    ) : (
                      <Plus className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Category Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Technology, Leadership"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what this category represents..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Category Color
                  </Label>
                  <div className="flex gap-3 items-center">
                    <div className="relative">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-16 p-1 cursor-pointer rounded-lg border-2 border-border"
                    />
                    <div 
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{ 
                        backgroundColor: formData.color,
                        opacity: 0.1 
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#6366f1"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose a color to represent this category
                    </p>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-border flex items-center justify-center"
                    style={{ backgroundColor: formData.color }}
                  >
                    <Tag className="h-6 w-6" style={{ color: formData.color === '#ffffff' || formData.color === '#fefce8' ? '#000' : '#fff' }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">
                    Category Status
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {formData.isActive ? 'Category is active and visible' : 'Category is inactive and hidden'}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    size="lg"
                  >
                    {editingCategory ? (
                      <>
                        <Pencil className="mr-2 h-4 w-4" />
                        Update Category
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Category
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} size="lg">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filter Section */}
      {canManage && (
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            {(searchTerm || statusFilter !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchTerm}
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <button 
                      onClick={() => setStatusFilter('all')} 
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCategories.map((category) => {
          const categoryId = category._id || category.id;
          return (
            <Card 
              key={categoryId} 
              className="group hover:border-primary/50 hover:shadow-xl transition-all duration-300 border-2 overflow-hidden"
            >
              <div 
                className="h-24 relative flex items-center justify-center overflow-hidden"
                style={{ 
                  backgroundColor: category.color,
                  background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`
                }}
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm bg-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300"
                >
                  <Tag className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                {!category.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge variant="secondary" className="shadow-lg">Inactive</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="bg-gradient-to-b from-card to-muted/30 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <Badge 
                      variant={category.isActive ? 'default' : 'secondary'} 
                      className="mt-2 gap-1"
                    >
                      {category.isActive ? (
                        <><CheckCircle2 className="h-3 w-3" /> Active</>
                      ) : (
                        <><XCircle className="h-3 w-3" /> Inactive</>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[3.75rem]">
                  {category.description || (
                    <span className="italic text-muted-foreground/70">No description provided</span>
                  )}
                </p>
                {canManage && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-4 w-4 mr-1.5" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Category
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"? This action cannot be undone and may affect courses using this category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(categoryId)}
                                disabled={deleteMutation.isPending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCategories.length === 0 && categories.length > 0 && (
        <Card className="py-16 border-dashed">
          <CardContent className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No categories found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No categories match your search criteria. Try adjusting your filters.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 && (
        <Card className="py-16 border-dashed">
          <CardContent className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No categories yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Create your first category to organize courses and training programs. Categories help learners find relevant content.
              </p>
            </div>
            {canManage && (
              <Button onClick={() => setIsDialogOpen(true)} size="lg" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Category
              </Button>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default Categories;