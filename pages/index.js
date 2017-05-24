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
  console.log('WAS RES OK?', res.ok);
  if (res.ok) {
    data = await res.json()
    console.log(JSON.stringify(data, null, 3))
    console.log(`Github Index page fetched data fetched. Count: ${data.length}`)
  }

  return {
    users: data
  }
}

export default Index
