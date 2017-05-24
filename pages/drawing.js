import Layout from '../components/Layout.js'
import DrawingBoard from '../components/DrawingBoard.js'
import Head from 'next/head'

export default () => (
  <Layout>
    <Head>
      {/* Import CSS for nprogress */}
      <link rel='stylesheet' type='text/css' href='/static/drawingboard.css' />
      <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
      <script src='/static/drawingboard.js' />
    </Head>
    <DrawingBoard />
  </Layout>
)
