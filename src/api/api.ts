export const fetchPosts = async (page: number) => {
  try {
    const response = await fetch(`https://dummyjson.com/recipes?limit=10&skip=${(page - 1) * 10}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};