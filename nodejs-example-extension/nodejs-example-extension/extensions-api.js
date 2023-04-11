const fetch = require('node-fetch');
const {basename} = require('path');

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-01-01/extension`;

async function register() {
    const res = await fetch(`${baseUrl}/register`, {
        method: 'post',
        body: JSON.stringify({
            'events': [
                'INVOKE',
                'SHUTDOWN'
            ],
        }),
        headers: {
            'Content-Type': 'application/json',
            'Lambda-Extension-Name': basename(__dirname),
        }
    });

    if (!res.ok) {
        console.error('register failed', await res.text());
    }

    return res.headers.get('lambda-extension-identifier');
}

// async function error(extensionId) {
//   const res = await fetch(`${baseUrl}/exit/error`, {
//       method: 'post',
//       body: JSON.stringify({
//               "errorMessage" : "Error parsing event data.",
//               "errorType" : "InvalidEventDataException",
//               "stackTrace": [ ]
//         }),
//       headers: {
//           'Content-Type': 'application/json',
//           'Lambda-Extension-Identifier': extensionId,
//           'Lambda-Extension-Function-Error-Type': 'Extension.BEEP'
//       }
//   });
//   console.log('res: ', res)
//   return await res.json();
// }

async function next(extensionId) {
    const res = await fetch(`${baseUrl}/event/next`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Lambda-Extension-Identifier': extensionId,
        }
    });

    if (!res.ok) {
        console.error('next failed', await res.text());
        return null;
    }
    return await res.json();
}

async function getPayload() {
  console.log('IN GET PAYLOAD')
    const res = await fetch(`http://${process.env.AWS_LAMBDA_RUNTIME_API}/2018-06-01/runtime/invocation/next`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        console.error('test failed', await res.text());
        return null;
    }
    console.log('res from test: ', res)

    return await res.json();
}


async function error(requestId) {
  const res = await fetch(`http://${process.env.AWS_LAMBDA_RUNTIME_API}/2018-06-01/runtime/invocation/${requestId}/error`, {
      method: 'post',
      body: JSON.stringify({
              "errorMessage" : "Error parsing event data.",
              "errorType" : "InvalidEventDataException",
              "stackTrace": [ ]
        }),
      headers: {
          'Content-Type': 'application/json',
          'Lambda-Runtime-Function-Error-Type': 'Extension.Error'
      }
  });
  console.log('error: ', res)
  return await res.json();
}

async function initError() {
  const res = await fetch(`http://${process.env.AWS_LAMBDA_RUNTIME_API}/2018-06-01/runtime/init/error`, {
      method: 'post',
      body: JSON.stringify({
              "errorMessage" : "Error parsing event data.",
              "errorType" : "InvalidEventDataException",
              "stackTrace": [ ]
        }),
      headers: {
          'Content-Type': 'application/json',
          'Lambda-Runtime-Function-Error-Type': 'Extension.Error'
      }
  });
  console.log('INIT ERROR: ', res)
  return await res.json();
}



module.exports = {
    register,
    next,
    error,
    getPayload,
    initError
};
