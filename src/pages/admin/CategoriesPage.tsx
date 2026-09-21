import { useState } from 'react';
import { Edit, Plus, Trash2, X, Image as ImageIcon, Package } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { ImageUploader } from '../../components/ImageUploader';
import type { Category } from '../../types';

function createCategory(): Category {
  return {
    id: 'category-' + Date.now().toString(36),
    name: '',
    nameAr: '',
    nameFr: '',
    icon: 'C',
    image: '',
  };
}

export default function CategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useProducts();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Category>(createCategory());

  const openCreate = () => {
    setEditing(null);
    setForm(createCategory());
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm(category);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setForm(createCategory());
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = form.id.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, '-');
    const clean: Category = {
      ...form,
      id,
      name: form.name.trim(),
      nameAr: form.nameAr.trim(),
      nameFr: form.nameFr.trim(),
      icon: form.icon.trim().slice(0, 2) || 'C',
    };

    if (!clean.id || !clean.name) {
      alert('Category name is required.');
      return;
    }

    const exists = categories.some(
      (c) => c.id === clean.id && c.id !== editing?.id
    );

    if (exists) {
      alert('A category with this ID already exists.');
      return;
    }

    if (editing) {
      updateCategory(editing.id, clean);
    } else {
      addCategory(clean);
    }
    closeForm();
  };

  const remove = (category: Category) => {
    const count = products.filter((p) => p.categoryId === category.id).length;
    if (count > 0) {
      alert('Cannot delete "' + category.name + '" because ' + count + ' product(s) still use it.');
      return;
    }
    if (!confirm('Delete category "' + category.name + '"?')) return;
    deleteCategory(category.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-white/50 text-sm mt-1">Manage the categories used by your menu.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl bg-flame-gradient text-white font-semibold shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((category) => {
          const count = products.filter((p) => p.categoryId === category.id).length;
          return (
            <div key={category.id} className="rounded-3xl bg-charcoal-900/60 border border-white/5 overflow-hidden">
              <div className="relative aspect-[16/8] bg-charcoal-950">
                {category.image ? (
                  <img src={category.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white/15" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent" />
                <span className="absolute left-4 bottom-3 w-9 h-9 rounded-xl bg-flame-gradient flex items-center justify-center font-bold">
                  {category.icon || category.name.slice(0, 1)}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold truncate">{category.name}</h2>
                    <p className="text-xs text-white/40 mt-1 truncate">
                      {(category.nameFr || category.name) + ' . ' + (category.nameAr || category.name)}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-xs text-white/50">
                    <Package className="w-3 h-3" />
                    {count}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEdit(category)}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-white/5 text-sm text-white/70 hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => remove(category)}
                    className="w-10 h-10 rounded-xl bg-white/5 text-crimson-400 hover:bg-crimson-500/10 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-10 text-center">
          <p className="font-medium">No categories yet.</p>
          <p className="text-sm text-white/40 mt-1">Create your first menu category.</p>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
          <div className="w-full max-w-lg bg-charcoal-900 rounded-3xl border border-white/10 my-8">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="font-bold">{editing ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-4">
              <ImageUploader value={form.image} onChange={(v) => setForm((c) => ({ ...c, image: v }))} />

              <div>
                <label className="block text-sm mb-2">Category Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                  required
                  placeholder="e.g. Burgers"
                  className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-2">French Name</label>
                  <input
                    value={form.nameFr}
                    onChange={(e) => setForm((c) => ({ ...c, nameFr: e.target.value }))}
                    placeholder="Burgers"
                    className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Arabic Name</label>
                  <input
                    value={form.nameAr}
                    onChange={(e) => setForm((c) => ({ ...c, nameAr: e.target.value }))}
                    placeholder="Burgers AR"
                    className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-2">ID</label>
                  <input
                    value={form.id}
                    disabled={Boolean(editing)}
                    onChange={(e) => setForm((c) => ({ ...c, id: e.target.value }))}
                    placeholder="burgers"
                    className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Icon</label>
                  <input
                    value={form.icon}
                    maxLength={2}
                    onChange={(e) => setForm((c) => ({ ...c, icon: e.target.value }))}
                    placeholder="B"
                    className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 rounded-2xl bg-flame-gradient text-white font-semibold"
                >
                  {editing ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}	

