import React from 'react';

type Comment = {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
};

type CommentTimelineProps = {
  comments: Comment[];
};

function timeAgo(date: string) {
  const now = new Date();
  const commentDate = new Date(date);
  const differenceInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} seconds ago`;
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} minutes ago`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) {
    return `${differenceInHours} hours ago`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  return `${differenceInDays} days ago`;
}

const CommentTimeline: React.FC<CommentTimelineProps> = ({ comments }) => {
  return (
    <div className="flow-root">
      <ul role="list" className="relative space-y-6">
        {comments.map((comment, index) => (
          <li key={comment.id} className="relative flex items-start gap-x-4">
            {/* Línea del timeline */}
            <div
              className={`absolute left-4 top-0 w-px bg-gray-300 ${
                index !== comments.length - 1 ? 'h-full' : 'h-6'
              }`}
            ></div>
            {/* Círculo del timeline */}
            <div className="relative flex-none">
              <div className="h-2.5 w-2.5 rounded-full bg-gray-400 ring-2 ring-white transform -translate-x-1"></div>
            </div>
            {/* Contenido del comentario */}
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{comment.user.username}: </span> {comment.content}
              </p>
              <time className="text-xs text-gray-500">{timeAgo(comment.created_at)}</time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentTimeline;