import Link from "next/link";

function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/admin/users">Users</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
