import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Smile, BarChart2 } from 'lucide-react';

const Home = () => {
  // Mock Data for the feed
  const posts = [
    {
      id: 1,
      user: "Alex Rivera",
      handle: "@arivera",
      time: "2h",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      content: "Just shipped the new dark mode update. It's not just about inverting colors; it's about managing contrast ratios and elevation. 🌙✨ #DesignSystem #UX",
      likes: 124,
      comments: 18,
      shares: 12
    },
    {
      id: 2,
      user: "Sarah Chen",
      handle: "@schen_dev",
      time: "4h",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      content: "Clean code is not just about functionality, it's about readability. If you can't read it like a sentence, rewrite it.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
      likes: 856,
      comments: 42,
      shares: 89
    },
    {
      id: 3,
      user: "Jordan Lee",
      handle: "@jlee_arch",
      time: "6h",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
      content: "Minimalism isn't about having less. It's about making room for more of what matters.",
      likes: 2.150,
      comments: 140,
      shares: 320
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      
      {/* Top Navigation Bar */}
      {/* Sticky, blurred backdrop for premium feel */}
      <nav className="sticky top-0 z-50 border-b border-neutral-900 bg-black/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight"><img className='h-18'  src="/logo-dark.png" alt="" /></div>
          <div className="flex gap-4 text-sm font-medium text-neutral-400">
            <button className="text-white hover:text-white transition-colors">For You</button>
            <button className="hover:text-white transition-colors">Following</button>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-800" /> {/* Placeholder for User Profile */}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto pt-4 pb-20 px-0 sm:px-4">
        
        {/* Create Post Card */}
        <div className="mb-6 px-4 py-4 sm:rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors duration-200">
          <div className="flex gap-4">
            <img 
              src="https://i.pravatar.cc/150?u=myprofile" 
              alt="My Avatar" 
              className="w-10 h-10 rounded-full object-cover border border-neutral-800"
            />
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="What's on your mind?" 
                className="w-full bg-transparent text-lg placeholder-neutral-500 focus:outline-none text-white mb-4"
              />
              <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                <div className="flex gap-4 text-neutral-500">
                  <button className="hover:text-blue-400 transition-colors"><Image size={18} /></button>
                  <button className="hover:text-blue-400 transition-colors"><BarChart2 size={18} /></button>
                  <button className="hover:text-blue-400 transition-colors"><Smile size={18} /></button>
                </div>
                <button className="px-4 py-1.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-neutral-200 transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Stream */}
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="px-4 py-4 sm:rounded-xl bg-neutral-900/30 border border-neutral-800/60 hover:bg-neutral-900/50 transition-colors cursor-pointer"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img 
                    src={post.avatar} 
                    alt={post.user} 
                    className="w-10 h-10 rounded-full object-cover border border-neutral-800"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-semibold text-white truncate">{post.user}</span>
                      <span className="text-neutral-500 text-sm truncate">{post.handle}</span>
                      <span className="text-neutral-600 text-[10px]">•</span>
                      <span className="text-neutral-500 text-sm">{post.time}</span>
                    </div>
                    <button className="text-neutral-500 hover:text-white transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  {/* Body Text */}
                  <p className="text-neutral-200 text-[15px] leading-relaxed mb-3 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Optional Image Attachment */}
                  {post.image && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-neutral-800">
                      <img src={post.image} alt="Post content" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between text-neutral-500 max-w-md mt-2">
                    <button className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
                      <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
                        <MessageCircle size={18} />
                      </div>
                      <span className="text-xs">{post.comments}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 group hover:text-green-400 transition-colors">
                      <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
                        <Share2 size={18} />
                      </div>
                      <span className="text-xs">{post.shares}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 group hover:text-pink-500 transition-colors">
                      <div className="p-1.5 rounded-full group-hover:bg-pink-500/10 transition-colors">
                        <Heart size={18} />
                      </div>
                      <span className="text-xs">{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
                      <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
                        <BarChart2 size={18} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Loading / End of Feed Indicator */}
        <div className="py-8 text-center text-neutral-600 text-sm">
          You're all caught up
        </div>

      </main>
    </div>
  );
};

export default Home;