import { Users } from "../../users/model/User"
import { Post, Posts } from "../model/Post"
import usePostState from "../state/usePostState"

export const useFetchPosts = () => {
  const {
    setLoading,
    limit,
    skip,
    setPosts,
    setTotal,
    setTags,
    searchQuery,
    newPost,
    setShowAddDialog,
    setNewPost,
    selectedPost,
    posts,
    setShowEditDialog,
    setSelectedPost,
    setShowPostDetailDialog,
  } = usePostState()

  //게시물 가져오기
  const fetchPosts = () => {
    setLoading(true)
    let postsData: Posts
    let usersData: Users[]

    fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      .then((response) => response.json())
      .then((data) => {
        postsData = data
        return fetch("/api/users?limit=0&select=username,image")
      })
      .then((response) => response.json())
      .then((users) => {
        usersData = users.users
        const postsWithUsers = postsData.posts.map((post) => ({
          ...post,
          author: usersData.find((user) => user.id === post.userId),
        }))
        setPosts({
          limit: postsData.limit,
          skip: postsData.skip,
          total: postsData.total,
          posts: postsWithUsers,
        })
        setTotal(postsData.total)
      })
      .catch((error) => {
        console.error("게시물 가져오기 오류:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`)
      const data = await response.json()
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  //게시물 추가
  const addPost = async () => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data = await response.json()
      setPosts((prev) => ({
        ...prev,
        posts: [data, ...prev.posts],
      }))
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePost = async () => {
    try {
      const response = await fetch(`/api/posts/${selectedPost?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      })
      const data = await response.json()
      const updatePosts = posts.posts.map((post) => (post.id === data.id ? data : post))
      setPosts((prev) => ({
        ...prev,
        posts: updatePosts,
      }))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      const updatePosts = posts.posts.filter((post) => post.id !== id)
      setPosts((prev) => ({
        ...prev,
        posts: updatePosts,
      }))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 게시물 상세 보기 이거는 여기 말고 컴포넌트에서 직접 사용으로 바꿀 예정 일단 둔 거
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    //fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  return { fetchPosts, fetchTags, searchPosts, addPost, updatePost, deletePost, openPostDetail }
}
