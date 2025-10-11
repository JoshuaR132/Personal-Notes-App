export default function Header() {
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
      <h1 className="text-xl font-bold">📝 Personal Notes</h1>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </header>
  );
}
