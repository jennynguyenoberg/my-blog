import Link from 'next/link';
import styles from './blog.module.css';
import Heading from '@components/heading';

import useSWR from 'swr';
import { getPosts, postsCacheKey } from '../../api-routes/posts';
import { useState } from 'react';

export default function Blog() {
  const { data, error } = useSWR(postsCacheKey, getPosts);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const { data: postData = [] } = data;

  const filteredData = postData
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, showAll ? postData.length : 6);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <section>
      <Heading>All Articles</Heading>
      <input
        type="text"
        placeholder="Search by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredData.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        filteredData.map((post) => (
          <Link
            key={post.slug}
            className={styles.link}
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col">
              <p>{post.title}</p>
              <time className={styles.date}>{post.created_at}</time>
            </div>
          </Link>
        ))
      )}
      {postData.length > 6 && (
        <button onClick={toggleShowAll} className={styles.seeMore}>
          {showAll ? 'Show Less' : 'See More'}
        </button>
      )}
    </section>
  );
}