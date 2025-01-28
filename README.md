# Electron TLS Ed25519 Bug Testcase

This demonstrates an issue of Electron with handling Ed25519 TLS connections.

## Preparation

1. Ensure to have at least Node.js 22+ and correlating NPM installed.
2. Run `npm i`.

## Tested Environment

1. OS: Windows 11 Pro 24H2 (26100.3025)<br>
   Node.js: 22.13.1<br>
   Electron: 34.0.1

## Procedure

1. Run in one Terminal:
   ```shell
   npm run server
   ```

2. Run the client tests:

    1. ✅ Run the Node.js version (which works as expected):
       ```shell
       npm run client-node
       ```
       Expected output:
       * Server:
         ```text
         HTTPS server running on https://localhost:9999
         TLS 21960: net.Server.on(connection): new TLSSocket
         TLS 21960: server _init handle? true
         TLS 21960: server initRead handle? true buffered? 0
         TLS 21960: server onhandshakestart
         TLS 21960: server onhandshakedone
         TLS 21960: server _finishInit handle? true alpn false servername localhost
         TLS 21960: server emit secureConnection
         ```
       * Client:
         ```text
         TLS 32144: client _init handle? true
         TLS 32144: client initRead handle? true buffered? false
         TLS 32144: client _start handle? true connecting? false requestOCSP? false
         TLS 32144: client onhandshakedone
         TLS 32144: client _finishInit handle? true alpn false servername localhost
         TLS 32144: client emit secureConnect. authorized: true
         TLS 32144: client emit session
         TLS 32144: client emit session
         statusCode: 200
         headers: {
           date: 'Tue, 28 Jan 2025 14:14:16 GMT',
           connection: 'keep-alive',
           'keep-alive': 'timeout=5',
           'transfer-encoding': 'chunked'
         }
         ```

    2. ❌ Run the Electron version (which will fail):
       ```shell
       npm run client-electron
       ```
       Expected output:
       * Server:
         ```text
         TLS 30304: net.Server.on(connection): new TLSSocket
         TLS 30304: server _init handle? true
         TLS 30304: server initRead handle? true buffered? 0
         TLS 30304: server onhandshakestart
         TLS 30304: server onerror [Error: 107B0000:error:0A000076:SSL routines:tls_choose_sigalg:no suitable signature algorithm:c:\ws\deps\openssl\openssl\ssl\t1_lib.c:3254:
         ] {
           library: 'SSL routines',
           reason: 'no suitable signature algorithm',
           code: 'ERR_SSL_NO_SUITABLE_SIGNATURE_ALGORITHM'
         } had? false
         TLS 30304: server emit tlsClientError: [Error: 107B0000:error:0A000076:SSL 
                    routines:tls_choose_sigalg:no suitable signature 
                               algorithm:c:\ws\deps\openssl\openssl\ssl\t1_lib.c:3254:
         ] {
           library: 'SSL routines',
           reason: 'no suitable signature algorithm',
           code: 'ERR_SSL_NO_SUITABLE_SIGNATURE_ALGORITHM'
         }
         ```
       * Client:
         ```text
         TLS 41608: client _init handle? true
         TLS 41608: client initRead handle? true buffered? false
         TLS 41608: client _start handle? true connecting? false requestOCSP? false
         Error: write EPROTO 1009216:error:10000410:SSL routines:OPENSSL_internal:SSLV3_ALERT_HANDSHAKE_FAILURE:..\..\third_party\boringssl\src\ssl\tls_record.cc:579:SSL alert number 40
         
             at WriteWrap.onWriteComplete [as oncomplete] (node:internal/stream_base_commons:95:16) {
           errno: -4046,
           code: 'EPROTO',
           syscall: 'write'
         }
         TLS 41608: client onerror [Error: 1009216:error:10000410:SSL routines:OPENSSL_internal:SSLV3_ALERT_HANDSHAKE_FAILURE:..\..\third_party\boringssl\src\ssl\tls_record.cc:579:SSL alert number 40
         ] {
           library: 'SSL routines',
           function: 'OPENSSL_internal',
           reason: 'SSLV3_ALERT_HANDSHAKE_FAILURE',
           code: 'ERR_SSL_SSLV3_ALERT_HANDSHAKE_FAILURE'
         } had? true
         ```
