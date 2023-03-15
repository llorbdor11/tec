//引用 HTTP、HTTPS 模块
const http = require('http');
const https = require('https');

// 创建 HTTP(s) 请求头对象
function createReqOptions(url, req) {
  const headers = Object.assign({}, req.headers);
  headers.host = new URL(url).host;
  headers['Content-Length'] = req.headers['content-length'] || 0;
  headers['X-Forwarded-Host'] = req.headers.host;

  return {
    hostname: new URL(url).hostname,
    path: new URL(url).pathname + new URL(req.url).search,
    method: req.method,
    headers,
  };
}

// 处理 HTTP(s) 请求
function handleRequest(req, res) {
  const options = createReqOptions('https://www.example.com', req);
  const proxyRequest = https.request(options, (proxyResponse) => {
    res.writeHead(
      proxyResponse.statusCode,
      proxyResponse.headers
    );
    proxyResponse.pipe(res);
  });
  req.pipe(proxyRequest);
  proxyRequest.on('error', (err) => {
    console.error(err);
  });
}

// 导出函数接口
module.exports = (req, res) => {
  handleRequest(req, res);
};
