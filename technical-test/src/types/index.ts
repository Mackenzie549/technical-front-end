export type Post = {
    id: number;
    name: string;
    image: string;
    instructions: string[];
  };

export interface PostItemProps {
    post: Post;
    onClick: (post: Post) => void;
    isHighlighted: Boolean;
}
