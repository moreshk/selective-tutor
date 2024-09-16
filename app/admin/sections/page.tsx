"use client"
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types_db';
import { BlobServiceClient } from '@azure/storage-blob';

// type Section = Database['public']['Tables']['sections']['Row'];

type Section = Database['public']['Tables']['sections']['Row'] & { image_url?: string };



export default function AdminSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSection, setNewSection] = useState({ title: '', description: '', order_index: 0 });
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const supabase = createClient();

  useEffect(() => {
    checkAdminStatus();
    fetchSections();
  }, []);

  async function checkAdminStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user); // Debug log
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      console.log('User data:', data, 'Error:', error); // Debug log
      if (data && 'is_admin' in data) {
        setIsAdmin(data.is_admin as boolean);
      } else {
        console.error('is_admin not found in user data');
      }
    } else {
      console.error('No user found');
    }
  }

  async function fetchSections() {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('order_index');
    if (data) {
      setSections(data);
    } else if (error) {
      console.error('Error fetching sections:', error);
    }
  }

  async function uploadImageToAzure(file: File): Promise<string> {
    const blobServiceClient = new BlobServiceClient(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING!);
    const containerClient = blobServiceClient.getContainerClient(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME!);
    const blobName = `section-images/${Date.now()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    await blockBlobClient.uploadData(file);
    return blockBlobClient.url;
  }

  async function createSection() {
    if (!newSection.title || isNaN(newSection.order_index)) {
      console.error('Invalid section data');
      return;
    }
  
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await uploadImageToAzure(imageFile);
    }
  
    const { data, error } = await supabase
      .from('sections')
      .insert([{ ...newSection, image_url: imageUrl }])
      .select();
    
    if (error) {
      console.error('Error creating section:', error);
    } else if (data) {
      setSections([...sections, data[0]]);
      setNewSection({ title: '', description: '', order_index: 0 });
      setImageFile(null);
    }
  }

  async function updateSection() {
    if (!editingSection) return;

    let imageUrl = editingSection.image_url;
    if (imageFile) {
      imageUrl = await uploadImageToAzure(imageFile);
    }

    const { data, error } = await supabase
      .from('sections')
      .update({ ...editingSection, image_url: imageUrl })
      .eq('id', editingSection.id)
      .select();

    if (data) {
      setSections(sections.map(s => s.id === editingSection.id ? data[0] : s));
      setEditingSection(null);
      setImageFile(null);
    } else if (error) {
      console.error('Error updating section:', error);
    }
  }

  async function deleteSection(id: string) {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id);
    if (!error) {
      setSections(sections.filter(s => s.id !== id));
    } else {
      console.error('Error deleting section:', error);
    }
  }

  if (!isAdmin) {
    return <div className="p-4">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Sections</h1>

      {/* Create new section form */}
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Create New Section</h2>
        <input
          type="text"
          placeholder="Title"
          value={newSection.title}
          onChange={(e) => setNewSection({...newSection, title: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={newSection.description || ''}
          onChange={(e) => setNewSection({...newSection, description: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
  type="number"
  placeholder="Order Index"
  value={newSection.order_index || ''}
  onChange={(e) => setNewSection({...newSection, order_index: e.target.value ? parseInt(e.target.value) : 0})}
  className="w-full p-2 mb-2 border rounded"
/>
<input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button onClick={createSection} className="bg-blue-500 text-white p-2 rounded">Create Section</button>
      </div>

      {/* List of sections */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Sections</h2>
        {sections.map(section => (
          <div key={section.id} className="mb-4 p-4 bg-gray-100 rounded">
            {editingSection && editingSection.id === section.id ? (
              <>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({...editingSection, title: e.target.value})}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  value={editingSection.description || ''}
                  onChange={(e) => setEditingSection({...editingSection, description: e.target.value})}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="number"
                  value={editingSection.order_index}
                  onChange={(e) => setEditingSection({...editingSection, order_index: parseInt(e.target.value)})}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <button onClick={updateSection} className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
                <button onClick={() => setEditingSection(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p>{section.description}</p>
                <p>Order: {section.order_index}</p>
                {section.image_url && (
                  <img src={section.image_url} alt={section.title} className="mt-2 max-w-full h-auto" />
                )}
                <button onClick={() => setEditingSection(section)} className="bg-yellow-500 text-white p-2 rounded mr-2 mt-2">Edit</button>
                <button onClick={() => deleteSection(section.id)} className="bg-red-500 text-white p-2 rounded mt-2">Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}