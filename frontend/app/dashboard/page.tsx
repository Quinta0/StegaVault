import PasswordEntry from '../../components/PasswordEntry'

export default function Dashboard() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Password</h2>
          <PasswordEntry />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Passwords</h2>
          {/* Add a list or grid of saved passwords here */}
        </div>
      </div>
    </div>
  )
}