import Layout from '../components/Layout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

const Index = (props) => (
  <Layout>
    <h1>Github Users</h1>
    <ul>
      {props.users.map((user) => (
        <li key={user.login}>
          <Link as={`/u/${user.login}`} href={`/user?id=${user.login}`}>
            <a>{user.login}</a>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
)

Index.getInitialProps = async function() {
  const res = await fetch('https://api.github.com/users')

  let data = [];
  if (res.ok) {
    data = await res.json()
  }

  return {
    users: data
  }
}

export default Index
