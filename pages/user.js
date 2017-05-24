import Layout from '../components/Layout.js'
import fetch from 'isomorphic-unfetch'

const User =  (props) => (
    <Layout>
       <h1>{props.user.login}</h1>
       <p>{props.user.bio}</p>
       <img src={props.user.avatar_url}/>
    </Layout>
)

User.getInitialProps = async function (context) {
    console.log('set timeout');
    const { id } = context.query
    const res = await fetch(`https://api.github.com/users/${id}`)
    const user = await res.json()

    console.log(`Fetched user: ${user.login}`)

    return { user }
}

export default User
