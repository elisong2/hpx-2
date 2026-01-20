import Link from "next/link";

export type BuildCardProps = {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  username: string;
};

export default function BuildCard({
  id,
  title,
  description,
  coverImageUrl,
  username,
}: BuildCardProps) {
  return (
    <Link href={`/posts/${id}`}>
      <article>
        {coverImageUrl && <img src={coverImageUrl} alt={title} />}

        <h3>{title}</h3>

        {description && <p>{description}</p>}

        <span>by {username}</span>
      </article>
    </Link>
  );
}
