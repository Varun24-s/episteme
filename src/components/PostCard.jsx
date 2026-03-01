import Link from "next/link";
export default function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <img src={post.cover_image} className="w-full aspect-video object-cover rounded-2xl mb-4" />
      <h2 className="text-xl font-bold group-hover:text-blue-600">{post.title}</h2>
      <p className="text-sm text-gray-500">by {post.profiles?.username}</p>
    </Link>
  );
}