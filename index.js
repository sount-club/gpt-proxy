const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
  target: 'https://api.openai.com',
  changeOrigin: true,
  pathRewrite: {
    '^/': '/'
  },
  onProxyReq: (proxyReq, req, res) => {
    // 从请求头中读取Authorization字段，并添加到代理请求的请求头中
    const authHeader = req.headers.authorization;
    if (authHeader) {
      proxyReq.setHeader('Authorization', authHeader);
    }
  }
}));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

const port =process.env.PORT || 3000
app.listen(port, () => {
  console.log('Proxy server listening on port 4000!');
});
