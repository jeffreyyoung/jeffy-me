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

export default props => {
  return (
    <div className='layout-wrapper'>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        {/* Import CSS for nprogress */}
        <link rel='stylesheet' type='text/css' href='/static/nprogress.css' />
      </Head>
      <Header />
      <div className='layout-content-wrapper'>
        {props.children}
      </div>
      <style jsx>{`
        .layout-wrapper {
          padding: 10px;
          display: flex;
          flex: 1;
          flex-direction: column;
        }
        .layout-content-wrapper {
          display: flex;
          flex: 1;
          flex-direction: column;
        }
      `}</style>
      <style jsx global>{`
        * {
          font-family: sans-serif;
        }
        html, body, .main-next-wrapper, .main-next-wrapper > div, #__next, #__next > div {height: auto; height: 100%;margin: 0;padding: 0;}
        #__next > div {display:flex; flex:1;}

      `}</style>
    </div>
  )
};

//        html, body, body > div, #__next, #__next > div {height: 100%;margin: 0;padding: 0;}
//        #__next > div {display:flex; flex:1;}
