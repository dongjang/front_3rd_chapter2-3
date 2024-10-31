import { NewPost, SelectedPost } from "../model/Post"

const fetchPosts = async (limit: number, skip: number) => {
  const [postsResponse, usersResponse] = await Promise.all([
    fetch(`/api/posts?limit=${limit}&skip=${skip}`),
    fetch("/api/users?limit=0&select=username,image"),
  ])

  const postsSearchData = await postsResponse.json()
  const usersSearchData = await usersResponse.json()
  return { postsSearchData, usersSearchData }
}

const fetchTags = async () => {
  const response = await fetch("/api/posts/tags")
  const data = await response.json()
  return data
}

const fetchPostsByTag = async (tag: string) => {
  const [postsResponse, usersResponse] = await Promise.all([
    fetch(`/api/posts/tag/${tag}`),
    fetch("/api/users?limit=0&select=username,image"),
  ])
  const postsByTagData = await postsResponse.json()
  const usersByTagData = await usersResponse.json()
  return { postsByTagData, usersByTagData }
}

const fetchSearchPosts = async () => {
  const response = await fetch("/api/posts/search?q=${searchQuery}")
  return await response.json()
}

const addPost = async (newPost: NewPost) => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  return await response.json()
}

const updatePost = async (selectedPost: SelectedPost) => {
  const response = await fetch(`/api/posts/${selectedPost?.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(selectedPost),
  })
  return await response.json()
}

const deletePost = async (id: number) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
  return await response.json()
}

export { fetchPosts, fetchTags, fetchPostsByTag, fetchSearchPosts, addPost, updatePost, deletePost }
