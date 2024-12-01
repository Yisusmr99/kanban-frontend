import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import CommentTimeline from './CommentTimeline';
import { ApiService } from '@/services/api';

type Comment = {
  id: number;
  content: string;
  created_at: string;
  user: { id: number; username: string };
};

type TaskDetailsModalProps = {
  task: { id: string; title: string; description?: string };
  onClose: () => void;
};

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await ApiService.getComments(parseInt(task.id));
        setComments(response);
      } catch (error) {
        console.log('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [task.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Swal.fire('Error', 'Comment cannot be empty', 'error');
      return;
    }

    try {
      const data = { content: newComment };
      const response =  await ApiService.addComment(parseInt(task.id), data);
      
      setComments((prev) => [...prev, response]);
      setNewComment('');
      Swal.fire('Success', 'Comment added successfully!', 'success');
      
    } catch (error) {
      Swal.fire('Error', 'An error occurred while adding the comment', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">{task.title}</h2>
        <p className="mb-4 text-gray-600">{task.description || 'No description provided'}</p>

        <h3 className="text-md font-semibold mb-2">Comments</h3>
        <div className="h-48 overflow-y-scroll border border-gray-200 rounded-md p-2 mb-4">
          <CommentTimeline comments={comments} />
        </div>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded-md mb-2"
        ></textarea>
        <button
          onClick={handleAddComment}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400"
        >
          Add Comment
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-300 text-gray-700 py-2 mt-2 rounded-md hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsModal;