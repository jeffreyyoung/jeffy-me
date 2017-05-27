import Link from 'next/link'


const Header = () => (
    <div>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/drawing">
          <a>Draw</a>
        </Link>
        <style jsx>{`
          div {
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
          }
          a {
            color: white;
            text-decoration: none;
            margin-right: 15px;
            padding: 10px;
            border-radius: 5px;
            background-color: dodgerblue;
          }
        `}</style>
    </div>
)

export default Header
