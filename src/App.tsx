import { useCallback, useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchImage = useCallback(async () => {
    setLoading(true);

    const data = await fetch(`http://127.0.0.1:5000/search?q=${query}&page=${page}`).then(re => re.json());
    setImages(data.data);
    setTotalCount(data.pagination.total_count);

    setLoading(false);
  }, [query, page]);

  const debounced = useDebouncedCallback(async (value) => {
    setQuery(value);
    setPage(1);
  }, 1000);

  useEffect(() => {
    fetchImage();
  }, [query, page, fetchImage]);

  return (
    <div className='w-96 mx-auto flex flex-col'>
      <input
        onChange={(e) => debounced(e.currentTarget.value)}
        placeholder="search..."
        className='mt-5 outline'
      />
      {loading ? (
        <span>Loading...</span>
      ) : images.map((image, index) =>
        <img
          src={image}
          alt={"image" + index}
          className="mt-5"
        />
      )}
      <div className='flex mx-auto mt-5'>
        <button
          className='mr-2'
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
        >
          prev
        </button>
        <input
          type="number"
          className="w-10 text-center"
          value={page}
          onChange={(e) => setPage(parseInt(e.currentTarget.value || "1"))}
        />
        <button
          className='ml-2'
          onClick={() => setPage(p => p + 1)}
          disabled={page === Math.ceil(totalCount / 10)}
        >
          next
        </button>
      </div>
    </div>
  );
}

export default App;
