"use client"
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types_db';

type Lesson = Database['public']['Tables']['lessons']['Row'];
type Section = Database['public']['Tables']['sections']['Row'];

export default function AdminLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({ title: '', content: '', video_url: '', order_index: 0, section_id: '' });
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkAdminStatus();
    fetchSections();
    fetchLessons();
  }, []);

  async function checkAdminStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();
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

  async function fetchLessons() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index');
    if (data) {
      setLessons(data);
    } else if (error) {
      console.error('Error fetching lessons:', error);
    }
  }

  async function createLesson() {
    if (!newLesson.title || !newLesson.section_id || newLesson.order_index === undefined) {
      console.error('Invalid lesson data');
      return;
    }
  
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        title: newLesson.title,
        content: newLesson.content ?? null,
        video_url: newLesson.video_url ?? null,
        order_index: newLesson.order_index,
        section_id: newLesson.section_id
      })
      .select();
    
    if (error) {
      console.error('Error creating lesson:', error);
    } else if (data) {
      setLessons([...lessons, data[0]]);
      setNewLesson({ title: '', content: '', video_url: '', order_index: 0, section_id: '' });
    }
  }

  async function updateLesson() {
    if (!editingLesson) return;
    const { data, error } = await supabase
      .from('lessons')
      .update(editingLesson)
      .eq('id', editingLesson.id)
      .select();
    if (data) {
      setLessons(lessons.map(l => l.id === editingLesson.id ? data[0] : l));
      setEditingLesson(null);
    } else if (error) {
      console.error('Error updating lesson:', error);
    }
  }

  async function deleteLesson(id: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    if (!error) {
      setLessons(lessons.filter(l => l.id !== id));
    } else {
      console.error('Error deleting lesson:', error);
    }
  }

  if (!isAdmin) {
    return <div className="p-4">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Lessons</h1>

      {/* Create new lesson form */}
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Create New Lesson</h2>
        <input
          type="text"
          placeholder="Title"
          value={newLesson.title}
          onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Content"
          value={newLesson.content || ''}
          onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Video URL"
          value={newLesson.video_url || ''}
          onChange={(e) => setNewLesson({...newLesson, video_url: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          placeholder="Order Index"
          value={newLesson.order_index || ''}
          onChange={(e) => setNewLesson({...newLesson, order_index: e.target.value ? parseInt(e.target.value) : 0})}
          className="w-full p-2 mb-2 border rounded"
        />
                <select
          value={newLesson.section_id || ''}
          onChange={(e) => setNewLesson({...newLesson, section_id: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select a section</option>
          {sections.map(section => (
            <option key={section.id} value={section.id}>{section.title}</option>
          ))}
        </select>
        <button onClick={createLesson} className="bg-blue-500 text-white p-2 rounded">Create Lesson</button>
      </div>

      {/* List of lessons */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Lessons</h2>
        {lessons.map(lesson => (
          <div key={lesson.id} className="mb-4 p-4 bg-gray-100 rounded">
            {editingLesson && editingLesson.id === lesson.id ? (
              <>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  value={editingLesson.content || ''}
                  onChange={(e) => setEditingLesson({...editingLesson, content: e.target.value})}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  value={editingLesson.video_url || ''}
                  onChange={(e) => setEditingLesson({...editingLesson, video_url: e.target.value})}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="number"
                  value={editingLesson.order_index}
                  onChange={(e) => setEditingLesson({...editingLesson, order_index: parseInt(e.target.value)})}
                  className="w-full p-2 mb-2 border rounded"
                />
                                <select
                  value={editingLesson.section_id!}
                  onChange={(e) => setEditingLesson({...editingLesson, section_id: e.target.value})}
                  className="w-full p-2 mb-2 border rounded"
                >
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>{section.title}</option>
                  ))}
                </select>
                <button onClick={updateLesson} className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
                <button onClick={() => setEditingLesson(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
                <p>{lesson.content}</p>
                <p>Video URL: {lesson.video_url}</p>
                <p>Order: {lesson.order_index}</p>
                <p>Section: {sections.find(s => s.id === lesson.section_id)?.title}</p>
                <button onClick={() => setEditingLesson(lesson)} className="bg-yellow-500 text-white p-2 rounded mr-2 mt-2">Edit</button>
                <button onClick={() => deleteLesson(lesson.id)} className="bg-red-500 text-white p-2 rounded mt-2">Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}