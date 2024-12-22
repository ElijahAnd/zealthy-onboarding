import React, { useEffect, useState } from 'react';

type User = {
  address: string;
  birthdate: string;
  about: string;
};

const UserDataTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          'https://3231-2600-1f18-6672-f200-fda1-558d-29f8-b46d.ngrok-free.app/api/userData',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Error fetching user data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: 'auto' }}>
      <h1>User Data</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && users.length === 0 && <p>No user data found.</p>}
      {!loading && !error && users.length > 0 && (
        <table
          style={{
            width: '100%',
            marginTop: '20px',
            borderCollapse: 'collapse',
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #ddd',
                  backgroundColor: '#f3f4f6',
                }}
              >
                Address
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #ddd',
                  backgroundColor: '#f3f4f6',
                }}
              >
                Date of Birth
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #ddd',
                  backgroundColor: '#f3f4f6',
                }}
              >
                About
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  {user.address}
                </td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  {user.birthdate}
                </td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  {user.about}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDataTable;
