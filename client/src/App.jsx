import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const query = gql`
  query GetAllTodos {
      getTodos {
      id
        title
        user {
          name
        }
      },
    }
  `;

function App() {
  const { loading, error, data } = useQuery(query);

  if (loading) return <p>Loading...</p>
  if (error) return <p>error</p>

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Todo Title</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {data?.getTodos.length > 0 && data.getTodos.map(todo => <tr key={todo?.id}>
            <td>{todo?.title}</td>
            <td>{todo?.user?.name}</td>
          </tr>)}
        </tbody>
      </table>
    </>
  )
}

export default App
