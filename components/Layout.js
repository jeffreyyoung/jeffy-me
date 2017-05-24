import Header from './Header'
import Router from 'next/router'
import React from 'react'
import NProgress from 'nprogress'
import Head from 'next/head'

NProgress.configure({ showSpinner: false });
Router.onRouteChangeStart = (url) => {
  console.log(` yeeehaw Loading: ${url}`)
  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
}

export default props => {
  return (<div style={layoutStyle}>
    <Head>
      {/* Import CSS for nprogress */}
      <link rel='stylesheet' type='text/css' href='/static/nprogress.css' />
    </Head>
    <Header />
    {props.children}
  </div>)
};
