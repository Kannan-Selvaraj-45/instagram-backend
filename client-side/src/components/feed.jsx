import { useState, useEffect } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Home,
  Search,
  PlusSquare,
  User,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const userData = location.state?.user;
        console.log(userData);
        const token = userData?.accessToken;

        if (!token) {
          throw new Error("No access token available");
        }

        const response = await axios.get("http://localhost:4000/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          throw new Error("Unexpected data structure from the server");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message || "An error occurred while fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.state?.user]);

  const handleLike = async (postId) => {
    try {
      const userData = location.state?.user;
      const token = userData?.accessToken;

      if (!token) {
        throw new Error("No access token available");
      }

      await axios.post(
        `http://localhost:4000/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: [
                  ...post.likes,
                  { id: Date.now(), post_id: postId, user_id: userData.id },
                ],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white border-b border-gray-300 fixed top-0 w-full z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
          <h1 className="text-2xl font-bold">Instagram</h1>
          <div className="flex space-x-4">
            <button>
              <Home className="h-6 w-6" />
            </button>
            <button>
              <Search className="h-6 w-6" />
            </button>
            <button>
              <PlusSquare className="h-6 w-6" />
            </button>
            <button>
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-14 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 overflow-x-auto">
            <div className="flex space-x-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-1">
                  <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-pink-500 rounded-full p-0.5">
                    <img
                      src={`/placeholder.svg?height=60&width=60&text=User${
                        i + 1
                      }`}
                      alt={`User ${i + 1}`}
                      className="w-full h-full object-cover rounded-full border-2 border-white"
                    />
                  </div>
                  <span className="text-xs">User {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-300 rounded-lg mb-4"
            >
              <div className="flex items-center p-4">
                <img
                  src={
                    post.author?.profile_picture ||
                    `/placeholder.svg?height=32&width=32&text=${
                      post.author?.username || "User"
                    }`
                  }
                  alt={post.author?.username || "User"}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-semibold">
                  {post.author?.username || "Unknown User"}
                </span>
              </div>

              <img
                src={post.img_url || "/placeholder.svg"}
                alt="Post content"
                className="w-full"
              />

              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex space-x-4">
                    <button onClick={() => handleLike(post.id)}>
                      <Heart
                        className={`h-6 w-6 ${
                          post.likes?.some(
                            (like) => like.user_id === location.state?.user?.id
                          )
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </button>
                    <button>
                      <MessageCircle className="h-6 w-6" />
                    </button>
                    <button>
                      <Send className="h-6 w-6" />
                    </button>
                  </div>
                  <button>
                    <Bookmark className="h-6 w-6" />
                  </button>
                </div>
                <p className="font-semibold">{post.likes?.length || 0} likes</p>
                <p>
                  <span className="font-semibold">
                    {post.author?.username || "Unknown User"}
                  </span>{" "}
                  {post.caption}
                </p>
                <p className="text-gray-500">
                  View all {post.comments?.length || 0} comments
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <nav className="bg-white border-t border-gray-300 fixed bottom-0 w-full md:hidden">
        <div className="flex justify-around items-center h-14">
          <button>
            <Home className="h-6 w-6" />
          </button>
          <button>
            <Search className="h-6 w-6" />
          </button>
          <button>
            <PlusSquare className="h-6 w-6" />
          </button>
          <button>
            <Heart className="h-6 w-6" />
          </button>
          <button>
            <User className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default InstagramFeed;
