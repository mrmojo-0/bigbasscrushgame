import { useState, useEffect } from 'preact/hooks';

interface Comment {
  id: number;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  rating: number | null;
  createdAt: number;
  parentId: number | null;
}

interface Props {
  pageSlug: string;
  lang: string;
  title: string;
  loadMoreText: string;
  noCommentsText: string;
}

export default function CommentSection({ pageSlug, lang, title, loadMoreText, noCommentsText }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = async (pageNum: number) => {
    try {
      const res = await fetch(`/api/comments?page_slug=${pageSlug}&lang=${lang}&page=${pageNum}&limit=10`);
      if (!res.ok) return;
      const data = await res.json();
      if (pageNum === 1) {
        setComments(data.comments || []);
      } else {
        setComments(prev => [...prev, ...(data.comments || [])]);
      }
      setHasMore(data.hasMore || false);
    } catch (e) {
      console.error('Failed to load comments:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [pageSlug, lang]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
  };

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleDateString(lang, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return new Date(timestamp).toLocaleDateString('en');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} class={i < rating ? 'text-yellow-400' : 'text-gray-700'}>
        ★
      </span>
    ));
  };

  return (
    <section class="py-8" id="comments">
      <h2 class="text-2xl font-bold text-white mb-6">{title}</h2>

      {loading ? (
        <div class="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} class="animate-pulse bg-ocean-800/50 rounded-xl p-5">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-ocean-700" />
                <div class="h-4 w-24 bg-ocean-700 rounded" />
              </div>
              <div class="h-3 w-full bg-ocean-700 rounded mb-2" />
              <div class="h-3 w-3/4 bg-ocean-700 rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p class="text-gray-400 text-center py-8">{noCommentsText}</p>
      ) : (
        <div class="space-y-4">
          {comments.map(comment => (
            <div
              key={comment.id}
              class="bg-ocean-800/30 border border-ocean-600/20 rounded-xl p-5 hover:border-ocean-600/40 transition-colors"
            >
              <div class="flex items-start gap-3">
                {/* Avatar */}
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-ocean-700 border border-ocean-600/30 flex items-center justify-center overflow-hidden">
                  {comment.authorAvatar ? (
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span class="text-sm font-bold text-accent-400">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div class="flex-1 min-w-0">
                  {/* Header */}
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-semibold text-white">{comment.authorName}</span>
                    <span class="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>

                  {/* Rating */}
                  {comment.rating && (
                    <div class="flex items-center gap-0.5 mb-2 text-sm">
                      {renderStars(comment.rating)}
                    </div>
                  )}

                  {/* Content */}
                  <p class="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Load more */}
          {hasMore && (
            <div class="text-center pt-4">
              <button
                onClick={loadMore}
                class="px-6 py-2.5 bg-ocean-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-ocean-600 hover:text-white transition-colors border border-ocean-600/30"
              >
                {loadMoreText}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
